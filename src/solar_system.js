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
  { name: "Mercury", tilt: 0.03, radius: 2439.7, period: 58.65 },
  { name: "Venus", tilt: 2.64, radius: 6051.8, period: -243 },
  { name: "Earth", tilt: 23.44, radius: 6371, period: 1 },
  { name: "Mars", tilt: 6.68, radius: 3389.5, period: 1.03 },
  { name: "Jupiter", tilt: 25.19, radius: 69911, period: 0.41 },
  { name: "Saturn", tilt: 26.73, radius: 58232, period: 0.44 },
  { name: "Uranus", tilt: 82.23, radius: 25362, period: -0.72 },
  { name: "Neptune", tilt: 28.32, radius: 24622, period: 0.72 }
];

var planetColor = "#fff";

function handleMouseOver(d, i) {
  d3.select(this).style("cursor", "pointer")
}

function handleMouseOut(d, i) {
  d3.select(this).style("cursor", "")
}

function displayPlanets(cfg, planets) {
  var boundingSize = (width / planets.length) - cfg.padding;

  var boundingArea = svg.append("g")
    .attr("id", "solar_system")
    .selectAll("g")
    .data(planets)
    .enter().append("g")
    .attr("transform", (d, i) => "translate(" + [i * (boundingSize + cfg.padding), height / 2] + ")")
    .on("click", (d) => { cleanView(); displayPlanetInfo(d); });

  boundingArea.append("text")
    .attr("class", "label")
    .attr("x", boundingSize / 3)
    .attr("y", -boundingSize / 2)
    .attr("dy", -12)
    .text(d => d.name);

  boundingArea.each(function (d) {
    var x = d3.select(this);
    drawPlanet(x);
  });

  function drawPlanet(element) {
    var planet = element.append("g")
      .attr("transform", "translate(" + [boundingSize / 2, 0] + ")");

    planet.append("circle")
      .attr("r", boundingSize / 3)
      .style("fill", planetColor);

    planet.on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut);
  }
}

function displayPlanetInfo(planet) {
  var boundingSize = (width / 3) - config.padding;

  var boundingArea = svg.append("g")
    .attr("id", "planet_info");

  var back = boundingArea.append("text")
    .text("Back")
    .attr("class", "info")
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut)
    .on("click", () => { cleanView(); displayPlanets(config, solar); });

  var info = boundingArea.append("g")
    .attr("transform", "translate(" + [(boundingSize / 2.5), (boundingSize / 2.5)] + ")")
    .attr("class", "info");
  info.append("text")
    .text("Radius: " + planet.radius + "km");
  info.append("text")
    .attr("y", 12)
    .text("Tilt: " + planet.tilt + "°");
  info.append("text")
    .attr("y", 24)
    .text("Day Length: " + planet.period);

  boundingArea.append("circle")
    .attr("transform", "translate(" + [(boundingSize / 2), (boundingSize / 2)] + ")")
    .attr("r", boundingSize / 3)
    .style("stroke", planetColor)
    .style("fill", "none");
}

function cleanView() {
  d3.select("#solar_system").remove();
  d3.select("#planet_info").remove();
}

displayPlanets(config, solar);
