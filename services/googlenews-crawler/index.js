const puppeteer = require('puppeteer');

async function scrapingGoogleNews(searchTag) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);

  await page.goto("https://news.google.com/");

  await page.type(".Ax4B8.ZAGvjd", `${searchTag} when:7d`);
  page.keyboard.press("Enter");

  await page.waitForSelector(".HKt8rc.CGNRMc");

  const articles = await page.evaluate(() => {
    const divElements = Array.from(document.querySelectorAll("div[class='NiLAwe y6IFtc R7GTQ keNKEd j7vNaf nID9nc']"));
    return divElements.map(divElement => {
      const link = divElement.querySelector("a").href;
      const img = divElement.querySelector("img[class='tvs3Id QwxBBf']").getAttribute("srcset");
      const font = divElement.querySelector("a[class='wEwyrc AVN2gc WfKKme ']").innerText;
      const title = divElement.querySelector("a[class='DY5T1d RZIKme']").innerText;
      const postedAt = divElement.querySelector("time[class='WW6dff uQIVzc Sksgp slhocf']").innerText;

      return { title, font, link, img, postedAt };
    });
  });
  console.log(articles);

  await browser.close();
};

scrapingGoogleNews("Pitty");