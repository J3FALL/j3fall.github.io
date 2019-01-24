/** Class implementing the bar chart view. */
class BarChart {

    /**
     * Create a bar chart instance and pass the other views in.
     * @param worldMap
     * @param infoPanel
     * @param allData
     */
    constructor(worldMap, infoPanel, allData) {
        this.worldMap = worldMap;
        this.infoPanel = infoPanel;
        this.allData = allData;
    }

    /**
     * Render and update the bar chart based on the selection of the data type in the drop-down box
     */
    updateBarChart(selectedDimension) {


        // ******* TODO: PART I *******

        this.allData.sort(function (x, y) {
            return d3.ascending(x.year, y.year);
        });

        var yearsRange = this.allData.map(function (d) {
            return d.year;
        });

        var w = d3.select("#barChart").attr("width");
        var h = d3.select("#barChart").attr("height");
        var margin = {top: 50, right: 10, bottom: 50, left: 60};
        var svg = d3.select('#barChart')
            .attr('width', w)
            .attr('height', h)
            .attr('transform', 'translate(' + margin.right + ',' + margin.top + ')');

        var max = d3.max(this.allData, function (d) {
            return d[selectedDimension];
        });

        var xScale = d3.scaleBand()
            .domain(yearsRange)
            .range([0, (w - margin.left - margin.right)])
            .paddingInner(0.2);

        var yScale = d3.scaleLinear()
            .domain([0, max])
            .range([(h - margin.top - margin.bottom), 0]);


        var yWidth = xScale.bandwidth();
        var xAxis = d3.axisBottom(xScale);
        var yAxis = d3.axisLeft(yScale);


        svg.select('#xAxis')
            .attr('transform', 'translate(' + margin.left + ',' + (h - margin.top - margin.bottom) + ')')
            .call(xAxis)
            .selectAll('text')
            .style("text-anchor", "end")
            .attr("dx", "-12px")
            .attr("dy", "-5px")
            .attr("transform", "rotate(-90)");

        svg.select('#yAxis')
            .attr('transform', 'translate(' + margin.left + ',' + 0 + ')')
            .call(yAxis);


        d3.select('.selected')
        // classed for css add/removal
            .classed('selected', false)
            .classed('bar', true)
            .style('fill', function (d) {
                return colorRange(d[selectedDimension])
            });

        var bars = svg.select('#bars').selectAll('rect.bar')
            .data(this.allData)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('width', yWidth)
            .attr('height', function (d) {
                return h - margin.top - margin.bottom - yScale(d[selectedDimension]);
            })
            .attr('x', function (d) {
                return (margin.left + xScale(d.year));
            })
            .attr('y', function (d) {
                return xScale(d[selectedDimension]);
            })
            .style('fill', function (d) {
                return colorRange(d[selectedDimension])
            })
            .on("click", barChart.chooseData)

        // Create the x and y scales; make
        // sure to leave room for the axes

        // Create colorScale

        // Create the axes (hint: use #xAxis and #yAxis)

        // Create the bars (hint: use #bars)


        // ******* TODO: PART II *******

        // Implement how the bars respond to click events
        // Color the selected bar to indicate is has been selected.
        // Make sure only the selected bar has this new color.

        // Call the necessary update functions for when a user clicks on a bar.
        // Note: think about what you want to update when a different bar is selected.

    }


    /**
     *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
     *
     *  There are 4 attributes that can be selected:
     *  goals, matches, attendance and teams.
     */
    chooseData() {
        // ******* TODO: PART I *******
        //Changed the selected data when a user selects a different
        // menu item from the drop down.

    }
}

function colorRange(maxValue) {
    return d3.scaleLinear()
        .domain([0, maxValue])
        .range([d3.rgb("#95B4E2"), d3.rgb('#092D62')]);
}