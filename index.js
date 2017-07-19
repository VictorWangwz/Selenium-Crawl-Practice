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
    return [
        [
            "Date",
            "Login",
            "Contacts",
            "Open Contact",
            "Deals",
            "Open Deal"
        ],
        [
            1500416698.79,
            5.89,
            5.14,
            0.88,
            0.27,
            0.95
        ],
        [
            1500416728.41,
            5.34,
            5.16,
            1.86,
            0.39,
            3.12
        ],
        [
            1500416749.31,
            5.59,
            5.22,
            1.27,
            0.28,
            1.17
        ],
        [
            1500416771.11,
            6.26,
            5.06,
            1.94,
            0.28,
            1.36
        ],
        [
            1500416790.74,
            5.04,
            5.29,
            1.49,
            0.28,
            1.16
        ],
        [
            1500416811.41,
            6.04,
            5.07,
            0.8,
            0.27,
            1.05
        ],
        [
            1500417515.78,
            5.37,
            4.98,
            2.48,
            0.45,
            3.13
        ],
        [
            1500481271.9,
            5.9,
            12.98,
            3.92,
            0.49,
            1.89
        ],
        [
            1500484081.21,
            4.86,
            6.78,
            1.17,
            0.55,
            2.05
        ]
    ];
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