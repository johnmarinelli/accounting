echo "Building..."
./node_modules/.bin/lessc www/assets/stylesheets/less/style.less www/assets/stylesheets/css/style.css
./node_modules/.bin/babel --presets="es2015" assets/js/source/lib/amount-vs-category.es6.js > assets/js/compiled/lib/amount-vs-category.js
./node_modules/.bin/babel --presets="es2015" assets/js/source/app.es6.js > assets/js/compiled/app.js
./node_modules/.bin/browserify assets/js/compiled/app.js -o assets/js/compiled/bundle.js
echo "Done."
