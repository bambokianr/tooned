const chromium = require('chrome-aws-lambda');
const AWS = require('aws-sdk');

const everynoiseUrl = "https://everynoise.com/new_releases_by_genre.cgi?region=BR&albumsonly=&style=cards&date=&genre=local&hidedupes=on&artistsfrom=";

exports.handler = async (event, context, callback) => {
  let result = null;
  let browser = null;

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);

    result = await getWeeklyReleasesFromEveryNoise(page);
    const { weekDate, tracksByGenreList } = result;
    await saveDataIntoS3Storage(weekDate.replace(/\//g, ""), tracksByGenreList);
  } catch (error) {
    return callback(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    };
  };

  return callback(null, result);
};

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

async function saveDataIntoS3Storage(fileName, fileContent) {
  try {
    const S3 = new AWS.S3({ region: process.env.AWS_REGION });

    const params = {
      Bucket: `${process.env.AWS_S3_BUCKET}/releases`,
      Key: `${fileName}.json`,
      Body: JSON.stringify(fileContent),
    };

    const data = await S3.upload(params).promise();

    console.log(`'${fileName}.json' created remotely!`);
    console.log(`URL: ${data.Location}`);

    return data.Location;
  } catch (err) {
    console.error("[ERROR] S3Storage/saveData", err);
  };
};