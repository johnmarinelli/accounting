let buildCalendar = (DateFunctions) => {
  let d3OutputBinding = new Shiny.OutputBinding();

  const transformData = (d) => {
    const boxColors = {
      Taxes: 'gray',
      Rent: 'blue',
      Bills: 'blue'
    };

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

    let monthDates = DateFunctions.getDaysInMonth(new Date().getMonth());
    dayBoxes = Array.prototype.map.call(monthDates, (e, i) => {
      let newDayBox = undefined;
      if (DateFunctions.isWorkday(e) && dayBoxes.length > 0) {
        let dayBox = dayBoxes.shift();
        newDayBox = $.extend(dayBox, { date: e });
      }
      return newDayBox;
    }).filter((e) => e !== undefined);
    console.log(dayBoxes);
    return dayBoxes;
  };
  
  const updateView = (d) => {
    d3.select('.incomeCalendar svg')
      .remove();
    let dayBoxes = transformData(d);
  };

  $.extend(d3OutputBinding, {
    find: (scope) => $(scope).find('.incomeCalendar'),
    renderError: (el, error) => console.log(error),
    renderValue: (el, data) => updateView(data)
  });

  Shiny.outputBindings.register(d3OutputBinding);
}

export { buildCalendar }
