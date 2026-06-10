import { Router } from "express";
import { query } from "../lib/pgdb.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, order_ref, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const [row] = await query(
      `INSERT INTO contact_submissions (name, email, order_ref, message) VALUES ($1,$2,$3,$4) RETURNING *`,
      [name, email, order_ref ?? null, message]
    );
    res.status(201).json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save contact" });
  }
});

export default router;
