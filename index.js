google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

$.ajaxSetup({
    async: false
});

function drawChart() {
    var dataPoints = retrieveData();
    //console.log(dataPoints);
    //dataPoints = convertTimestampsToDates(dataPoints);
    //console.log(dataPoints);
    console.log(dataPoints);
    data = google.visualization.arrayToDataTable(dataPoints);

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.ChartWrapper({
        chartType: 'LineChart',
        containerId: 'chart_div',
        dataTable: data,
        options: {
            title: 'Mortgage Boss Loading Times', 
            pointSize: 7.5,
            pointShape: { type: 'star', sides: 5, dent: 0.8 },
            lineWidth: 1,
            curveType: 'function',
            dataOpacity: .5,
            hAxis: {
                title: 'Date',
                titleTextStyle: {
                    color: '#333'
                },
                format: 'dd/MMM - HH:mm'
            }, 
            vAxis: {
                title: 'Time (seconds)',
                minValue: 0
            },
            explorer: {
                actions: ['dragToZoom', 'rightClickToReset'],
                axis: 'horizontal',
                keepInBounds: true,
                maxZoomIn: 50.0,
                zoomDelta: 0.5
            }
        },
    });

    addLegendToggling(chart);
    chart.draw();
}

// Hide/Show code from: http://jsfiddle.net/asgallant/6gz2Q/
function addLegendToggling(chart){
    // create columns array
    var columns = [0];
    /* the series map is an array of data series
     * "column" is the index of the data column to use for the series
     * "display" is a boolean, set to true to make the series visible on the initial draw
    */
    var seriesMap = [{  // should correspond to each series of data
        column: 1,
        display: true
    }, {
        column: 2,
        display: true
    }, {
        column: 3,
        display: true
    }, {
        column: 4,
        display: true
    }, {
        column: 5,
        display: true
    }, {
        column: 6,
        display: true
    }];
    var columnsMap = {};
    var series = [];
    for (var i = 0; i < seriesMap.length; i++) {
        var col = seriesMap[i].column;
        columnsMap[col] = i;
        // set the default series option
        series[i] = {};
        if (seriesMap[i].display) {
            // if the column is the domain column or in the default list, display the series
            columns.push(col);
        }
        else {
            // otherwise, hide it
            columns.push({
                label: data.getColumnLabel(col),
                type: data.getColumnType(col),
                sourceColumn: col,
                calc: function () {
                    return null;
                }
            });
            // backup the default color (if set)
            if (typeof(series[i].color) !== 'undefined') {
                series[i].backupColor = series[i].color;
            }
            series[i].color = '#CCCCCC';
        }
    }

    chart.setOption('series', series);

    function showHideSeries () {
        var sel = chart.getChart().getSelection();
        // if selection length is 0, we deselected an element
        if (sel.length > 0) {
            // if row is undefined, we clicked on the legend
            if (sel[0].row == null) {
                var col = sel[0].column;
                if (typeof(columns[col]) == 'number') {
                    var src = columns[col];

                    // hide the data series
                    columns[col] = {
                        label: data.getColumnLabel(src),
                        type: data.getColumnType(src),
                        sourceColumn: src,
                        calc: function () {
                            return null;
                        }
                    };

                    // grey out the legend entry
                    series[columnsMap[src]].color = '#CCCCCC';
                }
                else {
                    var src = columns[col].sourceColumn;

                    // show the data series
                    columns[col] = src;
                    series[columnsMap[src]].color = null;
                }
                var view = chart.getView() || {};
                view.columns = columns;
                chart.setView(view);
                chart.draw();
            }
        }
    }

    google.visualization.events.addListener(chart, 'select', showHideSeries);

    // create a view with the default columns
    var view = {
        columns: columns
    };
}

function retrieveData(){
    dates = $.ajax({
          url: "data.json",
          dataType: "json",
          async: false
        }).responseJSON["dates"];
    fillRowsWithNullsIfNeeded(dates);
    return convertTimestampsToDates(dates);
}

// some rows may have all the series data while others may not. Those that do not need to be padded with nulls to be displayed in the graph
function fillRowsWithNullsIfNeeded(data){
    const numSeries = data[0].length;                   // get amount of series there are
    data.slice(1,data.length).forEach(function(entry){  // pad every row (after titles) with nulls if they are not the same size as numSeries
        while(entry.length < numSeries){
            entry.push(null);
        }
    });
}

// converts the X value (Date) in each data point from timestamp to Date object
function convertTimestampsToDates(dates){
    return dates.map(function(entry){
       entry[0] = new Date(entry[0] * 1000);
       //entry [0] = formatDate(entry[0]);
       //entry[0] = DateFormat.format.date(entry[0], "dd/MMM - HH:mm");
       return entry;
    });
}