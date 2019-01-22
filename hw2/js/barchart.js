function filteredByContinents(data = data_loaded) {
    choices = [];
    d3.selectAll("input[type=checkbox]").each(function (d) {
        cb = d3.select(this);
        if (cb.property("checked")) {
            choices.push(cb.property("value"));
        }
    });

    if (choices.length > 0) {
        filteredData = data.filter(function (d, i) {
            return choices.includes(d.continent);
        });
    } else {
        filteredData = data;
    }
    return filteredData;
}


function groupedByContinents(data = data_loaded) {

    var agg = d3.select('input[name="aggregate"]:checked').node().value;

    if (agg === 'default') {
        return data;
    } else {
        rowsByContinents = d3.nest()
            .key(function (d) {
                return d.continent
            })
            .rollup(function (d) {
                return {
                    'name': d[0].continent,
                    'continent': d[0].continent,
                    'gdp': d3.sum(d, function (g) {
                        return +g.gdp;
                    }),
                    'life_expectancy': d3.mean(d, function (g) {
                        return g.life_expectancy;
                    }),
                    'population': d3.sum(d, function (g) {
                        return g.population;
                    }),
                    'year': d[0].year
                };

            })
            .entries(data);

        return asArray(rowsByContinents);
    }

}

function asArray(groups) {
    values = [];

    for (let i = 0; i < groups.length; i++) {
        values.push(groups[i].value);
    }

    return values;
}

function dataByYear(data) {
    var yearSelected = d3.select('input[type=range]').node().valueAsNumber;

    yearIndex = yearSelected - 1995;

    return data.map(function (row) {
        return {
            'name': row.name,
            'continent': row.continent,
            'gdp': row.years[yearIndex]["gdp"],
            'life_expectancy': row.years[yearIndex]['life_expectancy'],
            'population': row.years[yearIndex]['population'],
            'year': yearSelected
        }
    })
}

function barchartParams(data) {

    params = {
        'margin': {top: 50, bottom: 5, left: 50, right: 10},
        'textW': 10,
        'barH': 20
    };

    params['width'] = 900 - params['margin'].left - params['margin'].right;
    params['height'] = params['barH'] * data.length - params['margin'].top - params['margin'].bottom;

    params['encoder'] = d3.select('input[name=encoder]:checked').node().value;

    params['min'] = 0;
    params['max'] = d3.max(data, function (d) {
        console.log(d);
        return d[params['encoder']];
    });

    params['xScale'] = d3.scaleLinear().domain([0, params['max']])
        .range([params['textW'], params['width']]);
    params['yScale'] = d3.scaleBand().range([0, params['barH'] * data.length]);

    params['yAxis'] = d3.axisLeft().scale(params['yScale']);

    return params;

}

function selectedInputParams() {
    params = {
        'aggregateBy': d3.select('input[name="aggregate"]:checked').node().value,
        'sortBy': d3.select('input[name=sort]:checked').node().value
    };
    return params;

    // if (aggVar === "continent" && sortVar === "Name") {
    //     sortVar = "Continent"
    // }
}

function barchart(data) {
    barParams = barchartParams(data);
    inputParams = selectedInputParams();

    var svg = d3.select("body").append("svg")
        .attr('width', barParams['width'] + barParams['margin'].left + barParams['margin'].right)
        .attr('height', barParams['yScale'].range()[1] + 25 + 'px');

    svg.append("g")
        .call(barParams['yAxis']);

    var bar = svg.selectAll('g')
        .data(data)
        .enter()
        .append('g')
        .attr('transform', function (d, i) {
            return "translate(0," + i * barParams['barH'] + ")";
        });

    console.log(barParams);
    bar.append('rect').transition().duration(300)
        .attr('width', function (d) {
            return barParams['xScale'](d[barParams['encoder']]);
        })
        .attr('height', barParams['barH'] - 2)
        .attr('x', 300);


    bar.append('text')
        .text(function (d) {
            return d[inputParams['sortBy']]
        })
        .attr('y', function (d, i) {
            return i + 9;
        })
        .attr('class', 'lable');

    bar.selectAll("text")
        .attr("dx", "30px");

    var t = d3.selectAll('rect');
    t.attr("fill", function (d, i) {
        return colors(i);
    });
    d3.selectAll("path.domain").remove();

}

function colors(n) {
    var colores_g = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e",
        "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc",
        "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"
    ];
    return colores_g[n % colores_g.length];
}

d3.json("data/countries_1995_2012.json", function (error, data) {
    data_loaded = data;

    barchart(filteredByContinents(groupedByContinents(dataByYear(data_loaded))));
    //table(dataByYear(data));
});