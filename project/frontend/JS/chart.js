const getChartOptions = () => {
  return {
    series: [10, 0, 0],  //Data for the doughnut
    colors: ["#0fb040", "#e72e2e", "#1c56c1"],  //Colors for the slices
    chart: {
      height: 220,
      width: "100%",
      type: "donut",  //Ensure the type is donut
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,  //Show the labels inside the doughnut
            name: {
              show: true,  //Show the name of each segment
              fontSize: '18px',  //Size of the name text
              fontWeight: 700,  //Font weight of the name
              color: '#ffffff',  //Changed to white for "Calories" text
              offsetY: 20,  //Vertical offset of the name text
            },
            value: {
              show: true,  //Show the value inside the doughnut
              fontSize: '21px',  //Size of the value text
              color: '#FFFFFF',  //Already white for the "10kcal" value
              offsetY: -20,  //Vertical offset of the value text
              formatter: function (value) {
                return value + "kcal";  //Format the value
              },
            },
            total: {
              showAlways: true,  //Always show the total label
              show: true,
              label: "Remaining",  //Label for the total
              fontSize: '18px',
              color: '#a0a0a0',  //Changed to lighter gray for "Remaining" text
              formatter: function (w) {
                const sum = w.globals.seriesTotals.reduce((a, b) => {
                  return a + b;
                }, 0);
                return sum + ' kcal';  //Total sum value formatting
              },
            },
          },
          size: "80%",  //Set the size of the donut
        },
      },
    },
    dataLabels: {
      enabled: false,  //Disable the default data labels
    },
    labels: [
      `Goal: 10 kcal`,  //Show label with value
      `Food: 0 kcal`,  //Show label with value
      `Exercise: 0 kcal`,  //Show label with value
    ],  //Labels for the donut slices, now including values
    legend: {
      position: 'right',
      fontSize: '25px',  //Font size for legend labels
      fontWeight: 700,
      labels: {
        colors: '#ffffff',  //Changed legend text color to white
      },
      markers: {
        width: 12,  //Width of the marker
        height: 12,  //Height of the marker
      },
      itemMargin: {
        horizontal: 0,  //Horizontal margin between legend items
        vertical: 12,  //Vertical margin between legend items
      },
    },
  };
};

document.addEventListener('DOMContentLoaded', function () {
  const chart = new ApexCharts(document.getElementById("donut-chart"), getChartOptions());
  chart.render();
});

/********************************************************************************************************************************************************** */

document.addEventListener("DOMContentLoaded", function() {
  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];  //Array of months
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
document.addEventListener("DOMContentLoaded", function() {
  const DATA_COUNT = 3;
  const labels = ['Protein', 'Carbohydrates', 'Fats'];
  
  //Function to get configuration based on screen width
  function getChartConfig() {
    const screenWidth = window.innerWidth;
    
    //Base configuration
    const config = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Grams',
            data: [], //Sample data
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
      },
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
            color: 'rgb(196, 217, 255)',
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
    
    if (screenWidth <= 1550) {
      config.options.plugins.title.font = {
        size: 22,
        weight: 600
      };
      config.options.plugins.legend.position = 'bottom';
    } else {
      config.options.plugins.title.font = {
        size: 32,
        weight: 700
      };
    }
    
    if (screenWidth <= 1080) {
      config.options.plugins.title.font.size = 20;
      config.options.scales.x.ticks.stepSize = 20;
      //Hide legend on very small screens or adjust its position
      if (screenWidth < 768) {
        config.options.plugins.legend.display = false;
      }
    }
    
    return config;
  }
  
  const ctx = document.getElementById('macroChart').getContext('2d');
  const macroChart = new Chart(ctx, getChartConfig());
  
  window.addEventListener('resize', function() {
    macroChart.destroy(); //Destroy previous chart
    const newChart = new Chart(ctx, getChartConfig());
  });
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

document.addEventListener("DOMContentLoaded", function() {
  console.log('Chart.js loaded - not initializing linechart (handled by health.js)');
});