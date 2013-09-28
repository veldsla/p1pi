function requestData() {
    $.ajax({
        url: '/livedatapoint',
        success: function(point) {
            var series = chart.series[0],
                shift = series.data.length > 1000; // shift if the series is longer than 20

            // add the point
            chart.series[0].addPoint(point, true, shift);
            
            // call it again after one second
            setTimeout(requestData, 10000);    
        },
        cache: false
    });
}

var chart; // globally available
$(document).ready(function() {
    //get the initial data
    $.getJSON('/livehistory', function(initialdata) {
    chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            defaultSeriesType: 'line',
	    zoomType: 'xy',
            events: {
                load: requestData
            }
        },
        title: {
            text: 'Live Verbruik'
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150,
            minRange: 1000000
        },
        yAxis: {
            minPadding: .05,
            maxPadding: .05,
            title: {
                text: 'Watt',
                margin: 80
            },
            minRange: 100
        },
        series: [{
            name: 'verbruik',
            data: initialdata
        }],
       tooltip: {
          valueSuffix: 'W'
         },
       plotOptions: {
            series: {
                marker: {
                    lineWidth: 1,
                    radius: 2,
                    lineColor: null // inherit from series
                }
            },
            line: {
		states: { hover: { enabled: false} }
            }
        }
    }); });       
});
