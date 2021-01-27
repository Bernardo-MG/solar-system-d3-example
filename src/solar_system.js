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
    name: "Mercury", data: [
      { id: 'tilt', value: 0.03, label: 'Tilt' },
      { id: 'radius', value: 2439.7, label: 'Radius' },
      { id: 'period', value: 58.65, label: 'Period' }
    ],
    satellites: []
  },
  {
    name: "Venus", data: [
      { id: 'tilt', value: 2.64, label: 'Tilt' },
      { id: 'radius', value: 6051.8, label: 'Radius' },
      { id: 'period', value: -243, label: 'Period' }
    ],
    satellites: []
  },
  {
    name: "Earth", data: [
      { id: 'tilt', value: 23.44, label: 'Tilt' },
      { id: 'radius', value: 6371, label: 'Radius' },
      { id: 'period', value: 1, label: 'Period' }
    ],
    satellites: [
      { name: 'Moon' }
    ]
  },
  {
    name: "Mars", data: [
      { id: 'tilt', value: 6.68, label: 'Tilt' },
      { id: 'radius', value: 3389.5, label: 'Radius' },
      { id: 'period', value: 1.03, label: 'Period' }
    ],
    satellites: [
      { name: 'Phobos' },
      { name: 'Deimos' }
    ]
  },
  {
    name: "Jupiter", data: [
      { id: 'tilt', value: 25.19, label: 'Tilt' },
      { id: 'radius', value: 69911, label: 'Radius' },
      { id: 'period', value: 0.41, label: 'Period' }
    ],
    satellites: [
      { name: 'Metis' },
      { name: 'Adrastea' },
      { name: 'Amalthea' },
      { name: 'Thebe' },
      { name: 'Io' },
      { name: 'Europa' },
      { name: 'Ganymede' },
      { name: 'Callysto' }
    ]
  },
  {
    name: "Saturn", data: [
      { id: 'tilt', value: 26.73, label: 'Tilt' },
      { id: 'radius', value: 58232, label: 'Radius' },
      { id: 'period', value: 0.44, label: 'Period' }
    ],
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
    name: "Uranus", data: [
      { id: 'tilt', value: 82.23, label: 'Tilt' },
      { id: 'radius', value: 25362, label: 'Radius' },
      { id: 'period', value: -0.72, label: 'Period' }
    ],
    satellites: [
      { name: 'Cordelia' },
      { name: 'Ophelia' },
      { name: 'Bianca' },
      { name: 'Cressida' },
      { name: 'Desdemona' },
      { name: 'Juliet' },
      { name: 'Portia' }
    ]
  },
  {
    name: "Neptune", data: [
      { id: 'tilt', value: 28.32, label: 'Tilt' },
      { id: 'radius', value: 24622, label: 'Radius' },
      { id: 'period', value: 0.72, label: 'Period' }
    ],
    satellites: [
      { name: 'Naiad' },
      { name: 'Thalassa' },
      { name: 'Despina' },
      { name: 'Galatea' },
      { name: 'Larissa' },
      { name: 'Hippocamp' },
      { name: 'Proteus' }
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

  // Planet circle
  planetsView.append("circle")
    .attr("class", "planet")
    .attr("transform", (d, i) => "translate(" + [planetRadius, 0] + ")")
    .attr("r", planetRadius);

  // Graticule
  var path = getPath(planetRadius);

  var graticule = getGraticule(planetRadius);

  planetsView.append("path")
    .attr("class", "graticule clickable")
    .datum(graticule)
    .attr("d", path)
    .on("click", (d, i) => { cleanView(); displayPlanetInfo(view, width / 2, height / 3, width, height, planets[i]); });

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
 * @param {*} height view height
 * @param {*} planet planet data
 */
function displayPlanetInfo(view, x, y, width, height, planet) {
  var planetViewWidth = (width / 3);
  var planetRadius = planetViewWidth / 30;

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
    .attr("transform", "translate(" + [planetViewWidth, (planetViewWidth / 2.5)] + ")")
    .attr("class", "info");

  // Planet info
  info.selectAll("g")
    .data(planet.data).enter()
    .append("text")
    .attr("y", (d, i) => i * 24)
    .text((d) => d.label + ": " + d.value);

  var planetView = boundingArea.append("g");

  // Planet circle
  planetView.append("circle")
    .attr("id", "planet")
    .attr("class", "planet")
    .attr("transform", "translate(" + [(planetViewWidth / 2), (planetViewWidth / 2)] + ")")
    .attr("r", planetRadius);

  // Graticule
  var path = getPath(planetRadius);

  var graticule = getGraticule(planetRadius);

  planetView.append("path")
    .attr("class", "graticule")
    .datum(graticule)
    .attr("transform", "translate(" + [(planetViewWidth / 2) - planetRadius, (planetViewWidth / 2)] + ")")
    .attr("d", path);

  // Satellite orbit
  planetView.selectAll("g")
    .data(planet.satellites).enter()
    .append("circle")
    .attr("class", "orbit")
    .attr("transform", "translate(" + [(planetViewWidth / 2), (planetViewWidth / 2)] + ")")
    .attr("r", (d, i) => (i + 2) * planetRadius);

  // Satellite point
  planetView.selectAll("g")
    .data(planet.satellites).enter()
    .append("circle")
    .attr("cx", (d, i) => (i + 2) * planetRadius)
    .attr("r", planetRadius / 5)
    .attr("transform", "translate(" + [(planetViewWidth / 2), (planetViewWidth / 2)] + ")")
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
