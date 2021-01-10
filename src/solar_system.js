var w = 960;
var h = 500;

var mainView = d3.select("body").append("svg")
  .attr("id", "main_view")
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

/**
 * Draws the sun in the view.
 * 
 * @param {*} view where the image will be drawn
 * @param {*} x x axis position
 * @param {*} y y axis position
 * @param {*} width view width
 * @param {*} height view height
 * @param {*} planets planets to display
 */
function displaySun(view, width, height) {
  var radius = width * 5;
  var xpos = 0 - (width * 4);
  var ypos = height / 2;

  var sun = view.append("g")
    .attr("id", "sun")
    .attr("transform", "translate(" + [xpos, ypos] + ")");

  sun.append("circle")
    .attr("class", "planet")
    .attr("r", radius);
}

/**
 * Draws the planets in the view.
 * 
 * @param {*} view where the image will be drawn
 * @param {*} x x axis position
 * @param {*} y y axis position
 * @param {*} width view width
 * @param {*} height view height
 * @param {*} planets planets to display
 */
function displayPlanets(view, x, y, width, height, planets) {
  var planetViewWidth = (width / planets.length);
  var planetRadius = planetViewWidth / 3;
  var planetViewSide = planetRadius * 2;

  // General container
  var planetsView = view.append("g")
    .attr("id", "planets")
    .attr("transform", "translate(" + [x + 10, y] + ")");

  // Planet container
  planetsView = planetsView.selectAll("g")
    .data(planets)
    .enter().append("g")
    .attr("transform", (d, i) => "translate(" + [i * (planetViewSide + 10), 0] + ")");

  // Planet circle
  planetsView.append("circle")
    .attr("class", "planet")
    .attr("transform", (d, i) => "translate(" + [planetRadius, 0] + ")")
    .attr("r", planetRadius)
    .on("click", (d) => { cleanView(); displayPlanetInfo(view, width / 2, height / 3, width, height, d); });

  // Planet name
  planetsView.append("text")
    .attr("class", "label")
    .attr("transform", "translate(" + [0, -(planetRadius + 10)] + ")")
    .text(d => d.name);
}

function displaySolarSystem(view) {
  var sunWidth = (w / 4);

  displaySun(view, sunWidth, h);
  displayPlanets(view, sunWidth, h / 2, w - sunWidth, h, solar);
}

/**
 * Displays the planet info.
 * 
 * @param {*} x x axis position
 * @param {*} y y axis position
 * @param {*} width view width
 * @param {*} height view height
 * @param {*} planet planet data
 */
function displayPlanetInfo(view, x, y, width, height, planet) {
  var planetViewWidth = (width / 3);
  var planetRadius = planetViewWidth / 3;

  var boundingArea = view.append("g")
    .attr("id", "planet_info")
    .attr("transform", "translate(" + [x, y] + ")");

  // Back button
  boundingArea.append("text")
    .text("Back")
    .attr("class", "info")
    .attr("class", "button")
    .on("click", () => { cleanView(); displaySolarSystem(view); });

  // Information label
  var info = boundingArea.append("g")
    .attr("transform", "translate(" + [planetViewWidth, (planetViewWidth / 2.5)] + ")")
    .attr("class", "info");

  // Planet info
  info.selectAll("g").data(planet.data)
    .enter().append("text")
    .attr("y", (d, i) => i * 24)
    .text((d) => d.label + ": " + d.value);

  // Planet circle
  boundingArea.append("circle")
    .attr("class", "planet")
    .attr("transform", "translate(" + [(planetViewWidth / 2), (planetViewWidth / 2)] + ")")
    .attr("r", planetRadius)
    .style("fill", "none");
}

/**
 * Cleans up the view.
 */
function cleanView() {
  d3.select("#sun").remove();
  d3.select("#planets").remove();
  d3.select("#planet_info").remove();
}

displaySolarSystem(mainView);
