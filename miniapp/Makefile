# NΞØ SMART FACTORY - Mobile Hub Makefile
# Mission: Expand until silence becomes structure.

.PHONY: dev build audit commit commit-tag setup clean help

# Colors for output
CYAN := \033[0;36m
GREEN := \033[0;32m
RED := \033[0;31m
YELLOW := \033[0;33m
NC := \033[0m # No Color

# Default target
all: help

help:
	@echo "$(CYAN)NΞØ Mobile Hub - Management Console$(NC)"
	@echo "-------------------------------------"
	@echo "$(GREEN)dev$(NC)          - Start development server"
	@echo "$(GREEN)build$(NC)        - Full local build (cleans cache first)"
	@echo "$(GREEN)audit$(NC)        - Run security vulnerability audit"
	@echo "$(GREEN)setup$(NC)        - Install dependencies and setup .env"
	@echo "$(GREEN)commit$(NC)       - Secure commit flow (Audit -> Build -> Commit)"
	@echo "$(GREEN)commit-tag$(NC)   - Secure commit with version tagging"
	@echo "$(GREEN)clean$(NC)        - Remove build artifacts and node_modules"

setup:
	@echo "$(CYAN)Setting up NΞØ Node Environment...$(NC)"
	@npm install
	@test -f .env || cp .env.example .env
	@echo "$(GREEN)Setup complete. Configure your .env variables.$(NC)"

dev:
	@echo "$(CYAN)Propagating Local Node...$(NC)"
	@npm run dev

audit:
	@echo "$(CYAN)Scanning for Sector Vulnerabilities...$(NC)"
	@npm audit || (echo "$(RED)Critical vulnerabilities detected! Fix before proceeding.$(NC)" && exit 1)
	@echo "$(GREEN)Security scan passed.$(NC)"

clean:
	@echo "$(YELLOW)Cleaning local structures...$(NC)"
	@rm -rf dist
	@rm -rf node_modules/.vite
	@echo "$(GREEN)Cleaned.$(NC)"

build: clean
	@echo "$(CYAN)Assembling Production Architecture...$(NC)"
	@npm run build || (echo "$(RED)Build failed!$(NC)" && exit 1)
	@echo "$(GREEN)Build successful.$(NC)"

commit: audit
	@echo "$(CYAN)Initializing Secure Commit Flow...$(NC)"
	@git status
	@echo "$(YELLOW)Enter commit type (feat, fix, docs, style, refactor, chore): $(NC)"
	@read type; \
	echo "$(YELLOW)Enter commit message: $(NC)"; \
	read msg; \
	if [ -z "$$type" ] || [ -z "$$msg" ]; then \
		echo "$(RED)Type and message are required.$(NC)"; exit 1; \
	fi; \
	git add .; \
	git commit -m "$$type: $$msg"; \
	echo "$(CYAN)Pushing to Hive Mainnet...$(NC)"; \
	git push origin main
	@echo "$(GREEN)Propagation successful.$(NC)"

commit-tag: audit build
	@echo "$(CYAN)Initializing Major Transition Commit...$(NC)"
	@git status
	@echo "$(YELLOW)Enter commit message (Conventional Commit): $(NC)"
	@read msg; \
	if [ -z "$$msg" ]; then \
		echo "$(RED)Commit message is required.$(NC)"; exit 1; \
	fi; \
	git add .; \
	git commit -m "$$msg"; \
	VERSION=$$(date +%Y.%m.%d-%H%M); \
	echo "$(CYAN)Tagging as v$$VERSION...$(NC)"; \
	git tag -a "v$$VERSION" -m "Release v$$VERSION: $$msg"; \
	git push origin main --tags
	@echo "$(GREEN)Global release propagated.$(NC)"
