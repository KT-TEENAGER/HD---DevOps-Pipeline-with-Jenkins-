import { Router } from "express";
const r = Router();

// In-memory deals for demo
// Each deal: { code, type: 'percent'|'flat', value }
let deals = [
  { code: "SAVE10", type: "percent", value: 10 },
  { code: "FLAT5", type: "flat", value: 5 }
];

function applyDiscount(price, deal) {
  if (!deal) return price;
  if (deal.type === "percent") return +(price * (1 - deal.value / 100)).toFixed(2);
  if (deal.type === "flat") return Math.max(0, +(price - deal.value).toFixed(2));
  return price;
}

// Calculate price endpoint
// GET /api/discounts/price?price=100&code=SAVE10
r.get("/discounts/price", (req, res) => {
  const price = parseFloat(req.query.price);
  const code = (req.query.code || "").toUpperCase();
  if (isNaN(price)) return res.status(400).json({ error: "invalid price" });
  const deal = deals.find(d => d.code === code);
  const finalPrice = applyDiscount(price, deal);
  res.json({ price, code: code || null, finalPrice });
});

// Deals CRUD (basic)
r.get("/deals", (req, res) => res.json(deals));

r.post("/deals", (req, res) => {
  const { code, type, value } = req.body || {};
  if (!code || !type || typeof value !== "number")
    return res.status(400).json({ error: "code, type, value required" });
  if (!["percent", "flat"].includes(type)) return res.status(400).json({ error: "invalid type" });
  const existing = deals.find(d => d.code === code.toUpperCase());
  if (existing) return res.status(409).json({ error: "code exists" });
  const d = { code: code.toUpperCase(), type, value };
  deals.push(d);
  res.status(201).json(d);
});

r.delete("/deals/:code", (req, res) => {
  const code = req.params.code.toUpperCase();
  const before = deals.length;
  deals = deals.filter(d => d.code != code);
  if (deals.length === before) return res.status(404).json({ error: "not found" });
  res.json({ ok: true });
});

export default r;
