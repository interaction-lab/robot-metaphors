let dataset;

// for mouseover
var multifacet_tooltip = d3.select("#multifacet_dataviz").append("div").attr("class", "multifacet_toolTip");

// set the dimensions and margins of the graph
// top, right, bottom, left decide where graph starts
var multifacet_margin = {top: 20, right: 30, bottom: 40, left: 150},
    multifacet_width = 750 - multifacet_margin.left - multifacet_margin.right,
    multifacet_height = 400 - multifacet_margin.top - multifacet_margin.bottom;

// append the svg object to the body of the page
var multifacet_svg = d3.select("#multifacet_dataviz")
  .append("svg")
    .attr("id", "chart")
    .attr("width", multifacet_width + multifacet_margin.left + multifacet_margin.right)
    .attr("height", multifacet_height + multifacet_margin.top + multifacet_margin.bottom)
    .call(responsivefy) // tada!
  .append("g")
    .attr("transform",
          "translate(" + multifacet_margin.left + "," + multifacet_margin.top + ")");

// Source: https://benclinkinbeard.com/d3tips/make-any-chart-responsive-with-one-function/?utm_content=buffer976d6&utm_medium=social&utm_source=twitter.com&utm_campaign=buffer
function responsivefy(multifacet_svg) {
  // container will be the DOM element
  // that the svg is appended to
  // we then measure the container
  // and find its aspect ratio
  const container = d3.select(multifacet_svg.node().parentNode),
      multifacet_width = parseInt(multifacet_svg.style('width'), 10),
      multifacet_height = parseInt(multifacet_svg.style('height'), 10),
      aspect = multifacet_width / multifacet_height;
 
  // set viewBox attribute to the initial size
  // control scaling with preserveAspectRatio
  // resize svg on inital page load
  multifacet_svg.attr('viewBox', `0 0 ${multifacet_width} ${multifacet_height}`)
      .attr('preserveAspectRatio', 'xMinYMid')
      .call(resize);
 
  // add a listener so the chart will be resized
  // when the window resizes
  // multiple listeners for the same event type
  // requires a namespace, i.e., 'click.foo'
  // api docs: https://goo.gl/F3ZCFr
  d3.select(window).on(
      'resize.' + container.attr('id'), 
      resize
  );
 
  // this is the code that resizes the chart
  // it will be called on load
  // and in response to window resizes
  // gets the width of the container
  // and resizes the svg to fill it
  // while maintaining a consistent aspect ratio
  function resize() {
      const w = parseInt(container.style('width'));
      multifacet_svg.attr('width', w);
      multifacet_svg.attr('height', Math.round(w / aspect));
  }
}

// gridlines in x axis function
function make_x_gridlines(x) {   
    return d3.axisBottom(x)
        .ticks(5)
}

// gridlines in y axis function
function make_y_gridlines(y) {   
    return d3.axisLeft(y)
        .ticks(5)
}

