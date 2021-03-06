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
// SVG wrap 
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// append
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
// parameters
var chosenXAxis = "smokes";
var chosenYAxis = "age";

// functions to update x and y upon click
function xScale(censusData, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenXAxis]) * .5,
            d3.max(censusData, d => d[chosenXAxis]) * 1.3
        ])
        .range([0, width]);

    return xLinearScale;
}

function yScale(censusData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.9,
            d3.max(censusData, d => d[chosenYAxis]) * 1.2
        ])
        .range([height, 0]);

    return yLinearScale;

}

function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}
// functions to update circles 
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));

    return circlesGroup;
}

function renderYCircles(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
}

function renderXCircleText(textCircles, newXScale, chosenXAxis) {

    textCircles.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]));

    return textCircles;
}

function renderYCircleText(textCircles, newYScale, chosenYAxis) {

    textCircles.transition()
        .duration(1000)
        .attr("y", d => newYScale(d[chosenYAxis]) + 4);

    return textCircles;
}
// extra functions.
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    var xlabel;
    var ylabel;

    if (chosenXAxis === "smokes") {
        xlabel = "Smokers:"
    } else if (chosenXAxis === "healthcare") {
        xlabel = "No Healthcare:"
    } else {
        xlabel = "Obese:";
    }


    if (chosenYAxis === "age") {
        ylabel = "Age:"
    } else if (chosenYAxis === "income") {
        ylabel = "Income:"
    } else {
        ylabel = "Poverty:"
    }
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([40, 60])
        .html(function(d) {
            return (`<strong>${d.state}</strong>
              <br>${xlabel} ${d[chosenXAxis]}
              <br>${ylabel} ${d[chosenYAxis]}`);
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
            toolTip.show(data);
        })
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

    return circlesGroup;
}
(async function() {
    var censusData = await d3.csv("assets/data/data.csv").catch(err => console.log(err))

    // Parse data
    censusData.forEach(function(data) {
        data.id = +data.id;
        data.poverty = +data.poverty;
        data.povertyMoe = +data.povertyMoe;
        data.age = +data.age;
        data.ageMoe = +data.ageMoe;
        data.income = +data.income;
        data.incomeMoe = +data.incomeMoe;
        data.healthcare = +data.healthcare;
        data.healthcareLow = +data.healthcareLow;
        data.healthcareHigh = +data.healthcareHigh;
        data.obesity = +data.obesity;
        data.obesityLow = +data.obesityLow;
        data.obesityHigh = +data.obesityHigh;
        data.smokes = +data.smokes;
        data.smokesLow = +data.smokesLow;
        data.smokesHigh = +data.smokesHigh;
    });

    var xLinearScale = xScale(censusData, chosenXAxis);

    var yLinearScale = yScale(censusData, chosenYAxis);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    var circlesGroup = chartGroup.append("g")
        .selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 11)
        .attr("fill", "green")
        .attr("opacity", ".6");
    var textCircles = chartGroup.append("g")
        .selectAll("text")
        .data(censusData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]) + 4)
        .attr("font-family", "sans-serif")
        .attr("text-anchor", "middle")
        .attr("font-size", "11px")
        .style("fill", "white")
        .attr("font-weight", "bold");

    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 30})`);

    var smokesLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "smokes")
        .classed("active", true)
        .text("Smokers (%)");

    var healthcareLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "healthcare")
        .classed("inactive", true)
        .text("Lacks Healthcare (%)");

    var obesityLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "obesity")
        .classed("inactive", true)
        .text("Obesity (%)");

    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)");

    var ageLabel = yLabelsGroup.append("text")
        .attr("y", 0 - margin.left + 15)
        .attr("x", 0 - (height / 2))
        .attr("value", "age")
        .classed("active", true)
        .text("Age (Median)");

    var incomeLabel = yLabelsGroup.append("text")
        .attr("y", 0 - margin.left + 35)
        .attr("x", 0 - (height / 2))
        .attr("value", "income")
        .classed("inactive", true)
        .text("Houshold Income (Median)");

    var povertyLabel = yLabelsGroup.append("text")
        .attr("y", 0 - margin.left + 55)
        .attr("x", 0 - (height / 2))
        .attr("value", "poverty")
        .classed("inactive", true)
        .text("Poverty (%)");

    // updateToolTip 
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    xLabelsGroup.selectAll("text")
        .on("click", function() {
            var xValue = d3.select(this).attr("value");
            if (xValue !== chosenXAxis) {

                chosenXAxis = xValue;

                // updates x scale 
                xLinearScale = xScale(censusData, chosenXAxis);

                // updates x axis 
                xAxis = renderXAxes(xLinearScale, xAxis);

                // updates circles
                circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);
                textCircles = renderXCircleText(textCircles, xLinearScale, chosenXAxis);

                // updates tooltips 
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                if (chosenXAxis === "obesity") {
                    obesityLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else if (chosenXAxis === "healthcare") {
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                } else {
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
            }
        });

    // y axis labels 
    yLabelsGroup.selectAll("text")
        .on("click", function() {
            var yValue = d3.select(this).attr("value");
            if (yValue !== chosenYAxis) {

                chosenYAxis = yValue;

                // updates x scale 
                yLinearScale = yScale(censusData, chosenYAxis);

                yAxis = renderYAxes(yLinearScale, yAxis);

                circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);
                textCircles = renderYCircleText(textCircles, yLinearScale, chosenYAxis);

                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                if (chosenYAxis === "income") {
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else if (chosenYAxis === "poverty") {
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                } else {
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
            }
        });
})()