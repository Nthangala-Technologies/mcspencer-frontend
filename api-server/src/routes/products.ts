import { Router } from "express";
import { query } from "../lib/pgdb.js";

const router = Router();

// List all custom products
router.get("/", async (_req, res) => {
  try {
    const rows = await query(`SELECT * FROM custom_products ORDER BY created_at DESC`);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Create a new product
router.post("/", async (req, res) => {
  try {
    const { name, description, price, category, image, stock_count, details } = req.body;
    if (!name || !description || !price || !category) {
      return res.status(400).json({ error: "name, description, price and category are required" });
    }
    const defaultImage = "https://images.unsplash.com/photo-1560472355-536de3962603?w=600&h=600&fit=crop";
    const [row] = await query(
      `INSERT INTO custom_products (name, description, price, category, image, stock_count, details)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        name.trim(),
        description.trim(),
        Number(price),
        category.trim(),
        (image || defaultImage).trim(),
        Number(stock_count ?? 10),
        JSON.stringify(Array.isArray(details) ? details : []),
      ]
    );
    res.status(201).json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// Update a product
router.patch("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });
    const { name, description, price, category, image, stock_count, is_active, details } = req.body;
    const [row] = await query(
      `UPDATE custom_products SET
        name        = COALESCE($1, name),
        description = COALESCE($2, description),
        price       = COALESCE($3, price),
        category    = COALESCE($4, category),
        image       = COALESCE($5, image),
        stock_count = COALESCE($6, stock_count),
        is_active   = COALESCE($7, is_active),
        details     = COALESCE($8, details),
        updated_at  = NOW()
       WHERE id = $9 RETURNING *`,
      [
        name ?? null, description ?? null, price != null ? Number(price) : null,
        category ?? null, image ?? null, stock_count != null ? Number(stock_count) : null,
        is_active ?? null, details ? JSON.stringify(details) : null, id,
      ]
    );
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Delete a product
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });
    await query(`DELETE FROM custom_products WHERE id = $1`, [id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete" });
  }
});

export default router;
