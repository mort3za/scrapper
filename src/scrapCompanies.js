// const puppeteer = require("puppeteer");

const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer-core");
const url = "http://www.tsetmc.com/Loader.aspx?ParTree=15131F";

require("./env.js");
const executablePath = process.env.chrome_path;
main();

async function main() {
  const browser = await puppeteer.launch({
    executablePath,
    headless: false,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "networkidle2",
  });

  const companies = await page
    .evaluate(() => {
      const result = [];
      const categories = [
        { id: 1, name: "خدمات فني و مهندسي" },
        { id: 2, name: "اطلاعات و ارتباطات" },
        { id: 3, name: "رايانه و فعاليت‌هاي وابسته به آن" },
        { id: 4, name: "انبوه سازي، املاك و مستغلات" },
        { id: 5, name: "اوراق تامين مالي" },
        { id: 6, name: "صندوق سرمايه گذاري قابل معامله" },
        { id: 7, name: "فعاليتهاي كمكي به نهادهاي مالي واسط" },
        { id: 8, name: "بيمه وصندوق بازنشستگي به جزتامين اجتماعي" },
        { id: 9, name: "واسطه‌گري‌هاي مالي و پولي" },
        { id: 10, name: "مخابرات" },
        { id: 11, name: "حمل و نقل آبي" },
        { id: 12, name: "حمل ونقل، انبارداري و ارتباطات" },
        { id: 13, name: "اوراق حق تقدم استفاده از تسهيلات مسكن" },
        { id: 14, name: "ساير واسطه گريهاي مالي" },
        { id: 15, name: "بانكها و موسسات اعتباري" },
        { id: 16, name: "سرمايه گذاريها" },
        { id: 17, name: "ساير محصولات كاني غيرفلزي" },
        { id: 18, name: "سيمان، آهك و گچ" },
        { id: 19, name: "كاشي و سراميك" },
        { id: 20, name: "خرده فروشي،باستثناي وسايل نقليه موتوري" },
        { id: 21, name: "پيمانكاري صنعتي" },
        { id: 22, name: "محصولات شيميايي" },
        { id: 23, name: "مواد و محصولات دارويي" },
        { id: 24, name: "محصولات غذايي و آشاميدني به جز قند و شكر" },
        { id: 25, name: "عرضه برق، گاز، بخاروآب گرم" },
        { id: 26, name: "شرکتهاي چند رشته اي صنعتي" },
        { id: 27, name: "قند و شكر" },
        { id: 28, name: "خودرو و ساخت قطعات" },
        { id: 29, name: "ساخت دستگاه‌ها و وسايل ارتباطي" },
        { id: 30, name: "ماشين آلات و دستگاه‌هاي برقي" },
        { id: 31, name: "ماشين آلات و تجهيزات" },
        { id: 32, name: "ساخت محصولات فلزي" },
        { id: 33, name: "فلزات اساسي" },
        { id: 34, name: "توليد محصولات كامپيوتري الكترونيكي ونوري" },
        { id: 35, name: "لاستيك و پلاستيك" },
        { id: 36, name: "فراورده هاي نفتي، كك و سوخت هسته اي" },
        { id: 37, name: "انتشار، چاپ و تکثير" },
        { id: 38, name: "محصولات كاغذي" },
        { id: 39, name: "محصولات چوبي" },
        { id: 40, name: "دباغي، پرداخت چرم و ساخت انواع پاپوش" },
        { id: 41, name: "منسوجات" },
        { id: 42, name: "استخراج ساير معادن" },
        { id: 43, name: "استخراج کانه هاي فلزي" },
        { id: 44, name: "استخراج نفت گاز و خدمات جنبي جز اکتشاف" },
        { id: 45, name: "استخراج زغال سنگ" },
        { id: 46, name: "زراعت و خدمات وابسته" },
      ];

      const brandRows = Array.from(
        document.querySelectorAll(".other#main > div:not(.t0head)")
      );
      brandRows.forEach((row) => {
        let currentCategory = "";

        const isCategoryRow = row.classList.contains("secSep");
        if (isCategoryRow) {
          currentCategory = row.innerText;
        } else {
          result.push(brandDomToJson({ row, currentCategory }));
        }
      });

      function brandDomToJson({ row, currentCategory }) {
        console.log("row", row);
        const childs = row.childNodes;
        return {
          category: (
            categories.find((category) => category.name === currentCategory) ||
            {}
          ).id,
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
        };
      }

      return { data: result };
    })
    .catch((err) => {
      console.log("Error in evaluate companies.");
    });

  console.log(`companies (count: ${companies.data.length}):`, companies.data);

  fs.writeFileSync(
    path.join(__dirname, "..", "dist", "companies.json"),
    JSON.stringify(companies, null, 2),
    "utf8",
    (err) => {
      if (err) {
        console.error("could not save companies to file.");
        return;
      }
      console.log("Done.");
    }
  );

  await browser.close();
}
