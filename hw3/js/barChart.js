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
        this.currentDim = 'attendance';
    }

    /**
     * Render and update the bar chart based on the selection of the data type in the drop-down box
     */
    updateBarChart(selectedDimension) {


        // ******* TODO: PART I *******
        this.currentDim = selectedDimension;
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


        window.color = colorRange(max);

        d3.select('.selected')
            .classed('selected', false)
            .classed('bar', true)
            .style('fill', function (d) {
                return color(d[selectedDimension])
            });

        renderBarsWithAnimation(this);

        function renderBarsWithAnimation(barChart) {
            svg.select('#bars').selectAll('rect.bar')
                .data(barChart.allData)
                .enter().append('rect')
                .attr('class', 'bar')
                .attr('width', yWidth)
                .attr('height', d => h - margin.top - margin.bottom - yScale(d[selectedDimension]))
                .attr('x', d => margin.left + xScale(d.year))
                .attr('y', d => yScale(d[selectedDimension]))
                .style('fill', d => color(d[selectedDimension]))
                .on("click", barChart.highlightSelected);

            //do it another time just to animate
            svg.select('#bars').selectAll('rect.bar')
                .transition().duration(300)
                .attr('class', 'bar')
                .attr('width', yWidth)
                .attr('height', d => h - margin.top - margin.bottom - yScale(d[selectedDimension]))
                .attr('x', d => margin.left + xScale(d.year))
                .attr('y', d => yScale(d[selectedDimension]))
                .style('fill', d => color(d[selectedDimension]));
        }


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
    chooseData(data, selectedDimension) {
        // ******* TODO: PART I *******
        //Changed the selected data when a user selects a different
        // menu item from the drop down.
        console.log(this);
        barChart.infoPanel.updateInfo(data);
        barChart.worldMap.updateMap(data);

        console.log(data[selectedDimension]);
        // d3.select('.selected')
        //     .classed('selected', false)
        //     .style('fill', function (d) {
        //         return color(d[selectedDimension])
        //     });

        d3.select(this)
            .classed('bar', false)
            .classed('selected', true)
            .style('fill', '#d20a11');

    }

    highlightSelected(rect) {

        fillByDefaultColor();
        fillSelected(this);
        barChart.infoPanel.updateInfo(rect);
        barChart.worldMap.updateMap(rect);


        function fillByDefaultColor() {
            d3.select('.selected')
                .classed('selected', false)
                .classed('bar', true)
                .style('fill', function (d) {
                    return color(d[barChart.currentDim])
                });

        }

        function fillSelected(barChart) {
            d3.select(barChart)
                .classed('selected', true)
                .style('fill', '#d20a11');
        }


    }
}

function colorRange(maxValue) {
    return d3.scaleLinear()
        .domain([0, maxValue])
        .range([d3.rgb("#95B4E2"), d3.rgb('#092D62')]);
}