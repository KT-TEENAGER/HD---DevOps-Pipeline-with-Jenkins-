# DiscountMate API

Small API to calculate discounted prices and manage deals (capstone-aligned).

## Quick Start
```bash
npm ci
npm test
npm start
# In another terminal
curl -s http://localhost:3000/health
curl -s -H "x-api-key: demo-key" "http://localhost:3000/api/discounts/price?price=100&code=SAVE10"
```

## Docker
```bash
docker build -t discountmate-api:dev .
docker compose up -d
```

## Endpoints
- `GET /health` — health check
- `GET /metrics` — basic metrics (demo)
- `GET /api/discounts/price?price=&code=` — calculate price
- `GET /api/deals` — list deals
- `POST /api/deals` — create deal `{code, type:'percent'|'flat', value:Number}`
- `DELETE /api/deals/:code` — delete deal
