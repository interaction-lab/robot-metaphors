function loadImage(chosen_robot)
{
	var div = document.getElementById("robotImg")
	div.innerHTML = "";

	// Have to remake checkbox and label bc clearing div each time
    var checkbox = document.createElement("input")
    checkbox.type = "checkbox";
    checkbox.id = "zoomCheck"
    var label = document.createElement("label")
    label.setAttribute("for", "zoomCheck")

	imageURL = "/data/stimuli/" + chosen_robot + ".PNG"
    var img = document.createElement("img")
    img.setAttribute("src", imageURL)
    img.className += "img-fluid"
	div.appendChild(checkbox);
	div.appendChild(label);
	label.appendChild(img);
	// document.body.appendChild(div);
}

function wordCloud(chosen_robot)
{
	var div = document.getElementById("wordCloud")
	div.innerHTML = "";

	// Have to remake checkbox and label bc clearing div each time
    var checkbox = document.createElement("input")
    checkbox.type = "checkbox";
    checkbox.id = "zoomCheck2"
    var label = document.createElement("label")
    label.setAttribute("for", "zoomCheck2")

	imageURL = "/data/wordcloud_imgs/" + chosen_robot + ".png"
    var img = document.createElement("img")
    img.setAttribute("src", imageURL)
    img.className += "img-fluid"
	div.appendChild(checkbox);
	div.appendChild(label);
	label.appendChild(img);
	// div.appendChild(img);
	// document.body.appendChild(div);   
}
