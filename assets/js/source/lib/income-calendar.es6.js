let buildCalendar = (DateFunctions) => {
  let d3OutputBinding = new Shiny.OutputBinding();

  const placeSpendingInBuckets = (d) => {
    let daysInMonth = DateFunctions.daysInMonth(new Date());
    let buckets = ((data, monthlyIncome) => {
      return Array.prototype.map.call(data.Categories, (e, i) => {
        return {
          category: e,
          days: (+((data.Amounts[i] / monthlyIncome) * daysInMonth).toFixed(2))
        };
      });
    }).call(this, d, 7500);

    let dayBoxes = [];

    for (let i = 0; i < buckets.length; ++i) {
      let bucket = buckets[i],
        bucketDays = bucket.days,
        bucketDayBoxes = [];
      let lastDayBox = dayBoxes[dayBoxes.length - 1];

      // the last day still has empty space
      if (lastDayBox && lastDayBox.total < 100.00) {
        let bucketDays = bucket.days,
            totalDays = (lastDayBox.total / 100.00) + bucketDays,
            over1 = totalDays > 1.00;

        if (over1) {
          let distanceFrom100Percent = Math.abs(100.00 - lastDayBox.total),
              leftoverBucketDays = Math.abs(bucketDays - (distanceFrom100Percent / 100));

          dayBoxes[dayBoxes.length - 1].spending.push({
            category: bucket.category,
            percentage: distanceFrom100Percent
          });
          dayBoxes[dayBoxes.length - 1].total = 100.00;

          // insert the rest of it
          for (let dayInc = lastDayBox.day; dayInc < lastDayBox.day + Math.floor(leftoverBucketDays); ++dayInc) {
            bucketDayBoxes.push({ 
              day: dayInc, 
              spending: [
                { category: bucket.category, percentage: 100.00 }
              ],
              total: 100.00
            });
          }
        }
        else {
          dayBoxes[dayBoxes.length - 1].spending.push({
            category: bucket.category,
            percentage: bucket.days
          });
          dayBoxes[dayBoxes.length - 1].total += bucket.days;
        }
      }

      // the last day is full or we're just starting
      else {
        let lastDay = dayBoxes.length === 0 ? 0 : dayBoxes[dayBoxes.length - 1].day,
            dayInc = lastDay + 1,
            totalDays = bucket.days,
            wholeDays = Math.floor(totalDays);
        
        for (; dayInc < lastDay + wholeDays; ++dayInc) {
          bucketDayBoxes.push({ 
            day: dayInc, 
            spending: [
              { category: bucket.category, percentage: 100.00 }
            ],
            total: 100.00
          });
        }

        let leftover = (totalDays - wholeDays) * 100;
        bucketDayBoxes.push({
          day: dayInc,
          spending: [
            { category: bucket.category, percentage: +(leftover.toFixed(2)) }
          ],
          total: leftover 
        });
      }
      dayBoxes = Array.prototype.concat.call(dayBoxes, bucketDayBoxes);
    }
    
    return dayBoxes;
  };

  const attachDatesToBuckets = (dayBoxes) => {
    let monthDates = DateFunctions.getDaysInMonth(new Date().getMonth());
    return Array.prototype.map.call(monthDates, (e, i) => {
      let newDayBox = { date: e };
      if (DateFunctions.isWorkday(e) && dayBoxes.length > 0) {
        let dayBox = dayBoxes.shift();
        newDayBox = $.extend(dayBox, newDayBox);
      }
      return newDayBox;
    }).filter((e) => e !== undefined);
  };

  const expandBucketsToRects = (d) => {
    let rects = [],
        xitr = dayBoxWidth * d[0].date.getDay(), 
        yitr = 0;

    // each bucket
    Array.prototype.forEach.call(d, (bucket, i) => {
      let subrects = [],
        xIncAmount;

      yitr = dayBoxHeight * DateFunctions.getWeekOfMonth(bucket.date);

      if (bucket.spending) {
        // each spending area
        subrects = Array.prototype.map.call(bucket.spending, (spendingArea, j) => {
          xIncAmount = (spendingArea.percentage / 100) * dayBoxWidth;
          let r = {
            x: xitr,
            y: yitr,
            width: xIncAmount,
            height: dayBoxHeight,
            category: spendingArea.category
          };
          xitr = Math.ceil(xitr + xIncAmount) >= calendarWidth ? 0 : xitr + xIncAmount;

          return r;
        });
      }
      else {
        let nextXInc = dayBoxWidth * (Math.ceil(xitr / dayBoxWidth)),
          lastRect = rects[rects.length - 1];

        // if previous rect isn't full
        if (lastRect !== undefined && lastRect.width < dayBoxWidth && +((lastRect.x + lastRect.width) % dayBoxWidth).toFixed(2) !== 0) {
          let diff = nextXInc - (lastRect.x + lastRect.width);

          // fill the remaining space of previous rect
          subrects.push({
            x: xitr,
            y: yitr,
            width: diff,
            height: dayBoxHeight,
            color: 'gray',
            category: 'None'
          });
          xitr = xitr + diff;
        }

        subrects.push({
          x: xitr,
          y: yitr,
          width: dayBoxWidth,
          height: dayBoxHeight,
          color: 'gray',
          category: 'None'
        });

        xitr = Math.round(xitr + dayBoxWidth) >= calendarWidth ? 0 : xitr + dayBoxWidth;
      }

      rects = rects.concat(subrects);
    });

    return rects;
  };

  const transformData = (d) => {
    console.log(d);
    let dayBoxes = placeSpendingInBuckets(d);
    dayBoxes = attachDatesToBuckets(dayBoxes);
    dayBoxes = expandBucketsToRects(dayBoxes);
    return dayBoxes;
  };
  
  const updateView = (d) => {
    d3.select('.incomeCalendar svg')
      .remove();
    let dayBoxes = transformData(d);
    let categoryToIndex = {};
    Array.prototype.forEach.call(d.Categories, (e, i) => categoryToIndex[e] = i);

    const BOX_COLORS = [ "#AF4B56", "#66D02F", "#CE6CDD", "#399D29", "#DC449D", "#5DCE67", "#DE3573", "#91BE43", "#6B77D9", "#E6AC30", "#5BA1D8", "#DD422E", "#49C8D2", "#D83951", "#4FC189", "#B159A5", "#B5B634", "#9F92D8", "#55882C", "#DB95D5", "#747627", "#896094", "#DD7129", "#556F9A", "#BC8730", "#2C8688", "#E4725E", "#3D844F", "#CD668B", "#A1592D"]

    let svg = d3.select('.incomeCalendar').append('svg')
                .attr('width', calendarWidth)
                .attr('height', height)
                .append('g'),
        colors = d3.scale.linear()
                   .domain(d.Categories.map((e,i) => i))
                   .range(BOX_COLORS),
        tip = d3.tip()
                .attr('class', 'calendar-category-label')
                .offset([50, 0]).html((d) => d.category);

    svg.call(tip);

    svg.selectAll('.daybox')
      .data(dayBoxes)
      .enter().append('rect')
        .attr('class', 'daybox')
        .attr('x', (d) => d.x)
        .attr('width', (d) => d.width)
        .attr('y', (d) => d.y)
        .attr('height', (d) => d.height)
        .attr('fill', (d) => colors(categoryToIndex[d.category]))
        .style('stroke', 'black')
        .style('stroke-width', 1)
        .on('mouseover', tip.show);

    svg.selectAll('text')
       .data(dayBoxes)
       .attr('x', (d) => d.x + d.width / 2)

  };

  let margin = { top: 20, right: 30, bottom: 30, left: 50 },
    calendarWidth = $(window).width() - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom,
    dayBoxWidth = calendarWidth / 7,
    dayBoxHeight = dayBoxWidth;

  $.extend(d3OutputBinding, {
    find: (scope) => $(scope).find('.incomeCalendar'),
    renderError: (el, error) => console.log(error),
    renderValue: (el, data) => updateView(data)
  });

  Shiny.outputBindings.register(d3OutputBinding);
}

export { buildCalendar }
