# Docker Compose commands
DOCKER_COMPOSE = docker-compose

up:
	$(DOCKER_COMPOSE) up -d

down:
	$(DOCKER_COMPOSE) down

restart:
	$(DOCKER_COMPOSE) restart

status:
	$(DOCKER_COMPOSE) ps

logs:
	$(DOCKER_COMPOSE) logs -f

build:
	$(DOCKER_COMPOSE) build

clean:
	$(DOCKER_COMPOSE) down --rmi all --volumes --remove-orphans

test-backend:
	@if command -v mvn > /dev/null; then \
		cd backend && mvn test; \
	else \
		echo "Error: mvn not found. Please install Maven or run tests in CI."; \
		exit 1; \
	fi

test-frontend:
	@if command -v npm > /dev/null; then \
		cd frontend && npm test -- --watchAll=false; \
	else \
		echo "Error: npm not found. Please install Node.js/npm or run tests in CI."; \
		exit 1; \
	fi

lint-frontend:
	@if command -v npm > /dev/null; then \
		cd frontend && npm run lint; \
	else \
		echo "Error: npm not found. Please install Node.js/npm or run tests in CI."; \
		exit 1; \
	fi

test: test-backend test-frontend
