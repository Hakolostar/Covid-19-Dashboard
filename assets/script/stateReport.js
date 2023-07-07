// Fetch state options from the COVID Tracking API
    fetch('https://api.covidtracking.com/v1/states/info.json')
      .then(response => response.json())
      .then(data => {
        const stateSelect = document.getElementById('stateSelect');
        data.forEach(item => {
          const option = document.createElement('option');
          option.value = item.state;
          option.textContent = item.name;
          stateSelect.appendChild(option);
        });

        // Set the first state as the default selection
        stateSelect.value = data[0].state;
        fetchData();
      })
      .catch(error => {
        console.error('Error:', error);
      });

    function fetchData() {
      const stateSelect = document.getElementById('stateSelect');
      const state = stateSelect.value;

      if (!state) {
        console.log('State not selected. Exiting...');
        return;
      }

      const url = `https://api.covidtracking.com/v1/states/daily.json`;

      fetch(url)
        .then(response => response.json())
        .then(data => {
          const filteredData = data.filter(item => item.state === state);

          if (filteredData.length === 0) {
            console.log('No data available for the selected state.');
            return;
          }

          const latestData = filteredData[0];

          const dataTable = document.getElementById('data-table').getElementsByTagName('tbody')[0];
          dataTable.innerHTML = '';

          const row = dataTable.insertRow(0);

          const dateCell = row.insertCell(0);
          dateCell.textContent = formatDate(latestData.date);

          const stateCell = row.insertCell(1);
          stateCell.textContent = latestData.state;

          const positiveCasesCell = row.insertCell(2);
          positiveCasesCell.textContent = latestData.positive !== null ? formatNumber(latestData.positive) : 'N/A';

          const negativeCasesCell = row.insertCell(3);
          negativeCasesCell.textContent = latestData.negative !== null ? formatNumber(latestData.negative) : 'N/A';

          const totalTestsCell = row.insertCell(4);
          totalTestsCell.textContent = latestData.totalTestResults !== null ? formatNumber(latestData.totalTestResults) : 'N/A';

          const hospitalizedCell = row.insertCell(5);
          hospitalizedCell.textContent = latestData.hospitalizedCurrently !== null ? formatNumber(latestData.hospitalizedCurrently) : 'N/A';

          const icuCell = row.insertCell(6);
          icuCell.textContent = latestData.inIcuCurrently !== null ? formatNumber(latestData.inIcuCurrently) : 'N/A';

          const ventilatorCell = row.insertCell(7);
          ventilatorCell.textContent = latestData.onVentilatorCurrently !== null ? formatNumber(latestData.onVentilatorCurrently) : 'N/A';

          const recoveredCell = row.insertCell(8);
          recoveredCell.textContent = latestData.recovered !== null ? formatNumber(latestData.recovered) : 'N/A';

          const deathsCell = row.insertCell(9);
          deathsCell.textContent = latestData.death !== null ? formatNumber(latestData.death) : 'N/A';

          // Update the statistic cards
          document.getElementById('positiveCases').textContent = latestData.positive !== null ? formatNumber(latestData.positive) : 'N/A';
          document.getElementById('negativeCases').textContent = latestData.negative !== null ? formatNumber(latestData.negative) : 'N/A';
          document.getElementById('hospitalizedCases').textContent = latestData.hospitalizedCurrently !== null ? formatNumber(latestData.hospitalizedCurrently) : 'N/A';
          document.getElementById('deathCases').textContent = latestData.death !== null ? formatNumber(latestData.death) : 'N/A';
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }

    function formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, options);
    }

    function formatNumber(value) {
      if (isNaN(value) || value === null) {
        return 'N/A';
      }
      return Number(value).toLocaleString();
    }