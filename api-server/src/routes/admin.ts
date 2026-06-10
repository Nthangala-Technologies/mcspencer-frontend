import { Router } from "express";
import { query } from "../lib/pgdb.js";

const router = Router();

// ── Dashboard stats ──────────────────────────────────────────────────────────
router.get("/stats", async (_req, res) => {
  try {
    const [orderStats] = await query<{ count: string; total: string; pending: string; completed: string }>(`
      SELECT
        COUNT(*)::text AS count,
        COALESCE(SUM(total), 0)::text AS total,
        COUNT(*) FILTER (WHERE status = 'pending')::text AS pending,
        COUNT(*) FILTER (WHERE status = 'completed')::text AS completed
      FROM orders
    `);
    const [contactStats] = await query<{ count: string; unread: string }>(`
      SELECT COUNT(*)::text AS count, COUNT(*) FILTER (WHERE status = 'unread')::text AS unread
      FROM contact_submissions
    `);
    const [recentRevenue] = await query<{ amount: string }>(`
      SELECT COALESCE(SUM(total), 0)::text AS amount FROM orders
      WHERE created_at > NOW() - INTERVAL '30 days'
    `);
    const topProducts = await query<{ product_id: string; views: string }>(`
      SELECT product_id, COUNT(*)::text AS views
      FROM analytics_events WHERE event_type = 'view' AND product_id IS NOT NULL
      GROUP BY product_id ORDER BY COUNT(*) DESC LIMIT 5
    `);
    const dailyOrders = await query<{ day: string; count: string; revenue: string }>(`
      SELECT DATE(created_at)::text AS day, COUNT(*)::text AS count, COALESCE(SUM(total),0)::text AS revenue
      FROM orders WHERE created_at > NOW() - INTERVAL '14 days'
      GROUP BY DATE(created_at) ORDER BY day ASC
    `);
    res.json({
      orders: { total: +orderStats.count, revenue: +orderStats.total, pending: +orderStats.pending, completed: +orderStats.completed },
      contacts: { total: +contactStats.count, unread: +contactStats.unread },
      recentRevenue: +recentRevenue.amount,
      topProducts,
      dailyOrders: dailyOrders.map((r) => ({ day: r.day, count: +r.count, revenue: +r.revenue })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// ── Orders ───────────────────────────────────────────────────────────────────
router.get("/orders", async (req, res) => {
  try {
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;
    let sql = `SELECT * FROM orders`;
    const params: unknown[] = [];
    const conditions: string[] = [];
    if (status && status !== "all") { params.push(status); conditions.push(`status = $${params.length}`); }
    if (search) { params.push(`%${search}%`); conditions.push(`(customer_name ILIKE $${params.length} OR customer_email ILIKE $${params.length} OR order_number ILIKE $${params.length})`); }
    if (conditions.length) sql += ` WHERE ${conditions.join(" AND ")}`;
    sql += ` ORDER BY created_at DESC LIMIT 200`;
    const orders = await query(sql, params);
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.patch("/orders/:id", async (req, res) => {
  try {
    const { status, notes } = req.body;
    const id = parseInt(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });
    const allowed = ["pending", "processing", "shipped", "completed", "cancelled"];
    if (status && !allowed.includes(status)) return res.status(400).json({ error: "Invalid status" });
    const [updated] = await query(
      `UPDATE orders SET status = COALESCE($1, status), notes = COALESCE($2, notes), updated_at = NOW() WHERE id = $3 RETURNING *`,
      [status ?? null, notes ?? null, id]
    );
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update order" });
  }
});

router.delete("/orders/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });
    await query(`DELETE FROM orders WHERE id = $1`, [id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete" });
  }
});

// ── Contact submissions ───────────────────────────────────────────────────────
router.get("/contacts", async (_req, res) => {
  try {
    const rows = await query(`SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT 200`);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
});

router.patch("/contacts/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const allowed = ["unread", "read", "resolved"];
    if (!allowed.includes(status)) return res.status(400).json({ error: "Invalid status" });
    const [row] = await query(`UPDATE contact_submissions SET status = $1 WHERE id = $2 RETURNING *`, [status, id]);
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update contact" });
  }
});

router.delete("/contacts/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await query(`DELETE FROM contact_submissions WHERE id = $1`, [id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete" });
  }
});

// ── Inventory ─────────────────────────────────────────────────────────────────
router.get("/inventory", async (_req, res) => {
  try {
    const rows = await query(`SELECT * FROM product_inventory ORDER BY product_id::int ASC`);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch inventory" });
  }
});

router.patch("/inventory/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const { stock_count, is_featured, is_active } = req.body;
    const [row] = await query(
      `UPDATE product_inventory SET
        stock_count = COALESCE($1, stock_count),
        is_featured = COALESCE($2, is_featured),
        is_active = COALESCE($3, is_active),
        updated_at = NOW()
       WHERE product_id = $4 RETURNING *`,
      [stock_count ?? null, is_featured ?? null, is_active ?? null, productId]
    );
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update inventory" });
  }
});

// ── Analytics ────────────────────────────────────────────────────────────────
router.get("/analytics", async (_req, res) => {
  try {
    const eventCounts = await query<{ event_type: string; count: string }>(`
      SELECT event_type, COUNT(*)::text AS count FROM analytics_events
      WHERE created_at > NOW() - INTERVAL '30 days'
      GROUP BY event_type
    `);
    const pageViews = await query<{ page: string; count: string }>(`
      SELECT page, COUNT(*)::text AS count FROM analytics_events
      WHERE event_type = 'pageview' AND page IS NOT NULL AND created_at > NOW() - INTERVAL '30 days'
      GROUP BY page ORDER BY COUNT(*) DESC LIMIT 10
    `);
    const daily = await query<{ day: string; count: string }>(`
      SELECT DATE(created_at)::text AS day, COUNT(*)::text AS count
      FROM analytics_events WHERE created_at > NOW() - INTERVAL '14 days'
      GROUP BY DATE(created_at) ORDER BY day ASC
    `);
    res.json({ eventCounts, pageViews, daily });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

export default router;
