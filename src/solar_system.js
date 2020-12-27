var w = 960;
var h = 500;

var svg = d3.select("body").append("svg")
  .attr("width", w)
  .attr("height", h)
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
 * @param {*} x x axis position
 * @param {*} y y axis position
 * @param {*} width view width
 * @param {*} height view height
 * @param {*} planets planets to display
 */
function displaySun(x, y, width, height) {
  var radius = width * 5;
  var xpos = x - (width * 4);
  var ypos = height / 2;

  var boundingArea = svg.append("g")
    .attr("id", "sun")
    .attr("transform", "translate(" + [x, y] + ")");

  var sun = boundingArea.append("g")
    .attr("transform", "translate(" + [xpos, ypos] + ")");

  sun.append("circle")
    .attr("r", radius)
    .style("fill", planetColor);
}

/**
 * Displays the received planets list.
 * 
 * @param {*} x x axis position
 * @param {*} y y axis position
 * @param {*} width view width
 * @param {*} height view height
 * @param {*} planets planets to display
 */
function displayPlanets(x, y, width, height, planets) {
  var planetViewWidth = (width / planets.length);
  var planetViewHeight = height / 2;
  var planetRadius = planetViewWidth / 3;

  var planetsView = svg.append("g")
    .attr("id", "solar_system")
    .attr("transform", "translate(" + [x, y] + ")")
    .selectAll("g")
    .data(planets)
    .enter().append("g")
    .attr("transform", (d, i) => "translate(" + [i * (planetViewWidth), planetViewHeight] + ")")
    .on("click", (d) => { cleanView(); displayPlanetInfo(width, height, d); });

  // Planet name
  planetsView.append("text")
    .attr("class", "label")
    .attr("transform", "translate(" + [planetViewWidth / 3, -planetViewWidth / 2] + ")")
    .text(d => d.name);

  // Planets are drawn
  planetsView.each(function (d) {
    var x = d3.select(this);
    drawPlanet(x, planetViewWidth / 2, planetRadius);
  });
}

/**
 * Draws a planet circle.
 * 
 * @param {*} element elemento where to draw the circle
 * @param {*} xpos x axis position
 * @param {*} radius planet radius
 */
function drawPlanet(element, xpos, radius) {
  var planet = element.append("g")
    .attr("transform", "translate(" + [xpos, 0] + ")");

  planet.append("circle")
    .attr("r", radius)
    .style("fill", planetColor);

  planet.on("mouseover", handleShowClickIcon)
    .on("mouseout", handleRevertMouseIcon);
}

/**
 * Displays the received planet info.
 * 
 * @param {*} width view width
 * @param {*} height view height
 * @param {*} planet planet data
 */
function displayPlanetInfo(width, height, planet) {
  var planetViewWidth = (width / 3);
  var planetRadius = planetViewWidth / 3;

  var boundingArea = svg.append("g")
    .attr("id", "planet_info");

  // Back button
  var back = boundingArea.append("text")
    .text("Back")
    .attr("class", "info")
    .on("mouseover", handleShowClickIcon)
    .on("mouseout", handleRevertMouseIcon)
    .on("click", () => { cleanView(); displayPlanets(0, 0, width, height, solar); });

  // Information label
  var info = boundingArea.append("g")
    .attr("transform", "translate(" + [planetViewWidth, (planetViewWidth / 2.5)] + ")")
    .attr("class", "info");

  // Planet info
  planet.data.forEach(function (d, i) {
    info.append("text")
      .attr("y", i * 24)
      .text(d.label + ": " + d.value);
  });

  // Planet circle
  boundingArea.append("circle")
    .attr("transform", "translate(" + [(planetViewWidth / 2), (planetViewWidth / 2)] + ")")
    .attr("r", planetRadius)
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

displaySun(0, 0, (w / 4), h);
displayPlanets((w / 4), 0, w - (w / 4), h, solar);
