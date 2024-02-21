
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
    item.on('')

    // Add click event listener for toggling the overlay
    item.on('click', function (event) {
        //turn on the overlay
        d3.select("#overlay").style('display', 'block')

        //clears out the old info and add the robot picture to the overlay
        let overlay = d3.select("#overlay_info").html(null)
            .append('div').style("display", "flex")
                .style("flex-direction", "column")
                .style("align-items", "center")
                .style("justify-content", "center");

        overlay.append("h2")
            .style("text-align", "center")
            .style('font-size', '26px')
            .text(data.ROBOT);
        
        overlay.append("img").attr('src', imageURL).style('max-width', '600px');
        let table = overlay.append( 'table' )
        
        table.style('width', '100%'); // Set table width to 100%
        table.style('font-size', '12px'); // Set a smaller font size
        table.selectAll('th, td').style('padding', '8px'); // Decrease padding for cells
        // Append a table row (tr) with two table headers (th) for 'Social' and 'Functional'
        let row = table.append('tr')
        
        row.append('th').text('Social')
        row.append('th').text('Functional');
        row.append('th').text('Metaphors');


        row = table.append('tr')
        // Append a new table row (tr) with two table data (td) cells for 'Warmth' and 'Perception'
        row.append('td').text("Warmth: " + Math.round(data.WARMTH * 100) / 100)
        row.append('td').text("Perception and Interpretation: " + Math.round(data.PERCEPTION * 100) / 100);
        row.append('td').text(data.METAPHOR1_NAME);

        row = table.append('tr')
        // Append a new table row (tr) with two table data (td) cells for 'Warmth' and 'Perception'
        row.append('td').text("Competence: " + Math.round(data.COMPETENCE * 100) / 100)
        row.append('td').text("Tactile Interaction and Mobility: " + Math.round(data.TACTILE_MOBILITY * 100) / 100);
        row.append('td').text(data.METAPHOR2_NAME);

        row = table.append('tr')
        // Append a new table row (tr) with two table data (td) cells for 'Warmth' and 'Perception'
        row.append('td').text("Discomfort: " + Math.round(data.DISCOMFORT * 100) / 100)
        row.append('td').text("Nonverbal Communication: " + Math.round(data.NONVERBAL * 100) / 100);
        row.append('td').text(data.METAPHOR3_NAME);
        
        //hide the tooltip when clicking anywhere in the document, but not on the tool
    });

    //add a little transition if it takes a while to load.
    item.transition().duration(100)
    .style('opacity', 1)
        
})