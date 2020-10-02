const incomingData = {
  1: { U: 207, I: 2.5, angle: 20 },
  2: { U: 230, I: 2.5, angle: 10 },
  3: { U: 250, I: 2.5, angle: 10 },
};

const angleU1 = 0;
const angleU2 = 120;
const angleU3 = 240;

const fixedAngles = { 1: angleU1, 2: angleU2, 3: angleU3 };
const colors = { 1: "blue", 2: "green", 3: "red" };

const completeData = [];

for (let key in incomingData) {
  let item = incomingData[key];
  item.fixAngle = fixedAngles[key];
  item.color = colors[key];
  completeData.push(item);
}

/*

completeData = [
    {U: 230.7, I: 2.5, angle: 20, fixAngle: 0, color: "blue"},
    {U: 230.7, I: 2.5, angle: 10, fixAngle: 120, color: "green"},
    {U: 230.7, I: 2.5, angle: 10, fixAngle: 240, color: "red"}
]
 */

const radius = 250;
const strokeCircle = 2;
const strokeLine = 9;
const radiusStroke = radius + strokeCircle;

const widthSvg = radius * 2 + strokeCircle * 2;

const radialAxis = d3
  .scaleLinear()
  .domain([0, /*d3.max(completeData, (d) => d.U)*/ 250])
  .range([0, radius]);

const svgContainer = d3
  .select(".parplot-chart")
  .attr("width", widthSvg)
  .attr("height", widthSvg);

const circle = svgContainer
  .selectAll("circle")
  .data([""])
  .enter()
  .append("circle")
  .attr("r", radius)
  .attr("cx", radiusStroke)
  .attr("cy", radiusStroke)
  .attr("stroke", "#000")
  .attr("stroke-width", strokeCircle)
  .attr("fill", "none");

//find the coordinates of the point based on an angle
function findPoint(cx, cy, rad, cornerGrad) {
  var cornerRad = (cornerGrad * Math.PI) / 180;
  var nx = Math.cos(cornerRad) * rad + cx;
  var ny = Math.sin(cornerRad) * rad + cy;
  return { x: nx, y: ny };
}

var f = findPoint(radiusStroke, radiusStroke, radius, 240);

const fixedLines = svgContainer
  .selectAll(".fixed-line")
  .data(completeData)
  .enter()
  .append("line")
  .classed("fixed-line", true)
  .attr("x1", radiusStroke)
  .attr("y1", radiusStroke)
  .attr("x2", (data) => {
    f = findPoint(radiusStroke, radiusStroke, radius, data.fixAngle);
    return f.x;
  })
  .attr("y2", (data) => {
    f = findPoint(radiusStroke, radiusStroke, radius, data.fixAngle);
    return f.y;
  })
  .attr("stroke", (data) => data.color)
  .attr("stroke-width", strokeLine);

const variableLines = svgContainer
  .selectAll(".variable-line")
  .data(completeData)
  .enter()
  .append("line")
  .classed("variable-line", true)
  .attr("x1", radiusStroke)
  .attr("y1", radiusStroke)
  .attr("x2", (data) => {
    console.log("rad", radialAxis(250));

    const radiusCalculated = radialAxis(data.U);
    f = findPoint(
      radiusStroke,
      radiusStroke,
      radiusCalculated,
      data.fixAngle + data.angle
    );
    return f.x;
  })
  .attr("y2", (data) => {
    const radiusCalculated = radialAxis(data.U);
    f = findPoint(
      radiusStroke,
      radiusStroke,
      radiusCalculated,
      data.fixAngle + data.angle
    );
    return f.y;
  })
  .attr("stroke", (data) => data.color)
  .attr("opacity", 0.5)
  .attr("stroke-width", strokeLine)
  .on("mouseover", (data) => {
    showTooltip(data);
  })
  .on("mouseout", () => hideTooltip());

const showTooltip = (data) => {
  const g = svgContainer
    .selectAll(".tooltip")
    .data([data])
    .enter()
    .append("g")
    .classed("tooltip", true);

  const rect = g
    .append("rect")
    .attr("x", (data) => {
      f = findPoint(
        radiusStroke,
        radiusStroke,
        radius / 2,
        data.angle + data.fixAngle
      );
      return f.x;
    })
    .attr("y", (data) => {
      f = findPoint(
        radiusStroke,
        radiusStroke,
        radius / 2,
        data.angle + data.fixAngle
      );
      return f.y;
    })
    .attr("width", 50)
    .attr("height", 30)
    .attr("fill", "#ececec")
    .attr("rx", 5)
    .attr("ry", 5)
    .attr("stroke", "#d0d0d0")
    .attr("stroke-width", 1);

  const text = g
    .selectAll("text")
    .data([data])
    .enter()
    .append("text")
    .attr("x", (data) => {
      f = findPoint(
        radiusStroke,
        radiusStroke,
        radius / 2,
        data.angle + data.fixAngle
      );
      return f.x;
    })
    .attr("y", (data) => {
      f = findPoint(
        radiusStroke,
        radiusStroke,
        radius / 2,
        data.angle + data.fixAngle
      );
      return f.y;
    })
    .text((data) => data.U)
    .attr("transform", "translate(25, 18)")
    .attr("font-family", "Arial, Helvetica, sans-serif")
    .attr("text-anchor", "middle")
    .attr("font-weight", "500");
};

const hideTooltip = () => {
  svgContainer.selectAll(".tooltip").data([]).exit().remove();
};
