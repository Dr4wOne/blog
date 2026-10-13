.PHONY: lint test build

lint:
	@echo "Lint (ESLint config migration pending)"

test:
	@echo "No tests configured (static site)"

build:
	npm ci --silent
	npm run build
