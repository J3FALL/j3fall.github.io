// stolen from this guide: https://www.vis4.net/blog/2015/04/making-html-tables-in-d3-doesnt-need-to-be-a-pain/
columns = [
    {head: 'name', cl: 'center', html: f('name')},
    {head: 'continent', cl: 'center', html: f('continent')},
    {head: 'gdp', cl: 'right', html: f('gdp', d3.format(',.2s'))},
    {head: 'life_expectancy', cl: 'right', html: f('life_expectancy', d3.format('.1f'))},
    {head: 'population', cl: 'right', html: f('population', d3.format(',.0f'))},
    {head: 'year', cl: 'right', html: f('year', d3.format('.0f'))}
];

// data formatting from d3-jetpack (https://github.com/gka/d3-jetpack/blob/master/src/f.js)
function f() {
    var entries = arguments;
    var i = 0;
    var len = entries.length;
    while (i < len) {
        if (typeof (entries[i]) === 'string' || typeof (entries[i]) === 'number') {
            entries[i] = (function (str) {
                return function (d) {
                    return d[str];
                };
            })(entries[i]);
        }
        i++;
    }
    return function (d) {
        var i = 0;
        len = entries.length;
        while (i++ < len) {
            d = entries[i - 1].call(this, d);
        }
        return d;
    };
}

function table(data) {

    let sortAscending = true;

    var table = d3.select("body").append("table")
        .attr("class", "table");
    var thead = table.append("thead")
        .attr("class", "thead");
    var tbody = table.append("tbody");
    table.append("caption")
        .html("World Countries Ranking");

    headers = thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
        .text(function (d) {
            return d.head;
        });

    headers.on("click", function (header) {
        headers.attr('class', 'header');
        if (sortAscending) {
            tbody.selectAll("tr.row").sort(function (a, b) {
                sortAscending = false;

                diff = d3.ascending(a[header.head], b[header.head]);

                if (diff === 0) {
                    diff = diffByName(a, b, 'asc');
                }
                return diff;
            });
            this.className = 'aes';
        } else {
            tbody.selectAll("tr.row").sort(function (a, b) {
                sortAscending = true;

                diff = d3.descending(a[header.head], b[header.head]);

                if (diff === 0) {
                    diff = diffByName(a, b, 'desc');
                }
                return diff;
            });

            this.className = 'des';
        }
    });

    function diffByName(a, b, order = 'desc') {
        if (order === 'desc') {
            return d3.descending(a['name'], b['name'])
        } else {
            return d3.ascending(a['name'], b['name'])
        }
    }

    var rows = tbody.selectAll("tr.row")
        .data(data)
        .enter()
        .append("tr")
        .attr("class", "row");

    var cells = tbody.selectAll('tr.row')
        .selectAll('td')
        .data(fillCells)
        .enter()
        .append('td')
        .html(f('html'))
        .attr('class', f('cl'));
}


const fillCells = function (row, i) {
    return columns.map(function (c) {
        var cell = {};
        d3.keys(c).forEach(function (k) {
            cell[k] = typeof c[k] == 'function' ? c[k](row, i) : c[k];
        });
        return cell;
    });
};

d3.json("data/countries_2012.json", function (error, data) {
    table(data);
});
