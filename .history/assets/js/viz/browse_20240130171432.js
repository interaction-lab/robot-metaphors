// Select the list where you want to append your items
var db = d3.select("#robot-list");

// Define the tooltip outside of the data loading function so it's accessible globally
let tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0)
    .style('position', 'absolute') // Ensure it's positioned absolutely to place it correctly
    .style('background', 'white') // Add background color for visibility
    .style('border', '1px solid black') // Add border for visibility
    .style('padding', '10px'); // Add some padding

// Load your CSV data
d3.csv('/robot-metaphors/assets/data/tsne_data/RobotAverages.csv', function (data) {
    // For each row in the CSV, create an item
    data.forEach(function(d) {
        let imageURL = "/robot-metaphors/assets/data/stimuli/" + d.ROBOT + ".PNG";
        let item = db.append('li')
                    .style('flex', '0 0 25%')
                    .style("padding-left", "5px")
                    .style("padding-right", "5px")
                    .style('min-width', '250px')
                        .append('div')
                        .style("outline", "1px solid #aaaaaa")
                        .style("padding-top", "5%")
                        .style("padding-bottom", "2%")
                        .style("opacity", 0);

        item.append('img').attr('src', imageURL).attr("width", "90%").attr("height", "90%");
        item.append('p').text(d.ROBOT);

        // Add click event listener for toggling the tooltip
        item.on('click', function (event) {
            // Toggle the tooltip visibility
            var currentOpacity = tooltip.style('opacity');
            if (currentOpacity == 0) {
                tooltip.transition()
                       .duration(200)
                       .style('opacity', 1);
                tooltip.html(d.ROBOT) // Set the tooltip content to the robot name
                       .style('left', (event.pageX + 10) + 'px') // Position it near the click
                       .style('top', (event.pageY + 10) + 'px');
            } else {
                tooltip.transition()
                       .duration(200)
                       .style('opacity', 0);
            }
        });

        // Add a little transition if it takes a while to load.
        item.transition().duration(100).style('opacity', 1);
    });
});
