var WIDTH = 1000;
var HEIGHT = 5000;
var barPadding = 5;
var xLabelPadding = 15;
var xAxisPadding = 75;

function load() {
// Displays every data feature as a string
    d3.csv("result.csv", function(d) {
        return {
            name: d.dataName,
            attackStat: +d["data__|__stats__hp"]
        };
    }).then(function(data) {
        main(data);
    });
}

function make_x_gridlines(x) {
    return d3.axisBottom(x)
        .ticks(10)
}

function main(data) {

    let svg = d3.select("svg")
        .attr("width", WIDTH)
        .attr("height", HEIGHT)

    svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", function(d) {
            return 200;
        })
        .attr("y", function(d, i) {
            return i * ((HEIGHT - 100) / data.length) + 17;
        })
        .text(function(d) {
            return d.name;
        })
        .attr("text-anchor", "end")
        .attr("fill", "black")
//xaxis title
    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "middle")
        .attr("x", WIDTH/2)
        .attr("y", HEIGHT - 30)
        .text("Health stats");
//this is th scale
    var xScale = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) {
            return d.attackStat;
        })])
        .range([10, d3.max(data, function(d) {
            return d.attackStat+50;
        })]);

    var xAxis = d3.axisBottom(xScale);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(190," + (HEIGHT - xAxisPadding)
            + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(190," + (HEIGHT - xAxisPadding)
            + ")")
        .call(make_x_gridlines(xScale)
            .tickSize(-HEIGHT)
            .tickFormat("")
        )

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function (d) {
            return 200;
        })
        .attr("y", function(d, i) {
            return i * ((HEIGHT - 100) / data.length);

        })
        .attr("width", function(d) {
            return d.attackStat;
        })
        .attr("height", (HEIGHT - 100) / data.length - barPadding)
        .attr("fill", function(d) {
            return "rgb(102, 153, 102)";
        });
}


load();