function initChart(robot)
{
  d3.csv("/assets/data/tsne_data/RobotAverages.csv", d3.autoType).then((data) => {
  // d3.csv("/data/tsne_data/RobotAverages.csv", function(data) {

    for (let i = 0; i < data.length; i++) {

      if(data[i].ROBOT.includes(robot))
      {
        // csv and graph labels
        csv_labels = ["WARMTH", "COMPETENCE", "DISCOMFORT", "PERCEPTION", "TACTILE_MOBILITY", "NONVERBAL"]
        graph_labels = ["Warmth", "Competence", "Discomfort", "Perception & Interpretation", "Tactile Interaction & Mobility", "Nonverbal Communication"]
        
        // can change this into a dictionary, but this works too
        let robot_data = [];
        for (let j = 0; j < csv_labels.length; j++)
        {
          robot_data.push(data[i][csv_labels[j]])
        }

        // transposed the data above to merge all 3 cols into 1 data structure
        // easier to parse data this way
        transposed = d3.zip(csv_labels, robot_data, graph_labels)
        dataset = transposed

        break;
      }
    }

    // Add X axis
    var x = d3.scaleLinear()
      .domain([-3, 3])
      .range([ 0, multifacet_width]);
    multifacet_svg.append("g")
      .attr("transform", "translate(0," + multifacet_height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Y axis
    var y = d3.scaleBand()
      .range([ 0, multifacet_height ])
      .domain(transposed.map(function(d) { return d[2] }))
      .padding(.1);
    multifacet_svg.append("g")
      .call(d3.axisLeft(y))

    // add the X gridlines
    multifacet_svg.append("g")     
      .attr("class", "grid")
      .attr("transform", "translate(0," + multifacet_height + ")")
      .call(make_x_gridlines(x)
          .tickSize(-multifacet_height)
          .tickFormat("")
      )

    // add the Y gridlines
    // multifacet_svg.append("g")     
    //     .attr("class", "grid")
    //     .call(make_y_gridlines()
    //         .tickSize(-width)
    //         .tickFormat("")
    //     )

    let counter = 0;
    // give 2 colour names for colour scheme
    // blue/orange colour scheme (colour-blind safe)
    let blue = d3.scaleLinear().domain([1,6]).range(["#569fce", "#083471"])
    let orange = d3.scaleLinear().domain([1,6]).range(["#feddbd", "#8b2c04"])
    
    //Bars
    multifacet_svg.selectAll("myRect")
      .data(transposed)
      .enter()
        .append("rect")
        // changed all the d[0] where it's csv labels to d[2] graph labels
        // d[0] --> name of feature; d[1] --> value of feature
        .attr("x", function(d) { return x(Math.min(d[1], 0)) })
        .attr("y", function(d) { return y(d[2]); })
        .attr("width", function(d) { return x(Math.abs(d[1])) - x(0) })
        .attr("height", y.bandwidth() )
        // make colour scheme a range
        .attr("fill", function(d) {
          counter++;
          if(counter <= 3) return blue(counter);
          else return orange(counter)
          // social labels (3) --> same colour
        })
        .on("mousemove", function(event, d){
        // Replace hard coded vals (40, 220) with 50% of the tooltip width and height + a top buffer
          multifacet_tooltip
              .style("left", (event.pageX - 40) + "px")
              .style("top", (event.pageY - 495) + "px")
              .style("display", "inline-block")
              // rounded to 2 decimal places
              .html("<span>" + (Math.round(d[1]*100)/100) + "</span>")
            // d3.select(this).style("cursor", "pointer"); 
        })
        .on("mouseout", function(d){
          multifacet_tooltip
            .style("display", "none");
        })
  })
}

function updateChart(robot)
{
  loadImage(robot);
  wordCloud(robot);
  d3.select("#dropdown").selectAll('option').property('selected', d => {return d == robot} ); //select the correct robot from the dropdown
  d3.csv("/assets/data/tsne_data/RobotAverages.csv", d3.autoType).then((data) => {
  // d3.csv("/data/tsne_data/RobotAverages.csv", function(data) {

    for (let i = 0; i < data.length; i++) {

      if(data[i].ROBOT.includes(robot))
      {
        csv_labels = ["WARMTH", "COMPETENCE", "DISCOMFORT", "PERCEPTION", "TACTILE_MOBILITY", "NONVERBAL"]
        graph_labels = ["Warmth", "Competence", "Discomfort", "Perception & Interpretation", "Tactile Interaction & Mobility", "Nonverbal Communication"]
        
        // can change this into a dictionary, but this works too
        let robot_data = [];
        for (let j = 0; j < csv_labels.length; j++)
        {
          robot_data.push(data[i][csv_labels[j]])
        }
        transposed = d3.zip(csv_labels, robot_data, graph_labels)
        dataset = transposed

        break;
      }
    }

  // Add X axis
  var x = d3.scaleLinear()
    .domain([-3, 3])
    .range([ 0, multifacet_width]);

  // Y axis
  var y = d3.scaleBand()
    .range([ 0, multifacet_height ])
    .domain(transposed.map(function(d) { return d[0]}))
    .padding(.1);

  //Bars
  multifacet_svg.selectAll("rect")
    .data(transposed)
    .transition() // <---- Here is the transition
    .duration(1000) // 2 seconds
    .attr("x", function(d) { return x(Math.min(d[1], 0)) })
    .attr("width", function(d) { return x(Math.abs(d[1])) - x(0) })
    .attr("height", y.bandwidth() )
  })
}

// TODO:
// - maybe make a 3d array for this to see if it works AND THEN try a map
