google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

var chart;

function drawChart() {
    data = retrieveData();
    var dataPoints = google.visualization.arrayToDataTable(data);
    var minH = getMinH(data) - 30;
    var maxH = getMaxH(data) + 30;
    var minV = 0;
    var maxV = getMaxV(data) + 3;

    var options = {
        title: 'Mortgage Boss Loading Times',
        hAxis: {title: 'Date (EST)', minValue: minH, maxValue: maxH},
        vAxis: {title: 'Time (seconds)', minValue: minV, maxValue: maxV},
        selectionMode: 'multiple',
        series: {1: {color: 'orange', pointsVisible: true}, 2: {color: 'red'}, 3: {color: 'green'}},
    };

    chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));
    chart.draw(dataPoints, options);

    google.visualization.events.addListener(chart, 'select', selectHandler);
}

// gets minimum X axis value
function getMinH(data){
    const firstDataEntry = data[1];   // get first data entry
    return firstDataEntry[0];   // get time column
}

// gets max X axis value
function getMaxH(data){
    const lastDataEntry = data[data.length - 1];
    return lastDataEntry[0];
}

// get max Y axis value
function getMaxV(data){
    var max = 0;
    data.forEach(function(entry){   // iterate through all data entries and find the largest loading time
        entry.slice(1, entry.length).forEach(function(val){ // skip first column (this is the timestamp)
            if (!isNaN(val)){
                if (val > max) {
                    max = val;
                }
            }
        });
    });
    return max;
}

// this function should retrieve data.json and return (or callback) in the format that the current return is in
function retrieveData(callback){
    $.ajax({
        url: "data.csv"
    })

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
        ]
    ];
}

function selectHandler(e){
    var selection = chart.getSelection()
    console.log(selection[1])
}