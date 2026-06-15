# Sargasses Gwada — task runner (thin wrapper around the pnpm scripts).
# Run `make` or `make help` to list available targets.

PM := pnpm

.DEFAULT_GOAL := help
.PHONY: help install dev build preview lint lint-fix format typecheck check clean

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies (pnpm)
	$(PM) install

dev: ## Start the Vite dev server
	$(PM) dev

build: ## Type-check and build for production (tsc -b && vite build)
	$(PM) build

preview: ## Serve the production build locally
	$(PM) preview

lint: ## Lint with ESLint
	$(PM) lint

lint-fix: ## Lint and auto-fix with ESLint
	$(PM) exec eslint . --fix

format: ## Format the codebase with Prettier
	$(PM) exec prettier --write .

typecheck: ## Type-check the project (tsc -b, no emit)
	$(PM) exec tsc -b

check: lint typecheck ## Run lint + typecheck (CI gate)

clean: ## Remove the build output (dist/)
	rm -rf dist
