bin := node_modules/.bin/
src_js := $(wildcard src/*.js)
src_css := $(wildcard src/*.scss)

.PHONY: build serve clean

build: dist/bundle.js dist/index.html dist/styles.css

# dist/ionicons: package.json
# 	-rm -r $@
# 	mkdir -p $@
# 	cp -r node_modules/ionicons/dist $@

dist/bundle.js: $(src_js) package.json Makefile
	$(bin)webpack --mode production

dist/styles.css: $(src_css) Makefile
	$(bin)sass src/main.scss $@ --style compressed

serve: dist/bundle.js dist/index.html dist/styles.css
	cd dist/ && python -m http.server 8080 &
	$(bin)webpack --mode production --watch

clean:
	rm dist/*.js
