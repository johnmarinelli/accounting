export function readTextFile(file, cb) {
  let fileUrl = 'file:///' + file,
    rawFile = new XMLHttpRequest();

  Array.prototype.map = (fun) => {
    let len = this.length >>> 0, // coerce to unsigned int
      thisp = arguments[1],
      newArray = [];

    if (typeof fun != "function") {
      throw new TypeError();
    }

    for (var i = 0; i < len; ++i) {
      if (i in this) {
        newArray.push(fun.call(thisp, this[i], i, this));
      }
    }

    return newArray;
  };

  let currentPath = location.href.split('/').slice(0, -1).join('/');

  rawFile.open('GET', fileUrl, false);
  rawFile.onreadystatechange = () => {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        let allText = rawFile.responseText;
        alert(allText);
        cb(allText)
      }
    }
  }
  rawFile.send(null);
}

