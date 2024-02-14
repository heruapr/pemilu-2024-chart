import puppeteer from 'puppeteer-core'
import edgeChromium from 'chrome-aws-lambda'
// const puppeteer = require("puppeteer-core");
const regex = /(\d+\.\d+)/;
const locations = [
  "ACEH",
  "BALI",
  "BANTEN",
  "BENGKULU",
  "DAERAH ISTIMEWA YOGYAKARTA",
  "DKI JAKARTA",
  "GORONTALO",
  "JAMBI",
  "JAWA BARAT",
  "JAWA TENGAH",
  "JAWA TIMUR",
  "KALIMANTAN BARAT",
  "KALIMANTAN SELATAN",
  "KALIMANTAN TENGAH",
  "KALIMANTAN TIMUR",
  "KALIMANTAN UTARA",
  "KEPULAUAN BANGKA BELITUNG",
  "KEPULAUAN RIAU",
  "LAMPUNG",
  "MALUKU",
  "MALUKU UTARA",
  "NUSA TENGGARA BARAT",
  "NUSA TENGGARA TIMUR",
  "PAPUA",
  "PAPUA BARAT",
  "PAPUA BARAT DAYA",
  "PAPUA PEGUNUNGAN",
  "PAPUA SELATAN",
  "PAPUA TENGAH",
  "RIAU",
  "SULAWESI BARAT",
  "SULAWESI SELATAN",
  "SULAWESI TENGAH",
  "SULAWESI TENGGARA",
  "SULAWESI UTARA",
  "SUMATERA BARAT",
  "SUMATERA SELATAN",
  "SUMATERA UTARA",
  "LUAR NEGERI",
];

// export async function handler(req, res) {
//   try {
//     const response = await axios.get("https://kawalpemilu.org/about");
//     const html = response.data;
//     const $ = cheerio.load(html);

//     // Extract data from the HTML using Cheerio selectors
//     const scrapedData = $("span.kp[_ngcontent-ng-c3586536323]").text(); // Example: get text from all h1 elements
//     console.log("scraped data: " + html);

//     res.status(200).json(scrapedData);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// }

export default async function handler(req, res) {
  try {
    const browser = await puppeteer.launch({
        executablePath,
        args: edgeChromium.args,
        headless: false,
      })
    // const browser = await puppeteer.connect({
    //   browserWSEndpoint: "wss://chrome.browserless.io?token=",
    // });
    const page = await browser.newPage();
    await page.goto("https://kawalpemilu.org");
    await page.waitForSelector("app-root");
    await page.waitForSelector('tbody.data[_ngcontent-ng-c736795454=""]');
    const tableSelector = 'tbody.data[_ngcontent-ng-c736795454=""]';
    const trValues = await page.evaluate((selector) => {
      const rows = Array.from(document.querySelectorAll(selector + " tr"));
      const rowData = rows.map((row) => {
        const columns = Array.from(row.querySelectorAll("td"));
        const cellData = columns.map((column) => {
          const appPercent = column.querySelector("App-percent");
          if (appPercent) {
            const firstSpan = appPercent.querySelector("span");
            return firstSpan ? firstSpan.textContent.trim() : "";
          } else {
            return "";
          }
        });
        return cellData;
      });

      return rowData;
    }, tableSelector);

    const jsonData = {
      status: "success",
      message: "Data retrieved successfully",
      data: [],
    };

    for (let i = 0; i < trValues.length; i++) {
      const percentages = trValues[i].slice(1, 4);
      const value = percentages.map((percentage, index) => ({
        percentage: percentage.slice(0, -1),
      }));
      jsonData.data.push({
        id: i + 1,
        location: locations[i],
        value: value,
      });
    }

    // console.log(JSON.stringify(jsonData, null, 2));

    res.status(200).json(jsonData);

    await browser.close();
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
