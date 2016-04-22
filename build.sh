echo "Building..."
./node_modules/.bin/lessc assets/stylesheets/less/style.less www/assets/stylesheets/style.css
./node_modules/.bin/babel --presets="es2015" assets/js/source/lib/amount-vs-category.es6.js > assets/js/compiled/lib/amount-vs-category.js
./node_modules/.bin/babel --presets="es2015" assets/js/source/lib/income-calendar.es6.js > assets/js/compiled/lib/income-calendar.js
./node_modules/.bin/babel --presets="es2015" assets/js/source/app.es6.js > assets/js/compiled/app.js
./node_modules/.bin/browserify assets/js/compiled/app.js -o assets/js/compiled/bundle.js
echo "Done."
