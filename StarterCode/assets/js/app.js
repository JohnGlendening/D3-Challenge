// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right + 20;
var height = svgHeight - margin.top - margin.bottom - 20;
// SVG wrap to hold chart
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

//append
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);