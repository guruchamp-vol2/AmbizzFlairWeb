# Ambizz Flair • Final Price Calculator

A tiny web service + UI for calculating final price from a price and a discount (percent or flat).

- **API**: `POST /api/final-price` with `{ price, discount, mode }`
- **UI**: at `/`

## Run locally

```bash
npm install
npm start
# open http://localhost:3000
```

## Deploy to Render

1. Push this folder to a new GitHub repo.
2. In Render, create a **Web Service** → pick your repo.
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`
5. Render sets the `PORT` env var automatically.

## API examples

```bash
curl -s -X POST http://localhost:3000/api/final-price   -H "Content-Type: application/json"   -d '{"price": 249.99, "discount": 15, "mode": "percent"}' | jq

curl -s -X POST http://localhost:3000/api/final-price   -H "Content-Type: application/json"   -d '{"price": 120, "discount": 25, "mode": "flat"}' | jq
```
