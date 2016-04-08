echo "Building..."
./node_modules/.bin/babel --presets="es2015" js/source/lib/reader.es6.js > js/compiled/lib/reader.js
./node_modules/.bin/babel --presets="es2015" js/source/app.es6.js > js/compiled/app.js
./node_modules/.bin/browserify js/compiled/app.js -o js/compiled/bundle.js
echo "Done."
