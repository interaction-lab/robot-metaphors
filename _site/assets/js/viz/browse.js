
var db = d3.select("#robot-list")

d3.csv('/robot-metaphors/assets/data/tsne_data/RobotAverages.csv', function (data){
    console.log(data);
    //tooltip element
    
    let imageURL = "/robot-metaphors/assets/data/stimuli/" + data.ROBOT + ".PNG"
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
                    
                    
                    
    item.append('img').attr('src', imageURL).attr("width", "90%").attr("height", "90%")
    item.append('p').text(data.ROBOT)


    // Add click event listener for toggling the overlay
    item.on('click', function (event) {
        //turn on the overlay
        d3.select("#overlay").style('display', 'block')

        //clears out the old info and add the robot picture to the overlay
        d3.select("#overlay_info").html(null)
            .append("img").attr('src', imageURL)
    });

    //add a little transition if it takes a while to load.
    item.transition().duration(100)
    .style('opacity', 1)
        
})