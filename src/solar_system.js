var rootView = d3.select("body").append("svg")
  .attr("id", "mainGraphic")
  .attr("class", "graphic_view")
  .append("g");

var svgDefs = rootView.append('defs');

var mainGradient = svgDefs.append('radialGradient')
  .attr('id', 'sunGradient');

mainGradient.append('stop')
  .attr('class', 'stop-left')
  .attr('offset', '0');

mainGradient.append('stop')
  .attr('class', 'stop-right')
  .attr('offset', '1');

var solar = [
  {
    name: "Mercury",
    satellites: []
  },
  {
    name: "Venus",
    satellites: []
  },
  {
    name: "Earth",
    satellites: [
      { name: 'Moon' }
    ]
  },
  {
    name: "Mars",
    satellites: [
      { name: 'Phobos' },
      { name: 'Deimos' }
    ]
  },
  {
    name: "Jupiter",
    satellites: [
      { name: 'Io' },
      { name: 'Europa' },
      { name: 'Ganymede' },
      { name: 'Callisto' }
    ]
  },
  {
    name: "Saturn",
    satellites: [
      { name: 'Mimas' },
      { name: 'Enceladus' },
      { name: 'Tethys' },
      { name: 'Dione' },
      { name: 'Rhea' },
      { name: 'Titan' },
      { name: 'Iapetus' }
    ]
  },
  {
    name: "Uranus",
    satellites: [
      { name: 'Miranda' },
      { name: 'Ariel' },
      { name: 'Umbriel' },
      { name: 'Titania' },
      { name: 'Oberon' }
    ]
  },
  {
    name: "Neptune",
    satellites: [
      { name: 'Proteus' },
      { name: 'Triton' },
      { name: 'Nereid' }
    ]
  }
];

function getPath(radius) {
  var radiusScale = d3.scaleLinear()
    .domain([0, radius])
    .range([0, radius]);

  var projection = d3.geoOrthographic()
    .translate([radius, 0])
    .scale(radiusScale(radius));

  return d3.geoPath()
    .projection(projection);
}

function getGraticule(radius) {
  var graticuleScale = d3.scaleLinear()
    .domain([0, radius])
    .range([0, 10]);

  var graticule = d3.geoGraticule();

  return graticule.step([graticuleScale(radius), graticuleScale(radius)]);
}

/**
 * Draws the sun in the view.
 * 
 * @param {*} view where the image will be drawn
 * @param {*} radius sun radius
 */
function displaySun(view, radius) {
  var arcGen = d3.arc()
    .innerRadius(0)
    .outerRadius(radius)
    .startAngle(0)
    .endAngle(Math.PI);

  view
    .append("path")
    .attr("id", "sun")
    .attr("class", "sun centered")
    .attr("d", arcGen)
    .attr("stroke-width", 1);
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
  var padding = 10;
  var margin = 10;
  var reducedWith = width - margin;
  var planetViewSide = (reducedWith / planets.length) - padding;
  var planetRadius = planetViewSide / 2;

  // General container
  var planetsView = view.append("g")
    .attr("id", "planets")
    .attr("transform", "translate(" + [x + margin, y] + ")");

  // Planet container
  planetsView = planetsView.selectAll("g")
    .data(planets).enter()
    .append("g")
    .attr("transform", (d, i) => "translate(" + [i * (planetViewSide + padding), 0] + ")");

  // Graticule
  var path = getPath(planetRadius);

  var graticule = getGraticule(planetRadius);

  const index = d3.local();

  var p = planetsView.append("path")
    .attr("class", "graticule clickable")
    .datum(graticule)
    .attr("d", path)
    .each(function (d, i) { index.set(d, i); })
    .on("click", (e, d) => { cleanView(); displayPlanetInfo(view, width / 2, height / 3, width / 3, planets[index.get(d)]); });

  // Planet name
  planetsView.append("text")
    .attr("text-anchor", "start")
    .attr("dy", -(planetRadius + padding))
    .text(d => d.name);
}

function displaySolarSystem(view) {
  var mainView = d3.select("svg#mainGraphic");
  var node = mainView.node();
  var width = node.clientWidth;
  var height = node.clientHeight;
  var sunWidth = (width / 4);

  var radius = Math.min(sunWidth, height);

  displaySun(view, radius);
  displayPlanets(view, sunWidth, height / 2, width - sunWidth, height, solar);
}

/**
 * Displays the planet info.
 * 
 * @param {*} x x axis position
 * @param {*} y y axis position
 * @param {*} width view width
 * @param {*} planet planet data
 */
function displayPlanetInfo(view, x, y, width, planet) {
  var planetRadius = width / 10;

  var boundingArea = view.append("g")
    .attr("id", "planet_info")
    .attr("transform", "translate(" + [x, y] + ")");

  // Back button
  boundingArea.append("text")
    .text("Back")
    .attr("class", "button")
    .on("click", () => { cleanView(); displaySolarSystem(view); });

  // Information label
  var info = boundingArea.append("g")
    .attr("id", "planet_data")
    .attr("transform", "translate(" + [width, (width / 2.5)] + ")")
    .attr("class", "info");

  var planetView = boundingArea.append("g");

  // Graticule
  var path = getPath(planetRadius);

  var graticule = getGraticule(planetRadius);

  planetView.append("path")
    .attr("class", "graticule")
    .on("mouseover", (d) => handleShowName(planet.name))
    .on("mouseout", handleHideName)
    .datum(graticule)
    .attr("transform", "translate(" + [(width / 2) - planetRadius, (width / 2)] + ")")
    .attr("d", path);

  // Satellite orbit
  planetView.selectAll("g")
    .data(planet.satellites).enter()
    .append("circle")
    .attr("class", "orbit")
    .attr("transform", "translate(" + [(width / 2), (width / 2)] + ")")
    .attr("r", (d, i) => (i + 2) * planetRadius);

  // Satellite point
  planetView.selectAll("g")
    .data(planet.satellites).enter()
    .append("circle")
    .attr("id", (d) => "satellite_" + d.name)
    .on("mouseover", (d) => handleShowName(d.name))
    .on("mouseout", handleHideName)
    .attr("cx", (d, i) => (i + 2) * planetRadius)
    .attr("r", planetRadius / 5)
    .attr("transform", "translate(" + [(width / 2), (width / 2)] + ")");
}

function handleShowName(name) {
  // Specify where to put label of text
  d3.select("#planet_data")
    .append("text")
    .attr("id", "shown_name")
    .text(function () {
      return name;  // Value of the text
    });
}

function handleHideName() {
  d3.select("#shown_name").remove();
}

/**
 * Cleans up the view.
 */
function cleanView() {
  d3.select("#sun").remove();
  d3.select("#planets").remove();
  d3.select("#planet_info").remove();
}

var mainView = d3.select("svg#mainGraphic");
var node = mainView.node();
var width = node.clientWidth;
var height = node.clientHeight;

mainView.attr('viewBox', '0 0 ' + width + ' ' + height)
  .attr('preserveAspectRatio', 'xMinYMin');

displaySolarSystem(rootView);
