bin := node_modules/.bin/
src_js := $(wildcard src/*.js)
src_css := $(wildcard src/*.scss)

.PHONY: build serve clean watch

build: dist/bundle.js dist/index.html dist/styles.css

# dist/ionicons: package.json
# 	-rm -r $@
# 	mkdir -p $@
# 	cp -r node_modules/ionicons/dist $@

dist/bundle.js: $(src_js) package.json Makefile
	$(bin)webpack --mode production

dist/styles.css: $(src_css) Makefile
	$(bin)sass src/main.scss $@ --style compressed

watch-js:
	npx webpack serve --mode development

watch-css:
	$(bin)sass "src/main.scss:dist/styles.css" --watch

watch: dist/index.html
	$(bin)concurrently --kill-others "make watch-js" "make watch-css"

clean:
	rm dist/*.js
