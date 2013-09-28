var gaschart; // globally available
$(document).ready(function() {
    //get the initial data
    $.getJSON('/gashistory', function(initialdata) {
	//process data to array

	var gasseries = new Array();
	$.each(initialdata, function(i, x){gasseries.push([ x.jstime, (x.stand - initialdata[i>1 ? i-1 : 0].stand)/1000 ])});

    gaschart = new Highcharts.Chart({
        chart: {
            renderTo: 'gascontainer',
            defaultSeriesType: 'spline',
	    	zoomType: 'xy',
        },
        title: {
            text: 'Gas verbruik afgelopen week'
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150,
            minRange: 1000000
        },
        yAxis: {
			min: 0,
            minPadding: .05,
            maxPadding: .05,
            title: {
                text: 'M3',
                margin: 80
            },
            minRange: 1
        },
        series: [{
            name: 'gasverbruik',
            data: gasseries
        }],
       tooltip: {
          valueSuffix: 'm3'
         },
       plotOptions: {
	   	column: {
				pointPadding: 0.2,
				borderWidth: 0

        }
		}
    }); });       
});
