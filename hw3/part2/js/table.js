/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(teamData, treeObject) {

        //Maintain reference to the tree Object; 
        this.tree = treeObject;

        // Create list of all elements that will populate the table
        // Initially, the tableElements will be identical to the teamData
        this.tableElements = teamData.slice(); //

        ///** Store all match data for the 2014 Fifa cup */
        this.teamData = teamData;

        //Default values for the Table Headers
        this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];

        /** To be used when sizing the svgs in the table cells.*/
        this.cell = {
            "width": 70,
            "height": 20,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };

        /** Set variables for commonly accessed data columns*/
        this.goalsMadeHeader = 'Goals Made';
        this.goalsConcededHeader = 'Goals Conceded';

        /** Setup the scales*/
        this.goalScale = null;

        /** Used for games/wins/losses*/
        this.gameScale = null;

        /**Color scales*/
        /**For aggregate columns  Use colors '#ece2f0', '#016450' for the range.*/
        this.aggregateColorScale = null;

        /**For goal Column. Use colors '#cb181d', '#034e7b'  for the range.*/
        this.goalColorScale = null;
    }


    /**
     * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
     * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
     *
     */
    createTable() {
        // ******* TODO: PART II *******
        console.log(this.teamData);
        var goalsMade = this.teamData.map(function (entry) {
            return entry['value']['Goals Made']
        });

        var gamesPlayed = this.teamData.map(function (entry) {
            return entry['value']['TotalGames']
        });

        this.updateScaleDomains(goalsMade, gamesPlayed);

        this.AxisScale = d3.scaleLinear()
            .domain([0, goalsMade])
            .range([0, this.cell.width + 30]);
        var xAxis = d3.axisBottom(this.AxisScale);

        d3.select('#goalHeader').append('svg')
            .attr('width', this.cell.width + 40)
            .attr('height', this.cell.height)
            .append('g')
            .style('font', '8px sans-serif')
            .attr('transform', 'translate(' + 5 + ',' + 5 + ')')
            .call(xAxis);

        // Create the x axes for the goalScale.

        //add GoalAxis to header of col 1.

        // ******* TODO: PART V *******

        // Set sorting callback for clicking on headers

        // Clicking on headers should also trigger collapseList() and updateTable(). 


    }

    updateScaleDomains(goalsMade, gamesPlayed) {
        this.goalScale = d3.scaleLinear()
            .domain([0, Math.max.apply(Math, goalsMade)])
            .range([10, this.cell.width + 30]);

        this.gameScale = d3.scaleLinear()
            .domain([0, Math.max.apply(Math, gamesPlayed)])
            .range([0, this.cell.width]);

        this.goalColorScale = d3.scaleLinear()
            .domain([0, Math.max.apply(Math, gamesPlayed)])
            .range([d3.rgb("#ece2f0"), d3.rgb('#016450')]);


    }

    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     */
    updateTable() {
        // ******* TODO: PART III *******

        var body = d3.select('tbody');

        blankTable(body, this.tableElements);
        fillTableRows();

        function blankTable(body, tableElements) {
            body.selectAll('tr')
                .data(tableElements, function (d) {
                    return d;
                })
                .attr('class', 'row');

            body.selectAll('tr')
                .data(tableElements, function (d) {
                    return d;
                })
                .enter()
                .append('tr')
                .attr('class', 'row');

        }

        function fillTableRows() {
            var td = body.selectAll('tr').selectAll('td');
            td.data(function (row) {
                console.log(row);
                var name = {'open': false, 'type': row.value.type, 'vis': '1', 'value': row.key};
                var goals = {
                    'type': row.value.type,
                    'vis': '4',
                    'value': {'made': row.value['Goals Made'], 'conc': row.value['Goals Conceded']}
                };
                var res = {'type': row.value.type, 'vis': '2', 'value': row.value.Result.label};
                var win = {'type': row.value.type, 'vis': '3', 'value': row.value.Wins};
                var lose = {'type': row.value.type, 'vis': '3', 'value': row.value.Losses};
                var total = {'type': row.value.type, 'vis': '3', 'value': row.value.TotalGames};
                return [name, goals, res, win, lose, total];
            })
                .enter()
                .append('td');
        }

        var goalScale = this.goalScale;
        var gameScale = this.gameScale;
        var colorScale = this.goalColorScale;
        //Set the color of all games that tied to light gray
        var vis = ['1', '2', '3', '4'];
        for (var i in vis) {
            var type = body.selectAll('tr')
                .selectAll('td')
                .filter(function (d) {
                    return d.vis == vis[i];
                });
            switch (vis[i]) {
                case '1': {
                    type.text(d => d.value)
                        .style('color', 'black');
                    break;
                }
                case '2': {
                    type.text(d => {
                        return d.value
                    });
                    break;
                }
                case '3': {
                    type.select('svg').remove();
                    var bar = type.append('svg')
                        .attr('width', this.cell.width)
                        .attr('height', this.cell.height);
                    bar.append('rect')
                        .attr('height', this.cell.height)
                        .attr('width', d => goalScale(d.value))
                        .attr('fill', function (d) {
                            return colorScale(d.value);
                        });
                    bar.append('g')
                        .append('text')
                        .text(d => d.value)
                        .attr('text-anchor', 'end')
                        .attr('fill', 'white')
                        .attr('dy', '14px')
                        .attr('dx', '10px');
                    break;
                }
                case '4': {
                    type.select('svg').remove();
                    var goal = type.append('svg')
                        .attr('width', this.cell.width + 100)
                        .attr('height', this.cell.height);
                    goal.append('rect')
                        .attr('x', d => goalScale(Math.min(d.value.made, d.value.conc)))
                        .attr('y', () => 5)
                        .attr('width', d => Math.abs(goalScale(d.value.made) - goalScale(d.value.conc)))
                        .attr('height', () => 10)
                        .attr('fill', function (d) {
                            return (d.value.made > d.value.conc) ? '#363377' : '#AA3939';
                        });
                    break;
                }
            }
        }
    }
    ;

    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     *
     */
    updateList(i) {
        // ******* TODO: PART IV *******

        //Only update list for aggregate clicks, not game clicks

    }

    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
    collapseList() {

        // ******* TODO: PART IV *******

    }


}
