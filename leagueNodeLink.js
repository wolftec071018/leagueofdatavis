let dataset = [];

const margin = { top: 10, bottom: 10, left: 10, right: 10 };
var svgWidth = 2000;
var svgHeight = 1000;

d3.csv("result-2.csv", function (d) {
  return {
    name: d["name"],
    source: d["source"],
    target: d["role"],
    weight: 10,
    win: d["winPercent"],
  };
}).then(function (links) {
  //data
  var nodes = [];
  var nodesAdded = {};

  links.forEach(function (data) {
    if (!(data.source in nodesAdded)) {
      nodes.push({
        id: data.source,
        name: data.name,
        group: data.target,
        winRate: data.win,
        role: data.target,
      });
      nodesAdded[data.source] = data.weight;
    }
  });
  //color
  let color = d3.scaleOrdinal(d3.schemeSet1);

  // Define the div for the tooltip
  var div = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
    // Define the div for the tooltip
  var div2 = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);
  //force sim
  var simulation = d3
    .forceSimulation()
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(svgWidth / 2, svgHeight / 2))
    .force(
      "link",
      d3.forceLink().id(function (d) {
        return d.id;
      })
    );
  //draw
  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", svgWidth + margin.left + margin.right)
    .attr("height", svgHeight + margin.top + margin.bottom);

  function mouseout(event, d) {
    d3.select(".node" + d.id)
      .transition()
      .duration(1000)
      .attr("r", 5)
      .attr("fill", function (d) {
        return color(d.group);
      });
  }

  function mouseover(event, d) {
    d3.select(".node" + d.id)
      .transition()
      .duration(1000)
      .attr("r", 15);

    div.transition().duration(200).style("opacity", 0.9);
    div
      .html(d.name + "<br/>" + "\n" + "Win Percentage: " + d.winRate)
      .style("left", 600 + "px")
      .style("top", 158 + "px");
    div2.transition().duration(200).style("opacity", 0.9);
    if(d.role="1"){
        div2.html("adc"+"\n")
        .style("left", 800 + "px")
      .style("top", 158 + "px");
    }
    else if(d.role=2){
        div2.html("mid"+"\n")
        .style("left", 800 + "px")
      .style("top", 158 + "px");
    }
    else if(d.role=3){
        div2.html("top"+"\n")
        .style("left", 800 + "px")
      .style("top", 158 + "px");
    }
    else if(d.role=4){
        div2.html("jungle"+"\n")
        .style("left", 800 + "px")
      .style("top", 158 + "px");
    }
    else if(d.role=5){
        div2.html("support"+"\n")
        .style("left", 800 + "px")
      .style("top", 158 + "px");
    }
  }

  var link = svg
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke", "lightgrey");

  var node = svg
    .append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("class", function (d) {
      return "node" + d.id;
    })
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    )
    .on("mouseout", mouseout)
    .on("mouseover", mouseover)
    .attr("fill", function (d) {
      return color(d.group);
    });

  simulation.nodes(nodes).on("tick", ticked);

  simulation.force("link").links(links);

  function ticked() {
    link
      .attr("x1", function (d) {
        return d.source.x;
      })
      .attr("y1", function (d) {
        return d.source.y;
      })
      .attr("x2", function (d) {
        return d.target.x;
      })
      .attr("y2", function (d) {
        return d.target.y;
      });

    node
      .attr("r", 5)
      .attr("cx", function (d) {
        return d.x;
      })
      .attr("cy", function (d) {
        return d.y;
      })
      .text(function (d) {
        return d["name"];
      });
  }

  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
});
