include .env

start:
	@docker compose start $(service)

stop:
	@docker compose stop $(service)

restart:
	@docker compose restart $(service)

up:
	@docker compose up -d

build:
	@docker compose build

log:
	@if [ -z "$(service)" ]; then \
		docker compose logs -f --tail 10000; \
	else \
		docker compose logs -f --tail 10000 --no-log-prefix $(service); \
	fi

build:
	@docker compose build

status:
	@docker compose ps -a --format "{{.Label \"com.docker.compose.service\"}}|{{.Status}}" $(service) | column -t -s "|"; \

shell:
	@docker compose exec $(service) sh || { \
		echo "\033[38;5;214m[!] Fallback to 'docker compose run'\033[0m"; \
		docker compose run --rm --no-deps $(service) sh; \
	}

browse:
	firefox http://localhost:$($(shell echo ${service}_PORT | tr '[:lower:]' '[:upper:]'))
