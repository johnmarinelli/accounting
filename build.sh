echo "Building..."
./node_modules/.bin/babel --presets="es2015" assets/js/source/lib/reader.es6.js > assets/js/compiled/lib/reader.js
./node_modules/.bin/babel --presets="es2015" assets/js/source/app.es6.js > assets/js/compiled/app.js
./node_modules/.bin/browserify assets/js/compiled/app.js -o assets/js/compiled/bundle.js
echo "Done."
