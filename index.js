google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

var chart;
var options;
var dataPoints;

function drawChart() {
    data = retrieveData();
    data = convertTimestampsToDates(data);
    dataPoints = google.visualization.arrayToDataTable(data);

    options = {
        title: 'Mortgage Boss Loading Times',
        hAxis: {title: 'Date (EST)'},
        vAxis: {title: 'Time (seconds)'},
        selectionMode: 'multiple',
        series: {0: {color: 'blue', pointsVisible: true}, 1: {color: 'orange', pointsVisible: true}, 2: {color: 'red', pointsVisible: true}, 3: {color: 'green', pointsVisible: true}, 4: {color: 'purple', pointsVisible: true}}
    };

    chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));
    chart.draw(dataPoints, options);

    google.visualization.events.addListener(chart, 'select', selectHandler);
}

function convertTimestampsToDates(data){
    return data.map(function(entry){
       entry[0] = new Date(entry[0] * 1000);
       return entry;
    });
}

// this function should retrieve data.json and return (or callback) in the format that the current return is in
function retrieveData(callback){
     return $.ajax({
          url: "data.json",
          dataType: "json",
          async: false
          }).responseText;
}

function selectHandler(e){
    var selection = chart.getSelection();
    var selectedSeries = getSelectedSeries(selection);
    for (var i = 0; i < Object.keys(options["series"]).length; i++){
        options.series[i].pointsVisible = selectedSeries[i] == true ? true : false;
    }
    chart.draw(dataPoints, options);
}

function getSelectedSeries(selection){
    console.log(selection);
    var selectedSeries = {};
    selection.forEach(function (val) {
        selectedSeries[val["column"] - 1] = true;
    });
    return selectedSeries;
}