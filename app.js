// const puppeteer = require("puppeteer");

// (async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto("https://example.com");
//   await page.screenshot({ path: "example.png" });

//   await browser.close();
// })();

const fs = require("fs");
const puppeteer = require("puppeteer-core");
const executablePath =
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";

const url = "http://www.tsetmc.com/Loader.aspx?ParTree=15131F";
main();

const categories = require("./static_data/categories.json");

async function main() {
  const browser = await puppeteer.launch({
    executablePath,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "networkidle2",
  });

  const companies = await page.evaluate(() => {
    const result = [];
    const brandRows = Array.from(
      document.querySelectorAll(".other > div:not(.secSep):not(.t0head)")
    );
    brandRows.forEach((row) => {
      const childs = row.childNodes;
      result.push({
        category: 1,
        abbr: childs[0].innerText,
        name: childs[1].innerText,
        count: childs[2].innerText,
        volume: childs[3].innerText,
        value: childs[4].innerText,
        lastDay: childs[5].innerText,
        first1: childs[6].innerText,
        amount1: childs[7].innerText,
        lastTrade: {
          change: childs[8].innerText,
          percent: childs[9].innerText,
        },
        amount2: childs[10].innerText,
        lastPrice: {
          change: childs[11].innerText,
          percent: childs[12].innerText,
        },
        min: childs[13].innerText,
        max: childs[14].innerText,
        EPS: childs[15].innerText,
        PE: childs[16].innerText,
        count2: childs[17].innerText,
        volume2: childs[18].innerText,
        buy: {
          price: childs[19].innerText,
        },
        sell: {
          price: childs[20].innerText,
          volume: childs[21].innerText,
          count: childs[22].innerText,
        },
      });
    });

    return result;
  });

  console.log("log companies", companies);

  await browser.close();
}
