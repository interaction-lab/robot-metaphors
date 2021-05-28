const width = 600;
const height = 600;
const margin = { top: 20, right: 30, bottom: 30, left: 40 };

const construct2color = {
  ROLE: "#16a085",
  WARMTH: "#27ae60",
  COMPETENCE: "#2980b9",
  DISCOMFORT: "#8e44ad",
  MASCULINE: "#2c3e50",
  FEMININE: "#f39c12",
  LIKEABILITY: "#d35400",
  IDENTIFY: "#c0392b",
  AMBIGUITY: "#2c2c54",
  ATYPICALITY: "#ff5252",
  NONVERBAL: "#ffb142",
  PERCEPTION: "#c56cf0",
  TACTILE_MOBILITY: "#ffb8b8",
};

const tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "svg-tooltip")
  .text("");

const svg = d3
  .select("#tsne_dataviz")

d3.csv("./data/tsne_data/output.csv", d3.autoType).then((robots_csv) => {
  d3.tsv("./data/tsne_data/averaged_social_perception_responses.tsv", d3.autoType).then(
    (social_tsv) => {
      d3.tsv("./data/tsne_data/functional_perception_responses.tsv", d3.autoType).then(
        async (functional_tsv) => {
          let perception_map = new Map();
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
          console.log(perception_map);

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
            image_url: './data/stimuli/' + robots_csv[i]["Robot Name"] + '.PNG',
          }));

          function handleFunctionalButton(e) {
            svg.selectAll("g").remove();
            // let color_scale = d3
            //   .scaleLinear()
            //   .domain(d3.extent(functional_tsv, (d) => d[e.target.name]))
            //   .range([0.1, 1]);
            let color_scale = d3.scaleSequential(t=>d3.interpolateBrBG(1-t))
            .domain(d3.extent(functional_tsv, (d) => d[e.target.name]));

            plot(res, e.target.name, perception_map, color_scale);
          }
          
          function handleSocialButton(e) {
            svg.selectAll("g").remove();
            // let color_scale = d3
            //   .scaleLinear()
            //   .domain(d3.extent(social_tsv, (d) => d[e.target.name]))
            //   .range([0.1, 1]);
            let color_scale = d3.scaleSequential(t=>d3.interpolateBrBG(1-t))
            .domain(d3.extent(social_tsv, (d) => d[e.target.name]));

            plot(res, e.target.name, perception_map, color_scale);
          }

          document
            .querySelectorAll("#social button")
            .forEach((e) => e.addEventListener("click", handleSocialButton));

          document
            .querySelectorAll("#functional button")
            .forEach((e) =>
              e.addEventListener("click", handleFunctionalButton)
            );

          // let color_scale = d3
          //   .scaleLinear()
          //   .domain(d3.extent(functional_tsv, (d) => d.AMBIGUITY))
          //   .range([0.1, 1]);
          let color_scale = d3.scaleSequential(t=>d3.interpolateBrBG(1-t))
          .domain(d3.extent(functional_tsv, (d) => d.AMBIGUITY))
          plot(res, "AMBIGUITY", perception_map, color_scale);
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

  const dot = svg
    .append("g")
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("fill", (d) => {
      // c.opacity = color_scale(perception_map.get(d.name)[construct]);
      // return c;
      return color_scale(perception_map.get(d.name)[construct]);
    })
    .attr("class", "circle")
    .attr("cx", (d) => x(d.x))
    .attr("cy", (d) => y(d.y))
    .attr("r", 8)
    .on("mouseover", function () {
      tooltip.style("visibility", "visible");
    })
    .on("mousemove", function (e, d) {
      tooltip
        .style("top", e.pageY - 10 + "px")
        .style("left", e.pageX + 10 + "px")
        .html(
          `<div>${d.name}<br>${construct}: ${perception_map
            .get(d.name)
            [construct].toPrecision(4)}</div><img src='${d.image_url}'>`
        );

        d3.select(this).style("cursor", "pointer"); 
    })
    .on("mouseout", function () {
      tooltip.style("visibility", "hidden");
    })
    .on("click", function(event, d) {
      updateChart(d['name'])
    });

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

  function zoomed({ transform }) {
    dot.attr("transform", transform);
  }
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
    .json("./data/tsne_data/geo_coordinates.json")
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
