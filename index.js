google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    var data = google.visualization.arrayToDataTable(retrieveData());

    var options = {
        title: 'Mortgage Boss Loading Times',
        hAxis: {title: 'Date (EST)', minValue: 0, maxValue: 15},
        vAxis: {title: 'Time (seconds)', minValue: 0, maxValue: 15},
        selectionMode: 'multiple',
        series: {1: {color: 'orange'}, 2: {color: 'red'}, 3: {color: 'green'}},
    };

    var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));

    chart.draw(data, options);
}

function retrieveData(){
    return [
        ['Date', 'Login', 'Contacts', 'Open Contact', 'Deals', 'Open Deal'],
        ["17/07/2017 19:15", 5.03,5.01,1.97,0.28,1.02],
        ["17/07/2017 19:15", 5.87,5.15,1.38,0.27,1.16],
        ["17/07/2017 19:16", 5.72,5.02,1.86,0.39,1.00],
        ["17/07/2017 19:16", 5.36,4.96,0.97,0.28,0.87],
        ["17/07/2017 19:16", 5.98,5.76,1.09,0.27,1.02],
        ["18/07/2017 13:38", 5.62,7.39,2.56,0.55,3.12],
        ["17/07/2017 19:15", 5.03,5.01,1.97,0.28,1.02],
        ["17/07/2017 19:15", 5.87,5.15,1.38,0.27,1.16],
        ["17/07/2017 19:16", 5.72,5.02,1.86,0.39,1.00],
        ["17/07/2017 19:16", 5.36,4.96,0.97,0.28,0.87],
        ["17/07/2017 19:16", 5.98,5.76,1.09,0.27,1.02],
        ["18/07/2017 13:38", 5.62,7.39,2.56,0.55,3.12],
    ];
}