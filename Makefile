src_js := $(wildcard src/*.js) vite.config.mjs
src_css := $(wildcard src/*.scss)

.PHONY: build dev preview

build: $(src_js) $(src_css)
	npx vite build

preview: build
	cd dist && python -m http.server 5173

dev:
	npx vite dev
