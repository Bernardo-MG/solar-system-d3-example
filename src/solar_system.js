var margin = { top: 100, right: 50, bottom: 100, left: 50 };

var width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var config = {
  padding: 10,
  axisMultiplier: 1.4,
  glowRadius: 2,
};

var solar = [
  { name: "Mercury", tilt: 0.03, radius: 2439.7, period: 58.65, colours: ["#e7e8ec", "#b1adad"] },
  { name: "Venus", tilt: 2.64, radius: 6051.8, period: -243, colours: ["#f8e2b0", "#d3a567"] },
  { name: "Earth", tilt: 23.44, radius: 6371, period: 1, colours: ["#9fc164", "#6b93d6"] },
  { name: "Mars", tilt: 6.68, radius: 3389.5, period: 1.03, colours: ["#ef1501", "#ad0000"] },
  { name: "Jupiter", tilt: 25.19, radius: 69911, period: 0.41, colours: ["#d8ca9d", "	#a59186"] },
  { name: "Saturn", tilt: 26.73, radius: 58232, period: 0.44, colours: ["#f4d587", "#f4a587"] },
  { name: "Uranus", tilt: 82.23, radius: 25362, period: -0.72, colours: ["#e1eeee", "#adb0c3"] },
  { name: "Neptune", tilt: 28.32, radius: 24622, period: 0.72, colours: ["#85addb", "	#3f54ba"] }
];

var planetColor = "#fff";

var definitions = d3.select("svg").append("defs");
var filter = definitions.append("filter")
  .attr("id", "glow");
filter.append("feGaussianBlur")
  .attr("class", "blur")
  .attr("stdDeviation", config.glowRadius)
  .attr("result", "coloredBlur");
var feMerge = filter.append("feMerge")
feMerge.append("feMergeNode")
  .attr("in", "coloredBlur");
feMerge.append("feMergeNode")
  .attr("in", "SourceGraphic");

function displayPlanets(cfg, planets) {
  var boundingSize = (width / planets.length) - cfg.padding;

  var boundingArea = svg.append("g")
    .selectAll("g")
    .data(planets)
    .enter().append("g")
    .attr("transform", (d, i) => "translate(" + [i * (boundingSize + cfg.padding), height / 2] + ")")
    .on("mouseover", showInfo)
    .on("mouseout", hideInfo);

  var boundingRect = boundingArea.append("rect")
    .attr("class", "bounding-box")
    .attr("y", -boundingSize / 2)
    .attr("width", boundingSize)
    .attr("height", boundingSize);

  var info = boundingArea.append("g")
    .attr("transform", "translate(" + [0, (boundingSize / 2) + 18] + ")")
    .attr("class", "info")
    .style("opacity", 0);
  info.append("text")
    .text(d => "Radius: " + d.radius + "km");
  info.append("text")
    .attr("y", 12)
    .text(d => "Tilt: " + d.tilt + "°");
  info.append("text")
    .attr("y", 24)
    .text(d => "Day Length: " + d.period);

  var labels = boundingArea.append("text")
    .attr("class", "label")
    .attr("y", -boundingSize / 2)
    .attr("dy", -12)
    .text(d => d.name);

  var radiusScale = d3.scaleLinear()
    .domain([0, d3.max(planets, d => d.radius)])
    .range([0, (boundingSize / 2) - 3]);

  var planets = boundingArea.each(function (d) {
    var x = d3.select(this);
    drawPlanet(x, d);
  });

  function drawPlanet(element, data) {
    var planet = element.append("g")
      .attr("class", "planet")
      .attr("transform", "translate(" + [boundingSize / 2, 0] + ")");

    var fill = planet.append("circle")
      .attr("r", radiusScale(data.radius))
      .style("fill", planetColor);
  }
}

function showInfo(d) {
  d3.select(this).select("g.info")
    .transition()
    .style("opacity", 1);
}

function hideInfo(d) {
  d3.select(this).select("g.info")
    .transition()
    .style("opacity", 0);
}

displayPlanets(config, solar);
