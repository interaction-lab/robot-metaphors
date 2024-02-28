const svg = d3
  .select("#discover-viz")

  //TODO: make these not magic numbers
const width = 1000 // document.getElementById("discover-viz").clientWidth
const height = 600 // document.getElementById("discover-viz").clientHeight

// console.log(width,height)

const margin = { top: 30, right: 80, bottom: 30, left: 40 };

const tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "svg-tooltip")
  .text("");


d3.csv("/robot-metaphors/assets/data/tsne_data/output.csv", d3.autoType).then((robots_csv) => {
  d3.tsv("/robot-metaphors/assets/data/tsne_data/averaged_social_perception_responses.tsv", d3.autoType).then(
    (social_tsv) => {
      d3.tsv("/robot-metaphors/assets/data/tsne_data/functional_perception_responses.tsv", d3.autoType).then(
        async (functional_tsv) => {
            
          var perception_map = new Map();
          social_tsv.forEach((row) => {
            perception_map.set(row.ROBOT, row);
          });

          functional_tsv.forEach((row) => {
            if (perception_map.has(row.ROBOT)) {
              perception_map.set(row.ROBOT, {
                ...perception_map.get(row.ROBOT),
                ...row,
              });
            } else {
              perception_map.set(row.ROBOT, row);
            }
          });
        //   console.log(perception_map);

          const coordinates = await getNormCoordinates(robots_csv);
          const X = coordinates.map((coordinate, i) => [
            ...coordinate,
            getNormalized(robots_csv, "Height (cm)")[i],
            getNormalized(robots_csv, "Year")[i],
            ...getNormColors(robots_csv)[i],
            robots_csv[i]["Mechanical Embodiment?"],
            robots_csv[i]["Zoomorphic Embodiment?"],
            robots_csv[i]["Humanoid Embodiment?"],
            robots_csv[i]["Can Move? (moving from A to B)"],
            getNormalized(robots_csv, "number of wheels")[i],
            robots_csv[i]["Screen Face?"],
            robots_csv[i]["Static Face?"],
            robots_csv[i]["Mechanical Face?"],
            getNormalized(robots_csv, "number of legs")[i],
            getNormalized(robots_csv, "number of arms")[i],
            getNormalized(robots_csv, "number of eyes")[i],
            robots_csv[i]["Matte Body?"],
            robots_csv[i]["Mouth?"],
            robots_csv[i]["Nose?"],
            robots_csv[i]["Eyebrows?"],
            robots_csv[i]["Cheeks/blush?"],
            robots_csv[i]["Hair Follicles?"],
            robots_csv[i]["Mechanical Hair?"],
            robots_csv[i]["Furry?"],
            robots_csv[i]["Ears?"],
            robots_csv[i]["Eyelids?"],
            robots_csv[i]["Pupils?"],
            robots_csv[i]["Irises?"],
            robots_csv[i]["Eyelashes?"],
            robots_csv[i]["Lips?"],
            robots_csv[i]["mechanical spline lips?"],
            robots_csv[i]["symmetric embodiment?"],
            robots_csv[i]["Exposed Wires?"],
          ]);

          const solution = getTSNESolution(X);

          const res = solution.map((points, i) => ({
            name: robots_csv[i]["Robot Name"],
            x: points[0],
            y: points[1],
            image_url: '/robot-metaphors/assets/data/stimuli/' + robots_csv[i]["Robot Name"] + '.PNG',
          }));

          function handleConstructChange(e) {
            svg.selectAll("g").remove();
            let color_scale = d3.scaleSequential(t=>d3.interpolateViridis(t))

            if(functional_tsv.columns.includes(this.id)){
                
                color_scale.domain(d3.extent(functional_tsv, (d) => d[this.id]));
            } else {
                color_scale.domain(d3.extent(social_tsv, (d) => d[this.id]));
            }

            plot(res, this.id, perception_map, color_scale);

            
          }

          document
            .getElementsByName("construct")
            .forEach((e) =>
              e.addEventListener("click", handleConstructChange)
            );

          let color_scale = d3.scaleSequential(t=>d3.interpolateViridis(t))
          .domain(d3.extent(social_tsv, (d) => d.WARMTH))

          plot(res, "WARMTH", perception_map, color_scale);
        }
      );
    }
  );
});



