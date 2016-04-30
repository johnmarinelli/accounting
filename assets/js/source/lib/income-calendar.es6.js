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

  //const attachCoordinatesToBuckets = (dayBoxes, w, h) => {
  //  return Array.prototype.map.call(dayBoxes, (e, i) => 
  //    $.extend(e, { x: w * e.date.getDay(), y: h * DateFunctions.getWeekOfMonth(e.date) })
  //  );
  //};

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
            color: BOX_COLORS[spendingArea.category],
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
        if (lastRect.width < dayBoxWidth && +((lastRect.x + lastRect.width) % dayBoxWidth).toFixed(2) !== 0) {
          let diff = dayBoxWidth - lastRect.width;
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
        console.log('nextXInc: ' + nextXInc);

        subrects.push({
          x: nextXInc,
          y: yitr,
          width: dayBoxWidth,
          height: dayBoxHeight,
          color: 'gray',
          category: 'None'
        });

        xitr = nextXInc >= calendarWidth ? 0 : nextXInc;
      }
      console.log(xitr);

      rects = rects.concat(subrects);
    });

    return rects;
  };

  const transformData = (d) => {
    let dayBoxes = placeSpendingInBuckets(d);
    dayBoxes = attachDatesToBuckets(dayBoxes);
    console.log(dayBoxes);
    dayBoxes = expandBucketsToRects(dayBoxes);
    return dayBoxes;
  };
  
  const updateView = (d) => {
    d3.select('.incomeCalendar svg')
      .remove();
    let dayBoxes = transformData(d);

    console.log(dayBoxes);

    let svg = d3.select('.incomeCalendar').append('svg')
                .attr('width', calendarWidth)
                .attr('height', height)
                .append('g');
                //.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    svg.selectAll('.daybox')
      .data(dayBoxes)
      .enter().append('rect')
        .attr('class', 'daybox')
        .attr('x', (d) => d.x)
        .attr('width', (d) => d.width)
        .attr('y', (d) => d.y)
        .attr('height', (d) => d.height)
        .attr('fill', (d) => d.color)
        .style('stroke', 'black')
        .style('stroke-width', 1);
  };

  let margin = { top: 20, right: 30, bottom: 30, left: 50 },
    calendarWidth = $(window).width() - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom,
    dayBoxWidth = calendarWidth / 7,
    dayBoxHeight = dayBoxWidth;

  const BOX_COLORS= {
    Taxes: 'yellow',
    Rent: 'blue',
    Bills: 'red', 
    Movies: 'green',
    Food: 'purple'
  };

  $.extend(d3OutputBinding, {
    find: (scope) => $(scope).find('.incomeCalendar'),
    renderError: (el, error) => console.log(error),
    renderValue: (el, data) => updateView(data)
  });

  Shiny.outputBindings.register(d3OutputBinding);
}

export { buildCalendar }
