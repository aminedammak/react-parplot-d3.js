const incomingData = [
  { U: 230.7, I: 2.5, angle: 20, color: "blue" },
  { U: 230.7, I: 2.5, angle: 130, color: "green" },
  { U: 230.7, I: 2.5, angle: 250, color: "red" },
];

const fixAngles = [
  { angle: 0, color: "blue" },
  { angle: 120, color: "green" },
  { angle: 240, color: "red" },
];

const radius = 200;
const strokeCircle = 2;
const strokeLine = 6;
const radiusStroke = radius + strokeCircle;

const widthSvg = radius * 2 + strokeCircle * 2;

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
  .data(fixAngles)
  .enter()
  .append("line")
  .classed("fixed-line", true)
  .attr("x1", radiusStroke)
  .attr("y1", radiusStroke)
  .attr("x2", (data) => {
    f = findPoint(radiusStroke, radiusStroke, radius, data.angle);
    return f.x;
  })
  .attr("y2", (data) => {
    f = findPoint(radiusStroke, radiusStroke, radius, data.angle);
    return f.y;
  })
  .attr("stroke", (data) => data.color)
  .attr("stroke-width", strokeLine);

const variableLines = svgContainer
  .selectAll(".variable-line")
  .data(incomingData)
  .enter()
  .append("line")
  .classed("variable-line", true)
  .attr("x1", radiusStroke)
  .attr("y1", radiusStroke)
  .attr("x2", (data) => {
    f = findPoint(radiusStroke, radiusStroke, radius - 20, data.angle);
    return f.x;
  })
  .attr("y2", (data) => {
    f = findPoint(radiusStroke, radiusStroke, radius - 20, data.angle);
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
  console.log("showTooltip", data);

  //insert the new one
  const g = svgContainer
    .selectAll(".tooltip")
    .data([data])
    .enter()
    .append("g")
    .classed("tooltip", true);

  const rect = g
    .append("rect")
    .attr("x", (data) => {
      f = findPoint(radiusStroke, radiusStroke, radius / 2, data.angle);
      return f.x;
    })
    .attr("y", (data) => {
      f = findPoint(radiusStroke, radiusStroke, radius / 2, data.angle);
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
      f = findPoint(radiusStroke, radiusStroke, radius / 2, data.angle);
      return f.x;
    })
    .attr("y", (data) => {
      f = findPoint(radiusStroke, radiusStroke, radius / 2, data.angle);
      return f.y;
    })
    .text((data) => data.angle)
    .attr("transform", "translate(25, 18)")
    .attr("font-family", "Arial, Helvetica, sans-serif")
    .attr("text-anchor", "middle")
    .attr("font-weight", "500");
};

const hideTooltip = () => {
  svgContainer.selectAll(".tooltip").data([]).exit().remove();
};
