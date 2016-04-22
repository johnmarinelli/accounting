let buildCalendar = () => {
  let d3OutputBinding = new Shiny.OutputBinding();
  
  const updateView = (d) => {
    console.log(d);
  };

  $.extend(d3OutputBinding, {
    find: (scope) => $(scope).find('.incomeCalendar'),
    renderError: (el, error) => console.log(error),
    renderValue: (el, data) => updateView(data)
  });

  Shiny.outputBindings.register(d3OutputBinding);
}

export { buildCalendar }
