var robotMap = {}
var constructExtents = {}
var constructAxes = {}
var rendered = false;

const COLS = ["WARMTH", "COMPETENCE", "DISCOMFORT", "MASCULINE", "FEMININE", 
              "ROLE", "LIKEABILITY", "PERCEPTION", "TACTILE_MOBILITY", 
              "AMBIGUITY", "ATYPICALITY"]

function init_compare_viz(){
    let width = document.getElementById('compare-viz').clientWidth
    let margin = width / 5;
    let height = parseInt(d3.select('#compare-viz').style('height'))

    COLS.forEach(function (col, i) {
        constructAxes[col] = d3.scaleLinear()
        .domain([-(constructExtents[col].max-constructExtents[col].min), 
                    constructExtents[col].max-constructExtents[col].min])
        .range([margin, width-margin])

        let axis = d3.select('#compare-viz').append('g').attr('class','axis')
        
        axis
            .call(d3.axisBottom(constructAxes[col]).ticks(5).tickSizeOuter(0))
            .attr("transform", "translate(0," + ((height / COLS.length) * i + 0.4* (height / COLS.length)) + ")")
            .select(".domain").remove()
        axis
            .append('text')
            .attr("text-anchor", "middle")
            .attr("x", width/2)
            .attr("y", 30)
            .style('fill', 'black')
            .text(col);
    })
}

function update_robot(){
    if(!rendered){
        init_compare_viz()
        rendered=true
    }

    let width = document.getElementById('compare-viz').clientWidth
    let margin = width / 5;
    let height = parseInt(d3.select('#compare-viz').style('height'))

    //get the robot from the correct side
    let r = d3.select('#right-robot').property("value")
    let l = d3.select('#left-robot').property("value")
    let graphData = []

    COLS.forEach(function (col, i) {
        graphData.push({
                'construct': col,
                'left': +robotMap[l][col],
                'difference': robotMap[r][col] - robotMap[l][col],
                'right': +robotMap[r][col]
            })
    })

    //update pictures
    d3.select('#left-robot-image').attr("src", '/assets/data/stimuli/' + l + '.PNG')
    d3.select('#left-robot-wordcloud').attr("src", '/assets/data/wordcloud_imgs/' + l + '.png')
    d3.select('#right-robot-image').attr("src", '/assets/data/stimuli/' + r + '.PNG')
    d3.select('#right-robot-wordcloud').attr("src", '/assets/data/wordcloud_imgs/' + r + '.png')

    //update metaphors
    let selection =d3.select('#left-robot-metaphors').selectAll('ul')
    .data([robotMap[l]["METAPHOR1_NAME"],robotMap[l]["METAPHOR2_NAME"],robotMap[l]["METAPHOR3_NAME"]]);
    selection.enter()
    .append('ul').text(function (d){ return d}).style('font-size', "12pt")
    selection.text(function (d){ return d}).style('font-size', "12pt")

    selection =d3.select('#right-robot-metaphors').selectAll('ul')
    .data([robotMap[r]["METAPHOR1_NAME"],robotMap[r]["METAPHOR2_NAME"],robotMap[r]["METAPHOR3_NAME"]]);
    selection.enter()
    .append('ul').text(function (d){ return d}).style('font-size', "12pt")
    selection.text(function (d){ return d}).style('font-size', "12pt")

    console.log(robotMap[l])
    //update bars
    selection = d3.select('#compare-viz').selectAll('.bar').data(graphData)
    
    selection
        .enter()
            .append('rect').attr('class', 'bar')
            .attr('x', function(d,i) { return Math.min(constructAxes[d.construct](d.difference),constructAxes[d.construct](0))})
            .attr('y', function(d,i) { return (height / COLS.length) * i + 0.15 * (height / COLS.length);})
            .attr('height', height / 50)
            .attr('width', function(d) { return Math.abs(constructAxes[d.construct](d.difference) - constructAxes[d.construct](0))})

    selection
        .transition().duration(1500)
        .attr('width', function(d) { return Math.abs(constructAxes[d.construct](d.difference) - constructAxes[d.construct](0))})
        .attr('x', function(d,i) { return Math.min(constructAxes[d.construct](d.difference),constructAxes[d.construct](0))})


    // update left numbers
    selection = d3.select('#compare-viz').selectAll('.leftnum').data(graphData)
    selection.enter()
        .append('text').attr('class', 'leftnum')
        .attr('x', 5)
        .attr('y', function(d,i) { return (height / COLS.length) * i + 0.5 * (height / COLS.length);})
        .text(function (d) { return d.left.toFixed(1)})
    selection
        .transition().duration(1500)
        .tween("text", function(d) {
            let selection = d3.select(this);    // selection of node being transitioned
            let start = d3.select(this).text(); // start value prior to transition
            let end = d.left.toFixed(1);                     // specified end value
            let interpolator = d3.interpolateNumber(start,end); // d3 interpolator
       
            return function(t) { selection.text(interpolator(t).toFixed(1)); };  // return value
         })
    
    //update right numbers
    selection = d3.select('#compare-viz').selectAll('.rightnum').data(graphData)
    selection.enter()
        .append('text').attr('class', 'rightnum')
        .attr("text-anchor", "end")
        .attr('x', width - 5)
        .attr('y', function(d,i) { return (height / COLS.length) * i + 0.5 * (height / COLS.length);})
        .text(function (d) { return d.right.toFixed(1)})
    selection
        .transition().duration(1500)
        .tween("text", function(d) {
            let selection = d3.select(this);    // selection of node being transitioned
            let start = d3.select(this).text(); // start value prior to transition
            let end = d.right.toFixed(1);                     // specified end value
            let interpolator = d3.interpolateNumber(start,end); // d3 interpolator
       
            return function(t) { selection.text(interpolator(t).toFixed(1)); };  // return value   
         })

}

var data = d3.csv('/assets/data/tsne_data/RobotAverages.csv', function (data){

    d3.select('#right-robot').append('option').attr('value', data.ROBOT).text(data.ROBOT)
    d3.select('#left-robot').append('option').attr('value', data.ROBOT).text(data.ROBOT)
    robotMap[data.ROBOT] = data
    COLS.forEach(function (col) {
        if(constructExtents[col] === undefined){
            constructExtents[col] = {'min': +data[col], 'max': +data[col]}
        }
        else if(constructExtents[col].min > +data[col]){
            constructExtents[col].min = +data[col]
        }
        else if(constructExtents[col].max < +data[col]){
            constructExtents[col].max = +data[col]
        }
    })

    d3.select('#right-robot').on('change', function() {
        update_robot()
    })

    d3.select('#left-robot').on('change', function() {
        update_robot()
    })

})

// var data = [210, 36, 322, 59, 123, 350, 290];

// // var width = 400, height = 300;

// var s = d3.select("body")
//     .append("svg")
//     .attr("width", width)
//     .attr("height", height);

// var bars = s.selectAll(".myBars")
//     .data(data)
//     .enter()
//     .append("rect") 
//     .attr("x", 10)
//     .attr("y", function(d,i){ return 10 + i*40})
//     .attr("width", function(d){ return d})
//     .attr("height", 30);