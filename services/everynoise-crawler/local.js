const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const everynoiseUrl = "https://everynoise.com/new_releases_by_genre.cgi?region=BR&albumsonly=&style=cards&date=&genre=local&hidedupes=on&artistsfrom=";

(async () => {
  let result = null;
  let browser = null;

  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);

    result = await getWeeklyReleasesFromEveryNoise(page);
    const { weekDate, tracksByGenreList } = result;
    saveDataIntoLocalStorage(weekDate.replace(/\//g, ""), tracksByGenreList);
  } catch (error) {
    return callback(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    };
  };
})();

async function getWeeklyReleasesFromEveryNoise(page) {
  await page.goto(everynoiseUrl);

  const weeklyReleases = await page.evaluate(() => {
    const unformatedWeekDate = document.querySelector("div[class='title']").querySelector("select[name='date']").querySelector("option[value][selected]").innerText;
    const formatedWeekDate = `${unformatedWeekDate.substr(6, 2)}/${unformatedWeekDate.substr(4, 2)}/${unformatedWeekDate.substr(0, 4)}`;

    const tracksByGenreList = Array.from(document.querySelectorAll("div[class='genrename']"))
      .map((genreElement) => {
        var albumListElement = Array.from(genreElement.nextElementSibling.querySelectorAll("div[class='albumbox album  ']"));
        const albumExtendedListElement = Array.from(genreElement.nextElementSibling.querySelectorAll("div[class='albumbox album  extended']"));
        albumListElement = albumListElement.concat(albumExtendedListElement);

        const tracks = albumListElement.map(albumElement => {
          const a = Array.from(albumElement.querySelectorAll("a"));

          return {
            name: a[1].innerText,
            mp3Preview: albumElement.querySelector("span[class='play']").getAttribute("preview_url"),
            spotifyId: albumElement.querySelector("span[class='play']").getAttribute("trackid"),
            imageUrl: albumElement.querySelector("span[class='play'] > img").src,
            artist: a[0].innerText,
          };
        });

        return {
          genreName: genreElement.querySelector("a").innerText,
          everynoiseLink: genreElement.querySelector("a").href,
          tracksCount: parseInt(genreElement.querySelector("span").innerText),
          tracks,
        };
      });

    return { weekDate: formatedWeekDate, tracksByGenreList };
  });

  return weeklyReleases;
};

function saveDataIntoLocalStorage(fileName, fileContent) {
  const filePath = path.join(__dirname, "/data", `/${fileName}.json`);

  fs.writeFile(filePath, JSON.stringify(fileContent), "utf8", (error, _) => {
    if (error) {
      console.error("[ERROR] localStorage/saveData", error);
    } else {
      console.log(`'${fileName}.json' created locally!`);
    };
  });
};

