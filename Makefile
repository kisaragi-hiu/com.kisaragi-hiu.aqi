src_js := $(wildcard src/*.js)
src_css := $(wildcard src/*.scss)

# * Utils
.PHONY: open-browser watch-js watch-css serve clean build

# Visit the page after a second
# Unless Firefox is already open and has a tab visiting the page
# (I've only bothered to support Firefox here)
open-browser:
	-(sleep 1 && \
	 !(pgrep firefox && python firefox-page-opened.py "localhost:8080") && \
	 xdg-open "http://localhost:8080")

watch-js:
	npx webpack serve --mode development

watch-css:
	npx sass "src/main.scss:dist/styles.css" --watch

serve: dist/index.html
	npx concurrently "make open-browser" "make watch-js" "make watch-css"

clean:
	rm dist/*.js

build: dist

# * Build
.PHONY: build serve clean open-browser

ext := dist/feather-icons

# Yes, this is what you do if you don't want to import asset files
# with Webpack.
#
# "Prior to webpack, front-end developers would use tools like grunt
# and gulp to process these assets and move them from their /src
# folder into their /dist or /build directory."
#
# --- https://webpack.js.org/guides/asset-management/
dist/feather-icons: package.json
	-rm dist/feather-icons -r
	cp -r node_modules/feather-icons/dist dist/feather-icons

dist/bundle.js: $(src_js) package.json Makefile
	npx webpack --mode production

dist/styles.css: $(src_css) Makefile
	npx sass --no-source-map src/main.scss $@ --style compressed

dist: $(ext) dist/bundle.js dist/index.html dist/styles.css

# * Android

android-icons: assets
	mkdir -p "resources/android"
	cp assets/icon.png resources/icon.png
	gm convert assets/icon-no-border.png \
	   -resize 432x432 \
	   resources/android/icon-foreground.png
	npx cordova-res android \
	    --type adaptive-icon \
	    --icon-background-source "#dcebf4" \
	    --skip-config --copy

run-android: dist android-icons
	npx cap sync
	npx cap run android
