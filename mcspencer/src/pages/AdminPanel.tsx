import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, ShoppingBag, Package, MessageSquare, TrendingUp,
  RefreshCw, Trash2, Check, ChevronDown, X, AlertCircle, Boxes,
  DollarSign, Users, Mail, ArrowUpRight, Edit2, Save, BarChart3,
} from "lucide-react";
import { products } from "../lib/data";
import { formatZAR } from "../lib/currency";

const API = (import.meta.env.VITE_API_URL ?? "") + "/api";

type Tab = "dashboard" | "orders" | "inventory" | "messages" | "analytics";

const STATUS_COLOURS: Record<string, string> = {
  pending:    "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped:    "bg-indigo-100 text-indigo-800",
  completed:  "bg-green-100 text-green-800",
  cancelled:  "bg-red-100 text-red-800",
};

const MSG_STATUS_COLOURS: Record<string, string> = {
  unread:   "bg-red-100 text-red-700",
  read:     "bg-gray-100 text-gray-600",
  resolved: "bg-green-100 text-green-700",
};

function KpiCard({ icon, label, value, sub, accent }: {
  icon: React.ReactNode; label: string; value: string | number; sub?: string; accent: string;
}) {
  return (
    <div className={`rounded-2xl border-2 bg-white p-5 flex gap-4 items-start ${accent}`}>
      <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">{icon}</div>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="text-2xl font-black text-[hsl(222,62%,28%)] mt-0.5">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function MiniBar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground w-24 truncate">{label}</span>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-[hsl(86,72%,45%)] rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-[hsl(222,62%,28%)] w-6 text-right">{value}</span>
    </div>
  );
}

