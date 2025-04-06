.PHONY: build up setup down start stop restart logs login test mock

build:
	docker compose build

up:
	docker compose up -d

setup:
	docker compose run --rm -w /application credit-simulator /bin/bash -c "npm install && npm run setup"

down:
	docker compose down

start:
	docker compose start

stop:
	docker compose stop

restart: down up

logs:
	docker compose logs -f

login:
	docker compose run --rm -w /application credit-simulator /bin/bash

test:
	docker compose run --rm -w /application credit-simulator /bin/bash -c "npm run test"

test-watch:
	docker compose run --rm -w /application credit-simulator /bin/bash -c "npm run test:watch"

test-coverage:
	docker compose run --rm -w /application credit-simulator /bin/bash -c "npm run test:coverage"

test-api:
	docker compose run --rm -w /application credit-simulator /bin/bash -c "npm run test:api"

mock:
	docker compose run --rm -w /application credit-simulator /bin/bash -c "node tasks/send-message.mjs $(type)"

configure: down build up setup logs

watch: down up logs

