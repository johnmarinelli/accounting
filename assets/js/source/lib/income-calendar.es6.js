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
          days: (data.Amounts[i] / monthlyIncome) * daysInMonth
        };
      });
    }).call(this, d, 7500);

    let dayBoxes = [];

    for (let i = 0; i < buckets.length; ++i) {
      let bucket = buckets[i],
        bucketDays = bucket.days;
      let lastDayBox = dayBoxes[dayBoxes.length - 1];

      // the last day still has empty space
      if (lastDayBox && lastDayBox.total.toFixed(2) < 100.00) {
        let diff = Math.abs(lastDayBox.total - bucketDays);
      }

      // the last day is full or we're just starting
      else {
        let bucketDayBoxes = [];
        for (let j = 0; j < Math.ceil(days); ++j) {
          
        }
      }
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
