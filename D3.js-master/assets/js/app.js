

// Setting the svg area
var svgWidth = 790;
var svgHeight = 460;

// Area for the chart and blank area around
var chartMargin = {
top: 30,
right: 30,
bottom: 100,
left: 100
};

var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#scatter")
            .append("svg")
            .attr("height", svgHeight)
            .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
                    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

var chosenXAxis = "poverty" || "age" || "income";
var chosenYAxis = "obesity" || "smokes" || "healthcare";

function xScale(data, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
                         .domain([d3.min(data, d => d[chosenXAxis]) * 0.9, d3.max(data, d => d[chosenXAxis]) * 1.1])
                         .range([0, chartWidth]);
    return xLinearScale;
}

function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
         .duration(1000)
         .call(bottomAxis);
    return xAxis;
}

function yScale(data, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
                         .domain([d3.min(data, d => d[chosenYAxis]) * 0.65,d3.max(data, d => d[chosenYAxis]) * 1.05])
                         .range([chartHeight, 0]);
    return yLinearScale;
}

function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
         .duration(1000)
         .call(leftAxis);
    return yAxis;
}

// Load the CSV Data
d3.csv("data.csv").then(function(data) { 
    console.log(data);
    data.forEach(function(d) {
        d.age = +d.age;
        d.healthcare = +d.healthcare;
        d.obesity = +d.obesity;
        d.poverty = +d.poverty;
        d.smokes = +d.smokes;
        d.income = +d.income;
    });
    var h = data.map(d=> d.healthcare);
    console.log(h.sort(function(a, b){return a - b}));
  
    var xLinearScale = xScale(data, chosenXAxis);
    var yLinearScale = yScale(data, chosenYAxis);
  
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
  
    var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);
  
    var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
                          .data(data)
                          .enter()
                          .append("circle")
                          .attr("cx", d => xLinearScale(d[chosenXAxis]))
                          .attr("cy",  d => yLinearScale(d[chosenYAxis]))
                          .attr("r",function(d) {
                                  return Math.pow(d.income/5000,1.2);
                                })
                          .style("opacity", 0.5)
                          .style("fill", function(d) {
                                  if (d.healthcare < 10 ) { return "#b3ffe0"; }
                                  if (10 <= d.healthcare && d.healthcare <= 12.5 ) { return "#99c2ff"; }
                                  if (12.5 < d.healthcare && d.healthcare <= 14.8 ) { return "#ffdd99"; }
                                  if (14.8 < d.healthcare && d.healthcare<= 26 ) { return "#ff9999"; }
                                })
                          .style("stroke", "grey");
                          
    var xlabelsGroup = chartGroup.append("g");
    var ylabelsGroup = chartGroup.append("g");

    var povertyLabel = xlabelsGroup.append("text")
                                .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top +10})`)
                                .attr("text-anchor", "middle")
                                .attr("font-size", "16px")
                                .attr("fill", "black")
                                .attr("value", "poverty") 
                                .classed("active", true)
                                .text("In Poverty (%)");
                    
    var healthcareLabel = ylabelsGroup.append("text")
                                .text("Lacks Healthcare (%)")
                                .attr("y", 0 - chartMargin.left + 40)
                                .attr("x", 0 - (chartHeight / 2))
                                .attr("dy", "1em")
                                .attr("class", "axisText")
                                .attr("transform", "rotate(-90)")
                                .attr("value", "healthcare") 
                                .classed("active", true)
                                .style("text-anchor", "middle"); 


  });
