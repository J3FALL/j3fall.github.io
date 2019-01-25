/** Class implementing the map view. */
class Map {
    /**
     * Creates a Map Object
     */
    constructor() {
        this.projection = d3.geoConicConformal().scale(150).translate([400, 350]);
    }

    /**
     * Function that clears the map
     */
    clearMap() {

        // ******* TODO: PART V*******
        var color = d3.select('#map').selectAll('.countries');
        color.attr('class', 'countries');
        color.classed('host', false);
        color.classed('team', false);
        color.classed('countries', true);
        d3.selectAll('#finalist').remove();

    }

    /**
     * Update Map with info for a specific FIFA World Cup
     * @param wordcupData the data for one specific world cup
     */
    updateMap(worldcupData) {

        //Clear any previous selections;
        this.clearMap();

        // ******* TODO: PART V *******

        colorParticipants();
        colorHost();


        function colorHost() {
            var hostId = '#' + worldcupData.host_country_code;
            d3.select('#map').select(hostId)
                .attr('class', 'countries host');
        }


        function colorParticipants() {
            var teams = worldcupData.TEAM_LIST.split(',');
            teams.forEach(function (team) {
                d3.select(('#' + team))
                    .classed('team', true);
            });

        }

        // mark finalists
        d3.select('#map').selectAll('circle')
            .data([worldcupData.WIN_LON, worldcupData.WIN_LAT]).enter().append("circle")
            .attr("r", '5px')
            .attr('class', 'gold')
            .attr('id', 'finalist')
            .attr("transform", () => "translate(" +
                this.projection([worldcupData.WIN_LON, worldcupData.WIN_LAT]) + ")");

        d3.select('#map').append("circle")
            .attr("r", '5px')
            .attr('class', 'silver')
            .attr('id', 'finalist')
            .attr("transform", () => "translate(" +
                this.projection([worldcupData.RUP_LON, worldcupData.RUP_LAT]) + ")");


        // Add a marker for the winner and runner up to the map.

        // Hint: remember we have a conveniently labeled class called .winner
        // as well as a .silver. These have styling attributes for the two
        // markers.


        // Select the host country and change it's color accordingly.

        // Iterate through all participating teams and change their color as well.

        // We strongly suggest using CSS classes to style the selected countries.


        // Add a marker for gold/silver medalists
    }

    /**
     * Renders the actual map
     * @param the json data with the shape of all countries
     */
    drawMap(world) {

        //(note that projection is a class member
        // updateMap() will need it to add the winner/runner_up markers.)

        // ******* TODO: PART IV *******

        console.log(world);
        var geoGenerator = d3.geoPath()
            .projection(this.projection);
        var map = d3.select('#map')
            .attr('width', 1000)
            .attr('height', 500);

        map.selectAll('path')
            .data(topojson.feature(world, world.objects.countries).features)
            .enter()
            .append('path')
            .attr('class', 'countries')
            .attr('id', function (d) {
                return d.id;
            })
            .attr('d', geoGenerator);

        map.append('path')
            .datum(d3.geoGraticule().stepMinor([10, 10]))
            .attr('id', 'grid')
            .attr('class', 'map-grid')
            .attr('d', geoGenerator);

    }


}
