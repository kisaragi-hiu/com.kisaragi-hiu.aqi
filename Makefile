bin := node_modules/.bin/
src_js := $(wildcard src/*.js)
src_css := $(wildcard src/*.scss)

.PHONY: build validate watch-js watch-css watch serve clean

dist/bundle.js: $(src_js) package.json Makefile
	$(bin)rollup -c

dist/styles.css: $(src_css) Makefile
	$(bin)sass src/main.scss $@ --style compressed

build: dist/bundle.js dist/index.html dist/styles.css

validate:
	$(bin)svelte-check

watch-js:
	$(bin)rollup -c -w

watch-css: dist/styles.css
	$(bin)sass "src/main.scss:dist/styles.css" --watch

watch:
	$(bin)concurrently --kill-others "make serve" "make watch-js" "make watch-css"

serve:
	cd dist/; python -m http.server 8080

clean:
	rm dist/*.js
