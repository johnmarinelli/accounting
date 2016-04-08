import * as reader from "./lib/reader";

reader.readTextFile('resources/processed.json', function (json) {
  console.log(json);
})
