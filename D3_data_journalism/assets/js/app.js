var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80, //60
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(healthCareData) {
    var count = 0;
    console.log("States:")

    healthCareData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        console.log(data.abbr);
        count ++;
    });

    console.log(`Number Of States: ${count}`) 
    // Create scale functions 
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthCareData, hcd => hcd.poverty) - 1, d3.max(healthCareData, hcd => hcd.poverty) + 2])
        .range([0, width]);
    
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(healthCareData, hcd => hcd.healthcare) - .5, d3.max(healthCareData, hcd => hcd.healthcare) + 3])
        .range([height, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    console.log("Creating Scatter Plot")

    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthCareData)
    .enter()
    .append("circle")
    .attr("cx", hcd => xLinearScale(hcd.poverty))
    .attr("cy", hcd => yLinearScale(hcd.healthcare))
    .attr("r", "10")
    .attr("fill","lightblue")
    .attr("opacity", "5");

    var textGroup = chartGroup.selectAll(null)
    .data(healthCareData)
    .enter()
    .append("text")
    .text(hcd => hcd.abbr)
    .attr("x", hcd => xLinearScale(hcd.poverty) - 7)
    .attr("y", hcd => yLinearScale(hcd.healthcare) + 3)
    .style("font-size", "10px")
    .attr("fill","white");

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .attr("id", "firstYLabel")
        .text("Lacks Healthcare(%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .attr("id", "firstXLabel")
        .text("In Poverty(%)")

}).catch(function(error) {
    console.log(error);
})
