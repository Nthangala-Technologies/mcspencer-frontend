import { Router } from "express";
import { query } from "../lib/pgdb.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { event_type, product_id, page, session_id } = req.body;
    const allowed = ["view", "pageview", "add_to_cart", "wishlist", "compare", "checkout"];
    if (!event_type || !allowed.includes(event_type)) {
      return res.status(400).json({ error: "Invalid event_type" });
    }
    await query(
      `INSERT INTO analytics_events (event_type, product_id, page, session_id) VALUES ($1,$2,$3,$4)`,
      [event_type, product_id ?? null, page ?? null, session_id ?? null]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to track event" });
  }
});

export default router;
