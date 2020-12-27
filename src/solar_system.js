var width = 960,
  height = 500;

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g");

var solar = [
  {
    name: "Mercury", data: [
      { id: 'tilt', value: 0.03, label: 'Tilt' },
      { id: 'radius', value: 2439.7, label: 'Radius' },
      { id: 'period', value: 58.65, label: 'Period' }
    ]
  },
  {
    name: "Venus", data: [
      { id: 'tilt', value: 2.64, label: 'Tilt' },
      { id: 'radius', value: 6051.8, label: 'Radius' },
      { id: 'period', value: -243, label: 'Period' }
    ]
  },
  {
    name: "Earth", data: [
      { id: 'tilt', value: 23.44, label: 'Tilt' },
      { id: 'radius', value: 6371, label: 'Radius' },
      { id: 'period', value: 1, label: 'Period' }
    ]
  },
  {
    name: "Mars", data: [
      { id: 'tilt', value: 6.68, label: 'Tilt' },
      { id: 'radius', value: 3389.5, label: 'Radius' },
      { id: 'period', value: 1.03, label: 'Period' }
    ]
  },
  {
    name: "Jupiter", data: [
      { id: 'tilt', value: 25.19, label: 'Tilt' },
      { id: 'radius', value: 69911, label: 'Radius' },
      { id: 'period', value: 0.41, label: 'Period' }
    ]
  },
  {
    name: "Saturn", data: [
      { id: 'tilt', value: 26.73, label: 'Tilt' },
      { id: 'radius', value: 58232, label: 'Radius' },
      { id: 'period', value: 0.44, label: 'Period' }
    ]
  },
  {
    name: "Uranus", data: [
      { id: 'tilt', value: 82.23, label: 'Tilt' },
      { id: 'radius', value: 25362, label: 'Radius' },
      { id: 'period', value: -0.72, label: 'Period' }
    ]
  },
  {
    name: "Neptune", data: [
      { id: 'tilt', value: 28.32, label: 'Tilt' },
      { id: 'radius', value: 24622, label: 'Radius' },
      { id: 'period', value: 0.72, label: 'Period' }
    ]
  }
];

var planetColor = "#fff";

/**
 * Changes the cursor to the click icon.
 */
function handleShowClickIcon() {
  d3.select(this).style("cursor", "pointer")
}

/**
 * Changers the cursor back to the default icon.
 */
function handleRevertMouseIcon() {
  d3.select(this).style("cursor", "")
}

/**
 * Displays the received planets list.
 * 
 * @param {*} planets planets to display
 */
function displayPlanets(planets) {
  var boundingSize = (width / planets.length);

  var boundingArea = svg.append("g")
    .attr("id", "solar_system")
    .selectAll("g")
    .data(planets)
    .enter().append("g")
    .attr("transform", (d, i) => "translate(" + [i * (boundingSize), height / 2] + ")")
    .on("click", (d) => { cleanView(); displayPlanetInfo(d); });

  // Planet name
  boundingArea.append("text")
    .attr("class", "label")
    .attr("transform", "translate(" + [boundingSize / 3, -boundingSize / 2] + ")")
    .text(d => d.name);

  // Planets are drawn
  boundingArea.each(function (d) {
    var x = d3.select(this);
    drawPlanet(x, boundingSize);
  });
}

/**
 * Draws a planet circle.
 * 
 * @param {*} element elemento where to draw the circle
 * @param {*} boundingSize size of the bounds
 */
function drawPlanet(element, boundingSize) {
  var planet = element.append("g")
    .attr("transform", "translate(" + [boundingSize / 2, 0] + ")");

  planet.append("circle")
    .attr("r", boundingSize / 3)
    .style("fill", planetColor);

  planet.on("mouseover", handleShowClickIcon)
    .on("mouseout", handleRevertMouseIcon);
}

/**
 * Displays the received planet info.
 * 
 * @param {*} planet planet data
 */
function displayPlanetInfo(planet) {
  var boundingSize = (width / 3);

  var boundingArea = svg.append("g")
    .attr("id", "planet_info");

  // Back button
  var back = boundingArea.append("text")
    .text("Back")
    .attr("class", "info")
    .on("mouseover", handleShowClickIcon)
    .on("mouseout", handleRevertMouseIcon)
    .on("click", () => { cleanView(); displayPlanets(solar); });

  // Information label
  var info = boundingArea.append("g")
    .attr("transform", "translate(" + [boundingSize, (boundingSize / 2.5)] + ")")
    .attr("class", "info");

  // Planet info
  planet.data.forEach(function (d, i) {
    info.append("text")
      .attr("y", i * 24)
      .text(d.label + ": " + d.value + "km");
  });

  // Planet circle
  boundingArea.append("circle")
    .attr("transform", "translate(" + [(boundingSize / 2), (boundingSize / 2)] + ")")
    .attr("r", boundingSize / 3)
    .style("stroke", planetColor)
    .style("fill", "none");
}

/**
 * Cleans up the view.
 */
function cleanView() {
  d3.select("#solar_system").remove();
  d3.select("#planet_info").remove();
}

displayPlanets(solar);