function plot(data, construct, perception_map, color_scale) {
  const x = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.x))
    .range([margin.left, width - margin.right]);

  const y = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.y))
    .range([height - margin.bottom, margin.top]);

  // let c = d3.color(construct2color[construct]);

  const dot = svg.selectAll("circle")
    .data(data).enter()
    .append("g")

    dot.append('text')
    .attr("x", (d) => x(d.x) + 3 + 6)
    .attr("y", (d) => y(d.y) + 3 + 3)
    .text((d) => d.name)
    .style("font-size", "10px")

    dot.append("circle")
    .attr("class", "circle")
    .attr("fill", (d) => {
      return color_scale(perception_map.get(d.name)[construct]);
    })
    
    .attr("cx", (d) => x(d.x))
    .attr("cy", (d) => y(d.y))
    .attr("r", 6)

    
    
    


    .on("mouseover", function () {
      tooltip.style("visibility", "visible");
    })
    .on("mousemove", function (e, d) {

      tooltipWidth = tooltip.node().offsetWidth;
      tooltipHeight = tooltip.node().offsetHeight;
      mouseX = e.pageX;
      mouseY = e.pageY;

      // Adjust X position if tooltip exceeds right boundary
      let tooltipX = mouseX + 10; // Offset from mouse cursor
      if (mouseX > window.innerWidth / 2) {
        tooltipX = mouseX - tooltipWidth - 10; // Adjust to fit within viewport
      }

      // Adjust Y position if tooltip exceeds bottom boundary
      let tooltipY = mouseY + 10; // Offset from mouse cursor
      if (mouseY > window.innerHeight / 2) {
        tooltipY = mouseY - tooltipHeight - 10; // Adjust to fit within viewport
      }

      tooltip.style("left", tooltipX + "px")
         .style("top", tooltipY + "px")
        .html(
          `<div>${d.name}<br>${construct}: ${perception_map
            .get(d.name)[construct].toPrecision(4)}</div><img src='${d.image_url}'>`
        );

        d3.select(this).style("cursor", "pointer"); 
    })
    .on("mouseout", function () {
      tooltip.style("visibility", "hidden");
    })
    .on("click", function(event, d) {
      updateChart(d['name'])
    });
    
    
    function zoomed({ transform }) {
        dot.attr("transform", transform);
      }

    svg.call(
    d3
        .zoom()
        .extent([
        [0, 0],
        [width, height],
        ])
        .scaleExtent([0.8, 8])
        .on("zoom", zoomed)
    );

    Legend(color_scale, {title: 'Average user ratings', width:width})
    
    // document.getElementsByName('discover-viz-conatiner').append(legend)
}



  

function getTSNESolution(data) {
  let model = new tsnejs.tSNE({
    dim: 2,
    perplexity: 22,
  });
  model.initDataRaw(data);

  let cost = 100,
    cost0 = 0;
  while (Math.abs(cost - cost0) > 1e-6) {
    cost = cost0;
    cost0 = cost * 0.9 + 0.1 * model.step();
  }
  return model.getSolution();
}

const GeoToNormalizedCartesian = (coordinates) => {
  let theta = (coordinates.latitude / 180) * Math.PI;
  let phi = (coordinates.longitude / 180) * Math.PI;
  return [
    Math.sin(phi) * Math.cos(theta),
    Math.sin(phi) * Math.sin(theta),
    Math.cos(theta),
  ];
};

function getNormCoordinates(robots_csv) {
  return d3
    .json("/robot-metaphors/assets/data/tsne_data/geo_coordinates.json")
    .then((data) =>
      robots_csv.map((robot) =>
        GeoToNormalizedCartesian(data[robot["Country of Origin"]])
      )
    );
}

function getNormColors(robots_csv) {
  let colors = robots_csv.map((robot) => {
    let color = d3.hsl(robot["Most Prominent Color"].split(",")[0]);
    if (isNaN(color.h)) color.h = 0;
    if (isNaN(color.s)) color.s = 0;
    if (isNaN(color.l)) color.l = 0;
    color.h /= 360;
    return [color.h, color.s, color.l];
  });
  return colors;
}

function getNormalized(robots_csv, feature) {
  let col = robots_csv.map((robot) => robot[feature]);
  let extent = d3.extent(col);
  for (let i = 0; i < col.length; i++) {
    col[i] = (col[i] - extent[0]) / (extent[1] - extent[0]);
  }
  return col;
}

