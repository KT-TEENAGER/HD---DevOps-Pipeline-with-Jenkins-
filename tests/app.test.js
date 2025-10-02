import request from "supertest";
import app from "../src/app.js";

describe("DiscountMate API", () => {
  const key = { "x-api-key": "demo-key" };

  test("health and metrics", async () => {
    const h = await request(app).get("/health");
    expect(h.status).toBe(200);
    const m = await request(app).get("/metrics");
    expect(m.status).toBe(200);
  });

  test("calculate price with percent code", async () => {
    const res = await request(app).get("/api/discounts/price?price=100&code=SAVE10").set(key);
    expect(res.status).toBe(200);
    expect(res.body.finalPrice).toBe(90);
  });

  test("deals CRUD", async () => {
    const list = await request(app).get("/api/deals").set(key);
    expect(list.status).toBe(200);

    const create = await request(app).post("/api/deals").set(key).send({ code: "NEW20", type: "percent", value: 20 });
    expect(create.status).toBe(201);

    const price = await request(app).get("/api/discounts/price?price=50&code=NEW20").set(key);
    expect(price.body.finalPrice).toBe(40);

    const del = await request(app).delete("/api/deals/NEW20").set(key);
    expect(del.status).toBe(200);
  });
});
