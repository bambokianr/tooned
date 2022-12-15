const express = require('express');
const localStorage = require('./localStorage');
const S3Storage = require('./S3Storage');

const server = express();
const router = express.Router();

server.use(express.json({ extended: true }));

function getLastFridayDate(formatted = true) {
  let lastFridayDate = new Date();
  lastFridayDate.setDate(lastFridayDate.getDate() - (lastFridayDate.getDay() + 2) % 7);

  const lastFridayDay = ("0" + lastFridayDate.getDate()).slice(-2);
  const lastFridayMonth = ("0" + (lastFridayDate.getMonth() + 1)).slice(-2);
  const lastFridayYear = lastFridayDate.getFullYear();

  const formattedLastFridayDate = `${lastFridayDay}/${lastFridayMonth}/${lastFridayYear}`;

  if (formatted)
    return formattedLastFridayDate;
  else return formattedLastFridayDate.replace(/\//g, "");
};

const genresJson = localStorage.readData("genres");
function getFormattedGenreName(key) {
  if (!genresJson[key])
    return key;
  return genresJson[key];
};

router.get("/", (req, res) => {
  res.json({ successMessage: "server is up!" });
});

router.get("/genres", async (req, res) => {
  let { weeklyDate } = req.query;
  if (!weeklyDate) weeklyDate = getLastFridayDate();

  try {
    const fileData = await S3Storage.readData(weeklyDate.replace(/\//g, ""));

    const genres = fileData.map(item => {
      return {
        name: getFormattedGenreName(item.genreName),
        everynoiseLink: item.everynoiseLink,
        tracksCount: item.tracksCount,
      };
    });

    res.json({ weeklyDate, genres });
  } catch (err) {
    console.log("GET/genres - read file error", err);
    res.status(500).json({ errorMessage: `could not read ${weeklyDate.replace(/\//g, "")}.json file` });
  }
});

router.get("/releases", async (req, res) => {
  let { weeklyDate, genreName } = req.query;

  if (!!weeklyDate)
    weeklyDate = weeklyDate.replace(/\//g, "");
  else weeklyDate = getLastFridayDate(false);

  try {
    const fileData = await S3Storage.readData(weeklyDate);

    if (!genreName) {
      const data = fileData.map(item => {
        return { ...item, genreName: getFormattedGenreName(item.genreName) };
      });
      res.json(data);
    } else {
      const data = fileData.filter(item =>
        getFormattedGenreName(item.genreName) === genreName)[0];

      (!data)
        ? res.status(400).json({ errorMessage: `'genreName' not found in ${weeklyDate}.json file` })
        : res.json({ ...data, genreName: getFormattedGenreName(data.genreName) });
    };
  } catch (err) {
    console.log("GET/releases - read file error", err);
    res.status(500).json({ errorMessage: `could not read ${weeklyDate}.json file` });
  };
});

server.use(router);

server.listen(3333, () => console.log("server listening on port 3333..."));