// Copyright 2021, Observable Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/color-legend
function Legend(color, {
    title,
    tickSize = 6,
    width = 320, 
    height = 44 + tickSize,
    marginTop = 18,
    marginRight = 0,
    marginBottom = 16 + tickSize,
    marginLeft = 0,
    ticks = width / 64,
    tickFormat,
    tickValues
  } = {}) {
  
    function ramp(color, n = 256) {
      const canvas = document.createElement("canvas");
      canvas.width = n;
      canvas.height = 1;
      const context = canvas.getContext("2d");
      for (let i = 0; i < n; ++i) {
        context.fillStyle = color(i / (n - 1));
        context.fillRect(i, 0, 1, 1);
      }
      return canvas;
    }
  
    const svg = d3.select("#discover-viz-legend")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .style("overflow", "visible")
        .style("display", "block");

    //clear old values
    svg.selectAll("*").remove();
  
    let tickAdjust = g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);
    let x;
  
    // Continuous
    if (color.interpolate) {
      const n = Math.min(color.domain().length, color.range().length);
  
      x = color.copy().rangeRound(d3.quantize(d3.interpolate(marginLeft, width - marginRight), n));
  
      svg.append("image")
          .attr("x", marginLeft)
          .attr("y", marginTop)
          .attr("width", width - marginLeft - marginRight)
          .attr("height", height - marginTop - marginBottom)
          .attr("preserveAspectRatio", "none")
          .attr("xlink:href", ramp(color.copy().domain(d3.quantize(d3.interpolate(0, 1), n))).toDataURL());
    }
  
    // Sequential
    else if (color.interpolator) {
      x = Object.assign(color.copy()
          .interpolator(d3.interpolateRound(marginLeft, width - marginRight)),
          {range() { return [marginLeft, width - marginRight]; }});
  
      svg.append("image")
          .attr("x", marginLeft)
          .attr("y", marginTop)
          .attr("width", width - marginLeft - marginRight)
          .attr("height", height - marginTop - marginBottom)
          .attr("preserveAspectRatio", "none")
          .attr("xlink:href", ramp(color.interpolator()).toDataURL());
  
      // scaleSequentialQuantile doesn’t implement ticks or tickFormat.
      if (!x.ticks) {
        if (tickValues === undefined) {
          const n = Math.round(ticks + 1);
          tickValues = d3.range(n).map(i => d3.quantile(color.domain(), i / (n - 1)));
        }
        if (typeof tickFormat !== "function") {
          tickFormat = d3.format(tickFormat === undefined ? ",f" : tickFormat);
        }
      }
    }
  
    // Threshold
    else if (color.invertExtent) {
      const thresholds
          = color.thresholds ? color.thresholds() // scaleQuantize
          : color.quantiles ? color.quantiles() // scaleQuantile
          : color.domain(); // scaleThreshold
  
      const thresholdFormat
          = tickFormat === undefined ? d => d
          : typeof tickFormat === "string" ? d3.format(tickFormat)
          : tickFormat;
  
      x = d3.scaleLinear()
          .domain([-1, color.range().length - 1])
          .rangeRound([marginLeft, width - marginRight]);
  
      svg.append("g")
        .selectAll("rect")
        .data(color.range())
        .join("rect")
          .attr("x", (d, i) => x(i - 1))
          .attr("y", marginTop)
          .attr("width", (d, i) => x(i) - x(i - 1))
          .attr("height", height - marginTop - marginBottom)
          .attr("fill", d => d);
  
      tickValues = d3.range(thresholds.length);
      tickFormat = i => thresholdFormat(thresholds[i], i);
    }
  
    // Ordinal
    else {
      x = d3.scaleBand()
          .domain(color.domain())
          .rangeRound([marginLeft, width - marginRight]);
  
      svg.append("g")
        .selectAll("rect")
        .data(color.domain())
        .join("rect")
          .attr("x", x)
          .attr("y", marginTop)
          .attr("width", Math.max(0, x.bandwidth() - 1))
          .attr("height", height - marginTop - marginBottom)
          .attr("fill", color);
  
      tickAdjust = () => {};
    }
  
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x)
          .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
          .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
          .tickSize(tickSize)
          .tickValues(tickValues))
        .call(tickAdjust)
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
          .attr("x", marginLeft)
          .attr("y", marginTop + marginBottom - height - 6)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .attr("class", "title")
          .text(title));
  
    return svg.node();
  }