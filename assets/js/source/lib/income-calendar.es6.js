let buildCalendar = (DateFunctions) => {
  let d3OutputBinding = new Shiny.OutputBinding();
  
  const updateView = (d) => {
    d3.select('.incomeCalendar svg')
      .remove();

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
            totalDays = lastDayBox.total + bucketDays,
            over100 = (totalDays * 100) > 100.00;

        if (over100) {
          let distanceFrom100 = Math.abs(100.00 - lastDayBox.total),
              leftoverBucketDays = Math.abs(bucketDays - (distanceFrom100 / 100));

          dayBoxes[dayBoxes.length - 1].spending.push({
            category: bucket.category,
            percentage: distanceFrom100
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
      console.log(dayBoxes);
    }
  };

  $.extend(d3OutputBinding, {
    find: (scope) => $(scope).find('.incomeCalendar'),
    renderError: (el, error) => console.log(error),
    renderValue: (el, data) => updateView(data)
  });

  Shiny.outputBindings.register(d3OutputBinding);
}

export { buildCalendar }
