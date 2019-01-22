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
        filteredData = data_loaded;
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

function barchart(data) {

}

d3.json("data/countries_1995_2012.json", function (error, data) {
    data_loaded = data;
    filteredByContinents(groupedByContinents(dataByYear(data_loaded)));
    //table(dataByYear(data));
});