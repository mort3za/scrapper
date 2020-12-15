// const puppeteer = require("puppeteer");

const puppeteer = require("puppeteer-core");
const { writeToJson } = require("./utils/helpers.js");

require("./env.js");
const executablePath = process.env.chrome_path;
const url = process.env.shareholders_1;

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

      brandRows.forEach((row) => {
        result.push(domToJson({ row }));
      });

      function numberCleaner(input) {
        const cleanedupExtraChars = String(input || "").replace(/[\(\),]/g, "");
        return Number(cleanedupExtraChars);
      }

      function domToJson({ row }) {
        const childs = row.childNodes;
        return {
          name: (childs[0].querySelector("div a") || {}).innerText,
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
      console.log("response", response);
      // console.log(`shareholders  count: ${shareholders.data.length}`);
      writeToJson({ filename: "shareholders.json", data: response });
      return response;
    })
    .catch((err) => {
      console.log("Error in evaluate shareholders.");
    });

  await browser.close();
}
