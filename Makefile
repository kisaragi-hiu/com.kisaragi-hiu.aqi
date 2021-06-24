src_js := $(wildcard src/*.js)
src_css := $(wildcard src/*.scss)

.PHONY: build serve clean

build: dist/bundle.js dist/index.html dist/styles.css

# dist/ionicons: package.json
# 	-rm -r $@
# 	mkdir -p $@
# 	cp -r node_modules/ionicons/dist $@

dist/bundle.js: $(src_js) package.json Makefile
	npx webpack --mode production

dist/styles.css: $(src_css) Makefile
	npx sass --no-source-map src/main.scss $@ --style compressed

watch-js:
	npx webpack serve --mode development

watch-css:
	npx sass "src/main.scss:dist/styles.css" --watch

serve: dist/index.html
	npx concurrently --kill-others "make watch-js" "make watch-css"

clean:
	rm dist/*.js
