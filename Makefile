src_js := $(wildcard src/*.js)
src_css := $(wildcard src/*.scss)

.PHONY: build serve clean open-browser

# Visit the page after a second
# Unless Firefox is already open and has a tab visiting the page
# (I've only bothered to support Firefox here)
open-browser:
	-(sleep 1 && \
	 !(pgrep firefox && python firefox-page-opened.py "localhost:8080") && \
	 xdg-open "http://localhost:8080")

ext := dist/feather-icons

build: $(ext) dist/bundle.js dist/index.html dist/styles.css

# Yes, this is what you do if you don't want to do it in Webpack.
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

watch-js:
	npx webpack serve --mode development

watch-css:
	npx sass "src/main.scss:dist/styles.css" --watch

serve: dist/index.html
	npx concurrently "make open-browser" "make watch-js" "make watch-css"

clean:
	rm dist/*.js
