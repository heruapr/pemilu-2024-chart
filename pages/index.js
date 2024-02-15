import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(ChartDataLabels);

export default function Home() {
  const [scrapedData, setScrapedData] = useState(null);
  const canvasRefs = useRef([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (scrapedData) {
      createCharts();
    }
  }, [scrapedData]);

  const createCharts = async () => {
    console.log(scrapedData);
    scrapedData.forEach((data, index) => {
      const canvas = canvasRefs.current[index];
      const ctx = canvas.getContext("2d");

      let chartStatus = Chart.getChart(ctx);
      if (chartStatus != undefined) {
        chartStatus.destroy();
      }

      new Chart(ctx, {
        type: "pie",
        data: {
          labels: data.labels,
          datasets: [
            {
              label: data.label,
              data: data.data,
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
              ],
              borderColor: data.borderColor,
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
              //   datalabels: {
              //     color: '#36A2EB'
              //   }
            },
            title: {
              display: true,
              text: data.title,
            },
          },
        },
      });
    });
  };

  const fetchData = async () => {
    try {
      const response = await fetch("/api/scrape");
      if (response.ok) {
        const data = await response.json();
        const chartData = [];

        data.data.forEach((item) => {
          const chartItem = {
            title: item.location,
            labels: [],
            data: [],
            backgroundColor: [],
            borderColor: [],
          };

          item.value.forEach((val, index) => {
            if (val.percentage !== undefined) {
              chartItem.labels.push("PASLON " + (index + 1));
              chartItem.data.push(val.percentage);
              chartItem.backgroundColor.push(getRandomColor());
              chartItem.borderColor.push(getRandomColor());
            }
          });

          chartData.push(chartItem);
        });

        setScrapedData(chartData);
      } else {
        console.error("Failed to fetch data:", response.status);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    // <div>
    //   <h1>Election Pie Chart: The data is retrieved by web scraping from www.kawalpemilu.org.</h1>
    //   <h2>Please note that this data is not final; refer to <a href="https://kawalpemilu.org">www.kawalpemilu.org</a> for detailed information. </h2>
    //   <h4>maintained by heruapr</h4>
    //   {/* <h3>Contact heruapr.dev@gmail.com if you need the web API for this web-scraped data.</h3> */}
    //   {scrapedData ? (
    //     scrapedData.map((_, index) => (
    //       <div key={index}>
    //         <canvas ref={(ref) => (canvasRefs.current[index] = ref)}></canvas>
    //       </div>
    //     ))
    //   ) : (
    //     <button onClick={fetchData}>Fetch Data</button>
    //   )}
    // </div>
<div>
  <h1>Election Pie Chart: The data is retrieved by web scraping from www.kawalpemilu.org.</h1>
  <h2>Please note that this data is not final; refer to <a href="https://kawalpemilu.org">www.kawalpemilu.org</a> for detailed information. </h2>
  <h4>maintained by heruapr</h4>
  {scrapedData ? (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gridGap: '10px' }}>
      {scrapedData.map((_, index) => (
        <div key={index}>
          <canvas ref={(ref) => (canvasRefs.current[index] = ref)}></canvas>
        </div>
      ))}
    </div>
  ) : (
    <button onClick={fetchData}>Fetch Data</button>
  )}
</div>



  );
}
