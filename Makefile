bin := node_modules/.bin/
src := $(wildcard src/*.js)

.PHONY: build serve clean

build: dist/bundle.js dist/index.html dist/styles.css

dist/bundle.js: $(src) package.json Makefile
	$(bin)rollup -c

serve: dist/bundle.js dist/index.html dist/styles.css
	cd dist/ && python -m http.server 8080

clean:
	rm dist/*.js
