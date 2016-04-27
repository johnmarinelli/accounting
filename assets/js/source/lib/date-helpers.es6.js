let DateFunctions = () => {
  this.daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 0).getDate();
  };

  return this;
};

const isWorkday = (date) => Array.prototype.indexOf.call([1,2,3,4,5], date.getDay()) > -1;
const isWeekend = (date) => !isWorkday(date);

const getFirstDayOfMonth = (monthNumber = Date.getMonth()) => {
  let date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const getLastDayOfMonth = (monthNumber = Date.getMonth()) => {
  let date = new Date();
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

const daysInMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 0).getDate();
};

const getDatesInRange = (begin, end) => {
  let b = begin.getDate(),
      e = end.getDate(),
      diff = e - b + 1;
  let range = (n) => Array.apply(null, Array(n)).map((_, i) => i);
  let addDays = (date, n) => {
    let dat = new Date(date.valueOf());
    dat.setDate(dat.getDate() + n);
    return dat;
  };

  return Array.prototype.map.call(range(diff), (el) => {
    return addDays(begin, el);
  });
};

const getDaysInMonth = (monthNumber) => {
  // could be improved for more functional style
  return getDatesInRange(getFirstDayOfMonth(monthNumber), getLastDayOfMonth(monthNumber));
};

export { daysInMonth, getDaysInMonth, isWorkday }
