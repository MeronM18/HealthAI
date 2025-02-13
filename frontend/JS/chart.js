window.onload = function() {
  const ctx = document.getElementById('myChart').getContext('2d');

  new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Scatter',
        data: [{x:-10,y:0}],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        x: {
          type: 'linear',
          position: 'bottom'
        }
      }
    }
  });
};
