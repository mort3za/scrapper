// const puppeteer = require("puppeteer");

const { writeToJson } = require("./utils/helpers.js");
const puppeteer = require("puppeteer-core");

require("./env.js");
const executablePath = process.env.chrome_path;
const urlIndex = process.env.urlindex;
const url = process.env[`shareholders_${urlIndex}`];
main();

async function main() {
  const browser = await puppeteer.launch({
    executablePath,
    // headless: false,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  // page.on("console", (consoleObj) => console.log(consoleObj.text()));

  await page.goto(url, {
    waitUntil: "networkidle2",
  });

  await page
    .evaluate(() => {
      const result = [];

      const brandRows = Array.from(
        document.querySelectorAll(".content .table1 tbody > tr")
      );

      let shareHolder = "";
      brandRows.forEach((row) => {
        const childs = row.childNodes;
        const rowTitle = (childs[0].querySelector("div a") || {}).innerText;
        shareHolder = rowTitle || shareHolder;
        result.push(domToJson({ row, shareHolder }));
      });

      function numberCleaner(input) {
        const cleanedupExtraChars = String(input || "").replace(/[\(\),]/g, "");
        return Number(cleanedupExtraChars);
      }

      function domToJson({ row, shareHolder }) {
        const childs = row.childNodes;
        return {
          shareHolder,
          company: (childs[0].querySelector("li") || {}).innerText,
          change: {
            value: numberCleaner(childs[1].childNodes[0].textContent),
            amount: numberCleaner(
              (childs[1].querySelector("div.pn") || {}).innerText ||
                `-${(childs[1].querySelector("div.mn") || {}).innerText}`
            ),
          },
        };
      }

      return { data: result };
    })
    .then((response) => {
      // console.log("response", response);
      writeToJson({
        filename: `shareholders_${urlIndex}.json`,
        data: response,
      });
      return response;
    })
    .catch((err) => {
      console.log("Error in evaluate shareholders.");
    });

  await browser.close();
}
