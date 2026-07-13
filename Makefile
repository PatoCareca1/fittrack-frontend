.PHONY: help install dev build start lint test coverage clean

NPM  ?= npm
PORT ?= 3000

help:
	@echo "FitTrack (frontend / Next.js) — comandos:"
	@echo "  make install    Instala as dependências (npm install)"
	@echo "  make dev        Sobe o dev server na porta $(PORT)"
	@echo "  make build      Build de produção"
	@echo "  make start      Sobe o build de produção na porta $(PORT)"
	@echo "  make lint       Roda o ESLint"
	@echo "  make test       Roda os testes (Vitest)"
	@echo "  make coverage   Testes com relatório de cobertura"
	@echo "  make clean      Remove .next e caches"

install:
	$(NPM) install

dev:
	$(NPM) run dev -- -p $(PORT)

build:
	$(NPM) run build

start:
	$(NPM) run start -- -p $(PORT)

lint:
	$(NPM) run lint

test:
	$(NPM) run test

coverage:
	$(NPM) run coverage

clean:
	rm -rf .next coverage node_modules/.cache
