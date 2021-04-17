bin := node_modules/.bin/
src := $(wildcard src/*.js)

.PHONY: build serve clean

build: dist/ionicons dist/bundle.js dist/index.html dist/styles.css

dist/ionicons: package-lock.json
	rm -r $@
	mkdir -p $@
	cp -r node_modules/ionicons/dist $@

dist/bundle.js: $(src) package.json Makefile
	$(bin)webpack --mode production

serve: dist/bundle.js dist/index.html dist/styles.css
	cd dist/ && python -m http.server 8080 &
	$(bin)webpack --mode production --watch

clean:
	rm dist/*.js
