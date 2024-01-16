// Load CSV data
d3.csv('311-basic/311_boston_data.csv').then(data => {
    data.forEach(d => {
        d.Count = +d.Count;
    });

    data.sort((a, b) => b.Count - a.Count);

    const top10Data = data.slice(0, 10);

    const svgWidth = 800;
    const svgHeight = 500;
    const margin = { top: 40, right: 40, bottom: 80, left: 200 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const svg = d3.select('#chart_311')
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const yScale = d3.scaleBand()
        .domain(top10Data.map(d => d.reason))
        .range([0, height])
        .padding(0.2);

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(top10Data, d => d.Count)])
        .range([0, width]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip");

    svg.selectAll('rect')
        .data(top10Data)
        .enter()
        .append('rect')
        .attr('x', 0)
        .attr('y', d => yScale(d.reason))
        .attr('width', d => xScale(d.Count))
        .attr('height', yScale.bandwidth())
        .attr('fill', (d, i) => colorScale(i))
        .on('mouseover', function (event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Reason: ${d.reason}<br/>Count: ${d.Count}`)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on('mouseout', function () {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    svg.append('g')
        .call(d3.axisLeft(yScale))
        .attr('color', '#4a4e69');

    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .attr('color', '#4a4e69');

    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + margin.top + 20)
        .attr('text-anchor', 'left')
        .style('font-size', '12px')
        .text('Chart created by Femi Olamijulo. Data source: Boston.gov');
});
