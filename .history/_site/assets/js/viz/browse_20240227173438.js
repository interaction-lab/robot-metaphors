
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
    item.on("mouseover", function(event, d) {
        d3.select(this).style("cursor", "pointer"); 
    })
     
    .on("mouseout", function(event, d) {
        d3.select(this).style("cursor", "default"); 
    })

    // Add click event listener for toggling the overlay
    item.on('click', function (event) {
        //turn on the overlay
        d3.select("#overlay").style('display', 'block')
        .style('height', 'clamp(10px, 1.5vw, 20px)')

        //clears out the old info and add the robot picture to the overlay
        let overlay = d3.select("#overlay_info").html(null)
           

        overlay.append("h2")
            .style("text-align", "center")
            .style('font-size', '26px')
            .text(data.ROBOT);
        
        let flexContainer = overlay.append('div')
            .style("display", "flex")
            .style("flex-direction", "row")
            .style("align-items", "center")
            .style("justify-content", "center");
    
        // Create a container for the image to control its size explicitly
        let imageContainer = flexContainer.append('div')
            .style("flex", "1") // Take up half the space
            .style("display", "flex")
            .style("align-items", "center")
            .style("justify-content", "center");

        imageContainer.append("img")
            .attr('src', imageURL)
            .style('max-width', '100%')
            .style('height', 'auto'); // Ensure the image is responsive
        
        // let tableContainer = flexContainer.append('div')
        //     .style("flex", "1") // Take up the other half
        //     .style("display", "flex")
        //     .style("flex-direction", "column")
        //     .style("align-items", "center")
        //     .style("justify-content", "center");
        
        // let table = tableContainer.append( 'table' )
        
        // table.style('width', '100%'); // Set table width to 100%
        // table.style('font-size', '12px'); // Set a smaller font size
        // table.selectAll('th, td').style('padding', '8px'); // Decrease padding for cells

        // Info container for Social and Functional on the right side
        let infoContainer = flexContainer.append('div')
            .style("flex", "1")
            .style("display", "flex")
            .style("flex-direction", "column")
            .style("align-items", "center")
            .style("justify-content", "center")
            .style('font-size', 'clamp(10px, 1.5vw, 20px)');

        // Create a table for Social and Functional data
        let table = infoContainer.append('table')
            .style("width", "100%");

        // Table header
        let thead = table.append('thead');
        let headerRow = thead.append('tr');
        headerRow.append('th').text("Social");
        headerRow.append('th').text("");
        headerRow.append('th').text("Functional");
        headerRow.append('th').text("");

        // Table body
        let tbody = table.append('tbody');

        // Insert data rows for Social and Functional
        let firstRow = tbody.append('tr');
        firstRow.append('td').text("Warmth: ");
        firstRow.append('td').text(Math.round(data.WARMTH * 100) / 100);
        firstRow.append('td').text("Perception and Interpretation: ");
        firstRow.append('td').text(Math.round(data.PERCEPTION * 100) / 100);

        let secondRow = tbody.append('tr');
        secondRow.append('td').text("Competence: ");
        secondRow.append('td').text(Math.round(data.COMPETENCE * 100) / 100);
        secondRow.append('td').text("Tactile Interaction and Mobility: ");
        secondRow.append('td').text(Math.round(data.TACTILE_MOBILITY * 100) / 100);


        let thirdRow = tbody.append('tr');
        thirdRow.append('td').text("Discomfort: ");
        thirdRow.append('td').text(Math.round(data.DISCOMFORT * 100) / 100);
        thirdRow.append('td').text("Nonverbal Communication: ");
        thirdRow.append('td').text(Math.round(data.NONVERBAL * 100) / 100);


        // Metaphors section below the table
        let metaphorsSection = overlay.append('div')
            .style("display", "flex")
            .style("flex-direction", "column")
            .style("align-items", "center")
            .style("justify-content", "center")
            .style('font-size', 'clamp(10px, 1.5vw, 20px)')
            .style("margin-top", "20px"); // Adds some space above the Metaphors section

        metaphorsSection.append('div').text("Metaphors")
            .style("font-weight", "bold");

        metaphorsSection.append('div').text(data.METAPHOR1_NAME);
        metaphorsSection.append('div').text(data.METAPHOR2_NAME);
        metaphorsSection.append('div').text(data.METAPHOR3_NAME);

        // row = table.append('tr')
        // // Append a new table row (tr) with two table data (td) cells for 'Warmth' and 'Perception'
        // row.append('td').text("Competence: " + Math.round(data.COMPETENCE * 100) / 100)
        // row.append('td').text("Tactile Interaction and Mobility: " + Math.round(data.TACTILE_MOBILITY * 100) / 100);
        // row.append('td').text(data.METAPHOR2_NAME);

        // row = table.append('tr')
        // // Append a new table row (tr) with two table data (td) cells for 'Warmth' and 'Perception'
        // row.append('td').text("Discomfort: " + Math.round(data.DISCOMFORT * 100) / 100)
        // row.append('td').text("Nonverbal Communication: " + Math.round(data.NONVERBAL * 100) / 100);
        // row.append('td').text(data.METAPHOR3_NAME);
        
        // //hide the tooltip when clicking anywhere in the document, but not on the tool
    });

    //add a little transition if it takes a while to load.
    item.transition().duration(100)
    .style('opacity', 1)
        
})