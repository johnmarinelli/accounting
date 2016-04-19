let buildChart = () => {
  const outBinding = new Shiny.OutputBinding();
  
  const updateView = (d) => {
    d3.select('.barplot svg')
      .remove();

    const amounts = d['Amount'],
      categories = d['Category'],
      minAmt = Math.min.apply(Math, amounts),
      maxAmt = Math.max.apply(Math, amounts),
      margin = { top: 20, right: 30, bottom: 30, left: 100 },
      width = 1368 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;
    
    let y = d3.scale.linear()
              .domain([0, maxAmt])
              .range([height, 0]),
      x = d3.scale.ordinal()
            .domain(categories)
            .rangeRoundBands([0, width], 0.1),

      chart = d3.select('.barplot')
                .attr('width', width)
                .attr('height', height)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')'),

      barWidth = width / categories.length,

      xAxis = d3.svg.axis()
                .scale(x)
                .orient('bottom'),

      yAxis = d3.svg.axis()
                .scale(y)
                .orient('left'),

      tip = d3.tip()
              .attr('class', 'category-label')
              .offset([-10, 0]).html((d) => `You've spent ${d.amount} on ${d.category}`),

      svg = d3.select('.barplot').append('svg')
              .attr('width', width + margin.left + margin.right)
              .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    let normData = [];
    Array.prototype.forEach.call(categories, (e, i) => {
      normData.push({ category: e, amount: amounts[i] })
    })

    svg.append('g')
       .attr('class', 'x-axis-label')
       .attr('transform', 'translate(0,' + height + ')')
       .call(xAxis);

    svg.append('g')
       .attr('class', 'y axis')
       .call(yAxis)
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text('Amount');

    svg.selectAll('.bar')
      .data(normData)
      .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', (d) => x(d.category) )
        .attr('width', x.rangeBand())
        .attr('y', (d) => y(d.amount) )
        .attr('height', (d) => height - y(d.amount))
        .attr('fill', (d) => d3.rgb('red'))
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    svg.call(tip)
  };
  
  let d3OutputBinding = new Shiny.OutputBinding();

  $.extend(d3OutputBinding, {
    find: (scope) => $(scope).find('.barplot'),
    renderError: (el,error) => console.log(error),
    renderValue: (el,data) => updateView(data)
  });

  Shiny.outputBindings.register(d3OutputBinding);
}

export { buildChart }