// ── Dashboard tab ─────────────────────────────────────────────────────────────
function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/admin/stats`);
      setStats(await r.json());
    } catch { setStats(null); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Loader />;
  if (!stats || stats.error) return <ErrorState onRetry={load} />;

  const maxDaily = Math.max(...(stats.dailyOrders || []).map((d: any) => d.count), 1);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard icon={<ShoppingBag className="w-5 h-5 text-[hsl(222,62%,28%)]" />} label="Total Orders" value={stats.orders.total} sub={`${stats.orders.pending} pending`} accent="border-border" />
        <KpiCard icon={<DollarSign className="w-5 h-5 text-green-600" />} label="Total Revenue" value={formatZAR(stats.orders.revenue)} sub="All time" accent="border-green-200" />
        <KpiCard icon={<Check className="w-5 h-5 text-[hsl(86,72%,38%)]" />} label="Completed" value={stats.orders.completed} sub="Orders fulfilled" accent="border-[hsl(86,72%,45%)]/30" />
        <KpiCard icon={<Mail className="w-5 h-5 text-red-500" />} label="Messages" value={stats.contacts.unread} sub={`${stats.contacts.total} total`} accent="border-red-200" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily orders sparkline */}
        <div className="bg-white border-2 border-border rounded-2xl p-5">
          <p className="font-black text-[hsl(222,62%,28%)] text-sm mb-4">Orders — Last 14 Days</p>
          {stats.dailyOrders?.length > 0 ? (
            <div className="space-y-2">
              {stats.dailyOrders.map((d: any) => (
                <MiniBar key={d.day} label={d.day.slice(5)} value={d.count} max={maxDaily} />
              ))}
            </div>
          ) : <p className="text-sm text-muted-foreground text-center py-8">No orders yet</p>}
        </div>

        {/* Top products */}
        <div className="bg-white border-2 border-border rounded-2xl p-5">
          <p className="font-black text-[hsl(222,62%,28%)] text-sm mb-4">Top Viewed Products</p>
          {stats.topProducts?.length > 0 ? (
            <div className="space-y-3">
              {stats.topProducts.map((tp: any, i: number) => {
                const prod = products.find((p) => p.id === tp.product_id);
                return (
                  <div key={tp.product_id} className="flex items-center gap-3">
                    <span className="text-xs font-black text-muted-foreground w-5">#{i + 1}</span>
                    {prod && <img src={prod.image} alt={prod.name} className="w-8 h-8 rounded-lg object-cover" />}
                    <span className="text-xs font-semibold text-foreground flex-1 truncate">{prod?.name ?? tp.product_id}</span>
                    <span className="text-xs font-bold text-[hsl(86,72%,38%)]">{tp.views} views</span>
                  </div>
                );
              })}
            </div>
          ) : <p className="text-sm text-muted-foreground text-center py-8">No analytics data yet</p>}
        </div>
      </div>

      {/* Recent revenue */}
      <div className="bg-white border-2 border-border rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Revenue This Month</p>
          <p className="text-3xl font-black text-[hsl(222,62%,28%)] mt-1">{formatZAR(stats.recentRevenue)}</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-[hsl(86,72%,45%)]/10 flex items-center justify-center">
          <ArrowUpRight className="w-6 h-6 text-[hsl(86,72%,38%)]" />
        </div>
      </div>
    </div>
  );
}

// ── Orders tab ────────────────────────────────────────────────────────────────
function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.set("status", filter);
      if (search.trim()) params.set("search", search.trim());
      const r = await fetch(`${API}/admin/orders?${params}`);
      setOrders(await r.json());
    } catch { setOrders([]); }
    setLoading(false);
  }, [filter, search]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`${API}/admin/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    load();
  };

  const deleteOrder = async (id: number) => {
    if (!confirm("Delete this order?")) return;
    await fetch(`${API}/admin/orders/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email, order #…"
          className="flex-1 min-w-[200px] border-2 border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[hsl(222,62%,28%)]"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border-2 border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[hsl(222,62%,28%)] bg-white"
        >
          {["all","pending","processing","shipped","completed","cancelled"].map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
        <button onClick={load} className="p-2.5 border-2 border-border rounded-xl hover:bg-muted transition-colors">
          <RefreshCw className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {loading ? <Loader /> : orders.length === 0 ? (
        <div className="bg-white border-2 border-border rounded-2xl py-16 text-center">
          <p className="text-muted-foreground">No orders found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border-2 border-border rounded-2xl overflow-hidden">
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-sm text-[hsl(222,62%,28%)]">{order.order_number}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLOURS[order.status] ?? "bg-gray-100"}`}>{order.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{order.customer_name} · {order.customer_email}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-black text-sm text-[hsl(222,62%,28%)]">{formatZAR(+order.total)}</p>
                  <p className="text-[10px] text-muted-foreground">{new Date(order.created_at).toLocaleDateString("en-ZA")}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${expanded === order.id ? "rotate-180" : ""}`} />
              </div>

              <AnimatePresence>
                {expanded === order.id && (
                  <motion.div
                    initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                    className="overflow-hidden border-t-2 border-border"
                  >
                    <div className="px-5 py-4 space-y-4">
                      {/* Customer info */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                        <div><p className="font-bold text-muted-foreground uppercase tracking-wide mb-1">Phone</p><p>{order.customer_phone || "—"}</p></div>
                        <div><p className="font-bold text-muted-foreground uppercase tracking-wide mb-1">Address</p><p>{[order.address, order.city, order.postal_code].filter(Boolean).join(", ") || "—"}</p></div>
                        <div><p className="font-bold text-muted-foreground uppercase tracking-wide mb-1">Date</p><p>{new Date(order.created_at).toLocaleString("en-ZA")}</p></div>
                      </div>

                      {/* Items */}
                      {order.items?.length > 0 && (
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">Items</p>
                          <div className="space-y-1">
                            {order.items.map((item: any, i: number) => (
                              <div key={i} className="flex items-center gap-2 text-xs">
                                {item.image && <img src={item.image} alt={item.name} className="w-7 h-7 rounded-lg object-cover" />}
                                <span className="flex-1">{item.name}</span>
                                <span className="text-muted-foreground">×{item.quantity}</span>
                                <span className="font-bold">{formatZAR(item.price * item.quantity)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        <select
                          defaultValue={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="border-2 border-border rounded-lg px-3 py-2 text-xs focus:outline-none bg-white"
                        >
                          {["pending","processing","shipped","completed","cancelled"].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 border-2 border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Inventory tab ─────────────────────────────────────────────────────────────
function Inventory() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editVals, setEditVals] = useState<{ stock_count: number; is_featured: boolean; is_active: boolean }>({
    stock_count: 0, is_featured: false, is_active: true,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/admin/inventory`);
      setInventory(await r.json());
    } catch { setInventory([]); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const startEdit = (row: any) => {
    setEditing(row.product_id);
    setEditVals({ stock_count: row.stock_count, is_featured: row.is_featured, is_active: row.is_active });
  };

  const saveEdit = async () => {
    if (!editing) return;
    await fetch(`${API}/admin/inventory/${editing}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editVals),
    });
    setEditing(null);
    load();
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-white border-2 border-border rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 border-b-2 border-border">
              <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-widest text-[hsl(222,62%,28%)]">Product</th>
              <th className="text-center px-4 py-3 text-xs font-black uppercase tracking-widest text-[hsl(222,62%,28%)]">Stock</th>
              <th className="text-center px-4 py-3 text-xs font-black uppercase tracking-widest text-[hsl(222,62%,28%)]">Featured</th>
              <th className="text-center px-4 py-3 text-xs font-black uppercase tracking-widest text-[hsl(222,62%,28%)]">Active</th>
              <th className="text-center px-4 py-3 text-xs font-black uppercase tracking-widest text-[hsl(222,62%,28%)]">Price</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {inventory.map((row, i) => {
              const prod = products.find((p) => p.id === row.product_id);
              const isEditing = editing === row.product_id;
              return (
                <tr key={row.product_id} className={`border-b border-border/50 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {prod && <img src={prod.image} alt={prod.name} className="w-9 h-9 rounded-lg object-cover" />}
                      <div>
                        <p className="font-semibold text-xs text-[hsl(222,62%,28%)] line-clamp-1">{prod?.name ?? `ID ${row.product_id}`}</p>
                        <p className="text-[10px] text-muted-foreground">{prod?.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {isEditing ? (
                      <input
                        type="number" min={0} value={editVals.stock_count}
                        onChange={(e) => setEditVals((v) => ({ ...v, stock_count: +e.target.value }))}
                        className="w-16 border-2 border-[hsl(222,62%,28%)] rounded-lg px-2 py-1 text-xs text-center focus:outline-none"
                      />
                    ) : (
                      <span className={`font-bold text-xs px-2 py-1 rounded-full ${row.stock_count < 10 ? "bg-red-100 text-red-700" : row.stock_count < 25 ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                        {row.stock_count}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {isEditing ? (
                      <input type="checkbox" checked={editVals.is_featured} onChange={(e) => setEditVals((v) => ({ ...v, is_featured: e.target.checked }))} className="w-4 h-4 accent-[hsl(86,72%,45%)]" />
                    ) : (
                      <span className={`text-xs font-bold ${row.is_featured ? "text-[hsl(86,72%,38%)]" : "text-muted-foreground"}`}>{row.is_featured ? "✓" : "—"}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {isEditing ? (
                      <input type="checkbox" checked={editVals.is_active} onChange={(e) => setEditVals((v) => ({ ...v, is_active: e.target.checked }))} className="w-4 h-4 accent-[hsl(86,72%,45%)]" />
                    ) : (
                      <span className={`text-xs font-bold ${row.is_active ? "text-green-600" : "text-red-500"}`}>{row.is_active ? "Active" : "Inactive"}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-xs font-bold text-[hsl(222,62%,28%)]">{prod ? formatZAR(prod.price) : "—"}</span>
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <div className="flex gap-1">
                        <button onClick={saveEdit} className="p-1.5 bg-[hsl(86,72%,45%)] text-white rounded-lg hover:bg-[hsl(86,72%,38%)]">
                          <Save className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setEditing(null)} className="p-1.5 border border-border rounded-lg hover:bg-muted">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => startEdit(row)} className="p-1.5 border border-border rounded-lg hover:bg-muted transition-colors">
                        <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Messages tab ──────────────────────────────────────────────────────────────
function Messages() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/admin/contacts`);
      setContacts(await r.json());
    } catch { setContacts([]); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`${API}/admin/contacts/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    load();
  };

  const deleteMsg = async (id: number) => {
    if (!confirm("Delete this message?")) return;
    await fetch(`${API}/admin/contacts/${id}`, { method: "DELETE" });
    load();
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-2">
      {contacts.length === 0 ? (
        <div className="bg-white border-2 border-border rounded-2xl py-16 text-center">
          <p className="text-muted-foreground text-sm">No messages yet</p>
        </div>
      ) : contacts.map((c) => (
        <div key={c.id} className="bg-white border-2 border-border rounded-2xl overflow-hidden">
          <div
            className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-muted/30 transition-colors"
            onClick={() => setExpanded(expanded === c.id ? null : c.id)}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-[hsl(222,62%,28%)]">{c.name}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${MSG_STATUS_COLOURS[c.status] ?? "bg-gray-100"}`}>{c.status}</span>
              </div>
              <p className="text-xs text-muted-foreground truncate">{c.email} {c.order_ref ? `· ${c.order_ref}` : ""}</p>
            </div>
            <p className="text-[10px] text-muted-foreground flex-shrink-0">{new Date(c.created_at).toLocaleDateString("en-ZA")}</p>
            <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${expanded === c.id ? "rotate-180" : ""}`} />
          </div>
          <AnimatePresence>
            {expanded === c.id && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden border-t-2 border-border">
                <div className="px-5 py-4 space-y-3">
                  <p className="text-sm leading-relaxed text-foreground">{c.message}</p>
                  <div className="flex flex-wrap gap-2">
                    {["unread","read","resolved"].map((s) => (
                      <button key={s} onClick={() => updateStatus(c.id, s)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border-2 transition-colors ${c.status === s ? "bg-[hsl(222,62%,28%)] text-white border-[hsl(222,62%,28%)]" : "border-border hover:bg-muted"}`}>
                        {s}
                      </button>
                    ))}
                    <button onClick={() => deleteMsg(c.id)} className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-red-600 border-2 border-red-200 rounded-lg hover:bg-red-50 transition-colors ml-auto">
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

// ── Analytics tab ─────────────────────────────────────────────────────────────
function Analytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try { setData(await (await fetch(`${API}/admin/analytics`)).json()); } catch { setData(null); }
      setLoading(false);
    })();
  }, []);

  if (loading) return <Loader />;

  const maxDaily = Math.max(...(data?.daily || []).map((d: any) => +d.count), 1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border-2 border-border rounded-2xl p-5">
          <p className="font-black text-[hsl(222,62%,28%)] text-sm mb-4">Daily Events (14 Days)</p>
          {data?.daily?.length > 0 ? (
            <div className="space-y-2">
              {data.daily.map((d: any) => <MiniBar key={d.day} label={d.day.slice(5)} value={+d.count} max={maxDaily} />)}
            </div>
          ) : <p className="text-sm text-muted-foreground text-center py-8">No data yet</p>}
        </div>

        <div className="bg-white border-2 border-border rounded-2xl p-5">
          <p className="font-black text-[hsl(222,62%,28%)] text-sm mb-4">Event Breakdown</p>
          {data?.eventCounts?.length > 0 ? (
            <div className="space-y-2">
              {data.eventCounts.map((e: any) => (
                <div key={e.event_type} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                  <span className="text-xs font-semibold text-foreground">{e.event_type}</span>
                  <span className="text-xs font-black text-[hsl(86,72%,38%)]">{e.count}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-muted-foreground text-center py-8">No events tracked yet</p>}
        </div>

        <div className="bg-white border-2 border-border rounded-2xl p-5 lg:col-span-2">
          <p className="font-black text-[hsl(222,62%,28%)] text-sm mb-4">Top Pages</p>
          {data?.pageViews?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {data.pageViews.map((p: any) => (
                <div key={p.page} className="bg-muted/40 rounded-xl px-3 py-2 flex items-center justify-between">
                  <span className="text-xs font-medium truncate">{p.page}</span>
                  <span className="text-xs font-black text-[hsl(222,62%,28%)] ml-2">{p.count}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-muted-foreground text-center py-8">No page views tracked yet</p>}
        </div>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function Loader() {
  return (
    <div className="flex items-center justify-center py-16">
      <RefreshCw className="w-6 h-6 text-muted-foreground animate-spin" />
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="bg-white border-2 border-red-200 rounded-2xl py-12 text-center">
      <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
      <p className="font-bold text-red-600 mb-1">Could not connect to API</p>
      <p className="text-xs text-muted-foreground mb-4">Make sure the API server is running on port 8080</p>
      <button onClick={onRetry} className="px-4 py-2 rounded-full btn-primary text-sm font-bold">Retry</button>
    </div>
  );
}

// ── Main admin panel ──────────────────────────────────────────────────────────
const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard",  label: "Dashboard",  icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: "orders",     label: "Orders",     icon: <ShoppingBag className="w-4 h-4" /> },
  { id: "inventory",  label: "Inventory",  icon: <Boxes className="w-4 h-4" /> },
  { id: "messages",   label: "Messages",   icon: <MessageSquare className="w-4 h-4" /> },
  { id: "analytics",  label: "Analytics",  icon: <BarChart3 className="w-4 h-4" /> },
];

export function AdminPanel() {
  const [tab, setTab] = useState<Tab>("dashboard");

  return (
    <div className="min-h-screen bg-muted/30 pt-16">
      {/* Header */}
      <div className="bg-[hsl(222,62%,28%)] border-b-4 border-[hsl(86,72%,45%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-[hsl(86,72%,45%)] flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-black text-white text-lg leading-tight">McSpencer Admin</p>
              <p className="text-white/50 text-xs">Internal management portal</p>
            </div>
            <div className="ml-auto hidden sm:flex items-center gap-1.5 text-[10px] font-bold bg-white/10 text-white/60 px-3 py-1.5 rounded-full border border-white/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[hsl(86,72%,65%)] animate-pulse" /> LIVE
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-hide">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-xl text-sm font-bold whitespace-nowrap transition-all ${
                  tab === t.id ? "bg-white text-[hsl(222,62%,28%)]" : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {tab === "dashboard"  && <Dashboard />}
            {tab === "orders"     && <Orders />}
            {tab === "inventory"  && <Inventory />}
            {tab === "messages"   && <Messages />}
            {tab === "analytics"  && <Analytics />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
