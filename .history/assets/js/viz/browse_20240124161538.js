
var db = d3.select("#robot-list")

d3.csv('/robot-metaphors/assets/data/tsne_data/RobotAverages.csv', function (data){
    console.log(data);
    //tooltip element
    let tooltip = d3.select('body').append('div')
                .attr('class', 'tooltip')
                .style('opacity', 0);
     data.forEach(function (dataRow) {
        let imageURL = "/robot-metaphors/assets/data/stimuli/" + dataRow.ROBOT + ".PNG";
        let item = db.append('li')
                     .style('flex', '0 0 25%')
                     .style("padding-left", "5px")
                     .style("padding-right", "5px")
                     .style('min-width', '250px')
                     .append('div')
                     .style("outline", "1px solid #aaaaaa")
                     .style("padding-top", "5%")
                     .style("padding-bottom", "2%")
                     .style("opacity", 0)
                     

        item.append('img')
            .attr('src', imageURL)
            .attr("width", "90%")
            .attr("height", "90%");

        item.append('p').text(dataRow.ROBOT);

        // Add a little transition if it takes a while to load.
        item.transition().duration(100)
            .style('opacity', 1);
    });
});