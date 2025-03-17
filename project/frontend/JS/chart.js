const getChartOptions = () => {
  return {
    series: [10, 0, 0],  // Data for the doughnut
    colors: ["#0fb040", "#e72e2e", "#1c56c1"],  // Colors for the slices
    chart: {
      height: 220,
      width: "100%",
      type: "donut",  // Ensure the type is donut
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,  // Show the labels inside the doughnut
            name: {
              show: true,  // Show the name of each segment
              fontFamily: "Inter, sans-serif",  // Set font
              fontSize: '18px',  // Size of the name text
              fontWeight: 700,  // Font weight of the name
              color: '#FF5733',  // Color of the name
              offsetY: 20,  // Vertical offset of the name text
            },
            value: {
              show: true,  // Show the value inside the doughnut
              fontFamily: "Inter, sans-serif",  // Font family for the value
              fontSize: '21px',  // Size of the value text
              color: '#FFFFFF',  // Color of the value text
              offsetY: -20,  // Vertical offset of the value text
              formatter: function (value) {
                return value + "kcal";  // Format the value
              },
            },
            total: {
              showAlways: true,  // Always show the total label
              show: true,
              label: "Remaining",  // Label for the total
              fontFamily: "Inter, sans-serif",
              fontSize: '18px',
              color: '#FF5733',  // Color of the total text
              formatter: function (w) {
                const sum = w.globals.seriesTotals.reduce((a, b) => {
                  return a + b;
                }, 0);
                return sum + ' kcal';  // Total sum value formatting
              },
            },
          },
          size: "80%",  // Set the size of the donut
        },
      },
    },
    dataLabels: {
      enabled: false,  // Disable the default data labels
    },
    labels: [
      `Goal: 10 kcal`,  // Show label with value
      `Food: 0 kcal`,  // Show label with value
      `Exercise: 0 kcal`,  // Show label with value
    ],  // Labels for the donut slices, now including values
    legend: {
      position: 'right',
      fontSize: '25px',  // Font size for legend labels
      fontFamily: 'Inter, sans-serif',  // Font family for the legend
      fontWeight: 700,
      color: '#ffffff',  // Font weight for the legend
      markers: {
        width: 12,  // Width of the marker
        height: 12,  // Height of the marker
      },
      itemMargin: {
        horizontal: 0,  // Horizontal margin between legend items
        vertical: 12,  // Vertical margin between legend items
      },
    },
  };
};

document.addEventListener('DOMContentLoaded', function () {
  const chart = new ApexCharts(document.getElementById("donut-chart"), getChartOptions());
  chart.render();
});

/******************************************************************************************************************************************************************* */
// Ensure the DOM is fully loaded before running the code
document.addEventListener("DOMContentLoaded", function() {
  // Example data for the bar chart
  const labels = ["January", "February", "March", "April", "May", "June", "July", "January", "February", "March", "April", "May", "June", "July"];  // Example months
  const data = {
    labels: labels,
    datasets: [{
      label: 'Bar Graph',
      data: [],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)'
      ],
      borderWidth: 1
    }]
  };

  // Configuration for the chart
  const config = {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
  };

  
  // Create the chart when the DOM is ready
  const ctx = document.getElementById('barchart').getContext('2d');
  new Chart(ctx, config);
});

/*******************************************************************************************************************************************************************/

document.addEventListener("DOMContentLoaded", function(){

  const data = {
    datasets: [{
      label: 'Scatter Cjart',
      data: [],
      backgroundColor: 'rgb(255, 99, 132)'
    }],
  };

  const config = {
    type: 'scatter',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'linear',
          position: 'bottom'
        }
      }
    }
  };

  const ctx = document.getElementById('scatterchart').getContext('2d');
  new Chart(ctx, config);
});

/********************************************************************************************************************************************************** */

document.addEventListener("DOMContentLoaded", function() {
  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];  // Array of months
  const data = {
    labels: labels,
    datasets: [{
      label: 'My First Dataset',
      data: [],
      fill: false,
      borderColor: 'rgb(75, 192, 192)', 
      tension: 0.1  
    }]
  };

  const config = {
    type: 'line', 
    data: data,
    options: {
      scales: {
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.45)'
          }
        },
        y: {
          grid: {
            color: 'rgba(255, 255, 255, 0.45)'
          }
        }
      }
    }
  };

  const ctx = document.getElementById('linechart').getContext('2d');
  new Chart(ctx, config);  
});

/******************************************************************************************************************************* */
document.addEventListener("DOMContentLoaded", function(){
  const DATA_COUNT = 3;
  const labels = ['Protein', 'Carbohydrates', 'Fats']; 
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Grams',
        data: [],  // Sample data
        borderColor: 'rgb(0, 0, 0)',
        backgroundColor: 'rgb(34, 43, 56)',
      },
      {
        label: 'Percentage',
        data: [], 
        borderColor: 'rgb(0, 0, 0)',
        backgroundColor: 'rgb(21,27,35)',
      }
    ]
  };

  const config = {
    type: 'bar',
    data: data,
    options: {
      indexAxis: 'y', 
      elements: {
        bar: {
          borderWidth: 2,
        }
      },
      responsive: true,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: '#ffffff',
          },
        },
        title: {
          display: true,
          text: 'Macros',
          font: {
            size: 32,
            weight: 700,
          },
          color:'rgb(196, 217, 255)',
        }
      },
      scales: {
        x: {
          min: 0,
          max: 100,
          ticks: {
            color: '#ffffff',
            stepSize: 10,
          },
        },
        y: {
          ticks: {
            color: '#ffffff',
          },
        }
      }
    },
  };

  const ctx = document.getElementById('macroChart').getContext('2d');
  new Chart(ctx, config);
});

/********************************************************************************************************** */

const calorieData = [
  { category: 'Gym'},
  { category: 'Cardio'},
  { category: 'Sports'},
  { category: 'Outdoor'}
];

const chartColors = [
  'rgb(54, 162, 235)',   
  'rgb(255, 221, 0)',   
  'rgb(247, 111, 0)',  
  'rgb(4, 148, 23)'  
];

document.addEventListener('DOMContentLoaded', function() {
  const ctx = document.getElementById('caloriechart');
  
  if (ctx) {
    let calorieChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: calorieData.map(item => item.category),
        datasets: [{
          label: 'Calories Burned',
          data: calorieData.map(item => item.calories),
          backgroundColor: calorieData.map((_, index) => chartColors[index % chartColors.length]),
          borderColor: calorieData.map((_, index) => chartColors[index % chartColors.length]),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgb(66, 66, 66)',
            },
            ticks: {
              color: 'rgb(250, 250, 250)',
            },
            title: {
              display: true,
              text: 'Calories',
              font: {
                size: 16,
              },
              color: '#ffffff',
            }
          },
          x: {
            grid: {
              color: 'rgb(66, 66, 66)',
            },
            ticks: {
              color: 'rgb(250, 250, 250)',
            }
          },
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: '#ffffff',
              usePointStyle: true,
              boxWidth: 20,
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.raw + ' calories';
              }
            }
          }
        }
      }
    });
  }
});