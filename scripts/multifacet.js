let chosen_robot;
// get dropdown from CSV
d3.csv("/data/tsne_data/RobotAverages.csv", d3.autoType).then((multifacet_data) => {
// d3.csv("/data/tsne_data/RobotAverages.csv", function(error, multifacet_data) {
    console.log(multifacet_data)
    
    var select = d3.select("body")
        .select("#dropdown")
        .append("select")

    let robots = [];
    for (let i = 0; i < multifacet_data.length; i++) {
        robots.push(multifacet_data[i].ROBOT);
    }
    
    // sets first robot as default value
    chosen_robot = multifacet_data[0].ROBOT

    // initialise chart, image, word cloud and heading
    initChart(chosen_robot)
    loadImage(chosen_robot)
    wordCloud(chosen_robot)
    d3.select("#robotName").text(chosen_robot);

    // changes data depending on chosen robot
    select
        .on("change", function(d) {
        chosen_robot = d3.select(this).property("value");
        updateChart(chosen_robot);
        });

    select.selectAll("option")
        .data(robots)
        .enter()
        .append("option")
        .attr("chosen_robot", function (d) { return d; })
        .text(function (d) { return d; });
});