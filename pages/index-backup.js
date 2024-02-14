// pages/index.js
import { useState } from "react";
import Chart from 'chart.js/auto';
import { useRef, useEffect } from 'react';

export default function Home() {
  const [scrapedData, setScrapedData] = useState(null);
  const canvas = useRef();

  useEffect(() => {
    const ctx = canvas.current;

    let chartStatus = Chart.getChart('myChart');
      if (chartStatus != undefined) {
        chartStatus.destroy();
    }

    const chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['PASLON 1', 'PASLON 2', 'PASLON 3'],
        datasets: [
          {
            label: 'Dataset 1',
            data: [12, 19, 9],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'ACEH',
          },
        },
      },
    });
  }, []);

  // Function to fetch data from API route
  const fetchData = async () => {
    try {
      const response = await fetch("/api/scrape");
      if (response.ok) {
        const data = await response.json();
        const percentagesPaslon1 = [];

        data.data.forEach((item) => {
          if (item.value) {
            item.value.forEach((val) => {
              if (val.percentage !== undefined) {
                // Check if "percentage" field exists
                percentagesPaslon1.push(val.percentage);
              }
            });
          }
        });
        console.log(percentagesPaslon1)

        setScrapedData(percentagesPaslon1[1]);
      } else {
        console.error("Failed to fetch data:", response.status);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <h1>Scraped Data</h1>
      {scrapedData ? (
        <pre>{JSON.stringify(scrapedData, null, 2)}</pre>
      ) : (
        <button onClick={fetchData}>Fetch Data</button>
      )}
      <canvas ref={canvas}></canvas>
    </div>
  );
}
