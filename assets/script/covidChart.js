fetch('https://api.covidtracking.com/v1/us/daily.json')
  .then(response => response.json())
  .then(data => {
    const dateSelect = document.getElementById('dateSelect');
    const barContainer = document.getElementById('barContainer');
    const pieContainer = document.getElementById('pieContainer');
    const lineContainer = document.getElementById('lineContainer');
    const areaContainer = document.getElementById('areaContainer');
    const scatterContainer = document.getElementById('scatterContainer');

    let dates = data.map(entry => entry.date.toString());

    // Populate the selection list with dates
    dates.forEach(date => {
      const formattedDate = formatDate(date);
      const option = document.createElement('option');
      option.value = date;
      option.textContent = formattedDate;
      dateSelect.appendChild(option);
    });

    // Function to format date as YYYY/MM/DD
    function formatDate(date) {
      const year = date.slice(0, 4);
      const month = date.slice(4, 6);
      const day = date.slice(6, 8);
      return `${year}/${month}/${day}`;
    }

    // Set the first date as the default selection
    dateSelect.value = dates[0];

    // Function to format numbers with commas
    function formatNumber(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // Event listener for date select change
    dateSelect.addEventListener('change', () => {
      const selectedDate = dateSelect.value;
      const selectedData = data.find(entry => entry.date.toString() === selectedDate);
      if (selectedData) {
        const chartData = {
          positive: selectedData.positive,
          positiveIncrease: selectedData.positiveIncrease,
          negative: selectedData.negative,
          negativeIncrease: selectedData.negativeIncrease,
          deathIncrease: selectedData.deathIncrease,
          hospitalizedCumulative: selectedData.hospitalizedCumulative,
          inIcuCumulative: selectedData.inIcuCumulative,
          totalTestResults: selectedData.totalTestResults,
          totalTestResultsIncrease: selectedData.totalTestResultsIncrease,
          hospitalizedCurrently: selectedData.hospitalizedCurrently,
          death: selectedData.death,
          inIcuCurrently: selectedData.inIcuCurrently,
          onVentilatorCurrently: selectedData.onVentilatorCurrently,
          pending: selectedData.pending,
          hospitalized: selectedData.hospitalized
        };
        renderBarChart(chartData);
        renderPieChart(chartData);
        renderLineChart(chartData);
        renderAreaChart(chartData);
        renderScatterChart(chartData);
      }
    });

    // Function to render the Highcharts bar chart
    function renderBarChart(data) {
      barContainer.innerHTML = ''; // Clear the previous chart if any

      Highcharts.chart('barContainer', {
        chart: {
          type: 'bar'
        },
        title: {
          text: 'COVID-19 Data'
        },
        xAxis: {
          categories: ['Positive Increase', 'Negative Increase', 'Death Increase', 'Hospitalized Cumulative', 'In ICU Cumulative']
        },
        yAxis: {
          title: {
            text: 'Counts'
          }
        },
        series: [
          {
            name: 'USA',
            data: [
              data.positiveIncrease,
              data.negativeIncrease,
              data.deathIncrease,
              data.hospitalizedCumulative,
              data.inIcuCumulative
            ]
          }
        ]
      });
    }

    // Function to render the Highcharts pie chart
    function renderPieChart(data) {
      pieContainer.innerHTML = ''; // Clear the previous chart if any

      Highcharts.chart('pieContainer', {
        chart: {
          type: 'pie'
        },
        title: {
          text: 'COVID-19 Data Distribution'
        },
        series: [
          {
            name: 'USA',
            data: [
              { name: 'Positive Cases', y: data.positive},
              { name: 'Negative Cases', y: data.negative},
              { name: 'Hospitalized', y: data.hospitalized }, 
              { name: 'Deaths', y: data.death } 
            ]
          }
        ]
      });

      // Display formatted numbers in HTML elements
const positiveElement = document.getElementById('positive');
const positiveIncreaseElement = document.getElementById('positiveIncrease');
const negativeElement = document.getElementById('negative');
const negativeIncreaseElement = document.getElementById('negativeIncrease');
const deathElement = document.getElementById('death');
const hospitalizedElement = document.getElementById('hospitalized');

positiveElement.textContent = formatNumber(data.positive);
positiveIncreaseElement.textContent ='+'+ formatNumber(data.positiveIncrease);
negativeElement.textContent = formatNumber(data.negative);
negativeIncreaseElement.textContent ='-'+ formatNumber(data.negativeIncrease);
deathElement.textContent = formatNumber(data.death);
hospitalizedElement.textContent = formatNumber(data.hospitalized);
    }

    // Function to render the Highcharts line chart
    function renderLineChart(data) {
      lineContainer.innerHTML = ''; // Clear the previous chart if any

      Highcharts.chart('lineContainer', {
        chart: {
          type: 'line'
        },
        title: {
          text: 'COVID-19 Data Trend'
        },
        xAxis: {
          categories: ['Total Test Results', 'Total Test Results Increase']
        },
        yAxis: {
          title: {
            text: 'Counts'
          }
        },
        series: [
          {
            name: 'USA',
            data: [
              data.totalTestResults,
              data.totalTestResultsIncrease
            ]
          }
        ]
      });
    }

    // Function to render the Highcharts area chart
    function renderAreaChart(data) {
      areaContainer.innerHTML = ''; // Clear the previous chart if any

      Highcharts.chart('areaContainer', {
        chart: {
          type: 'area'
        },
        title: {
          text: 'COVID-19 Data Trend'
        },
        xAxis: {
          categories: ['Hospitalized Currently', 'Deaths', 'In ICU Currently', 'On Ventilator Currently']
        },
        yAxis: {
          title: {
            text: 'Counts'
          }
        },
        series: [
          {
            name: 'USA',
            data: [
              data.hospitalizedCurrently,
              data.death,
              data.inIcuCurrently,
              data.onVentilatorCurrently
            ]
          }
        ]
      });
    }

    // Function to render the Highcharts scatter chart
    function renderScatterChart(data) {
      scatterContainer.innerHTML = ''; // Clear the previous chart if any

      Highcharts.chart('scatterContainer', {
        chart: {
          type: 'scatter'
        },
        title: {
          text: 'COVID-19 Data Scatter'
        },
        xAxis: {
          categories: ['Pending', 'Hospitalized']
        },
        yAxis: {
          title: {
            text: 'Counts'
          }
        },
        series: [
          {
            name: 'USA',
            data: [
              { x: 0, y: data.pending },
              { x: 1, y: data.hospitalized }
            ]
          }
        ]
      });
    }

    // Render the charts for the default selected date
    const defaultSelectedDate = dateSelect.value;
    const defaultSelectedData = data.find(entry => entry.date.toString() === defaultSelectedDate);
    if (defaultSelectedData) {
      const defaultChartData = {
        positive: defaultSelectedData.positive,
        positiveIncrease: defaultSelectedData.positiveIncrease,
        negative: defaultSelectedData.negative,
        negativeIncrease: defaultSelectedData.negativeIncrease,
        deathIncrease: defaultSelectedData.deathIncrease,
        hospitalizedCumulative: defaultSelectedData.hospitalizedCumulative,
        inIcuCumulative: defaultSelectedData.inIcuCumulative,
        totalTestResults: defaultSelectedData.totalTestResults,
        totalTestResultsIncrease: defaultSelectedData.totalTestResultsIncrease,
        hospitalizedCurrently: defaultSelectedData.hospitalizedCurrently,
        death: defaultSelectedData.death,
        inIcuCurrently: defaultSelectedData.inIcuCurrently,
        onVentilatorCurrently: defaultSelectedData.onVentilatorCurrently,
        pending: defaultSelectedData.pending,
        hospitalized: defaultSelectedData.hospitalized
      };
      renderBarChart(defaultChartData);
      renderPieChart(defaultChartData);
      renderLineChart(defaultChartData);
      renderAreaChart(defaultChartData);
      renderScatterChart(defaultChartData);
    }
  })
  .catch(error => console.log(error));
