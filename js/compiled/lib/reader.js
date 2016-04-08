'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readTextFile = readTextFile;
function readTextFile(file, cb) {
  var _this = this,
      _arguments = arguments;

  var fileUrl = 'file:///' + file,
      rawFile = new XMLHttpRequest();

  Array.prototype.map = function (fun) {
    var len = _this.length >>> 0,
        // coerce to unsigned int
    thisp = _arguments[1],
        newArray = [];

    if (typeof fun != "function") {
      throw new TypeError();
    }

    for (var i = 0; i < len; ++i) {
      if (i in _this) {
        newArray.push(fun.call(thisp, _this[i], i, _this));
      }
    }

    return newArray;
  };

  var currentPath = location.href.split('/').slice(0, -1).join('/');

  rawFile.open('GET', fileUrl, false);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        var allText = rawFile.responseText;
        alert(allText);
        cb(allText);
      }
    }
  };
  rawFile.send(null);
}

console.log('hello');
alert('hello');

