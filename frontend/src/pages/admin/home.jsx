import React, { useState, useEffect } from "react";
import api from "../../services/api";
import "../../styles/Admin.css";

function HomeAdmin() {
  const [stats, setStats]               = useState({
    totalOrders: 0, pendingOrders: 0,
    totalProducts: 0, totalUsers: 0, revenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const [ordersRes, productsRes, usersRes] = await Promise.all([
        api.get(`/admin/orders/?user_id=${userId}`),
        api.get("/products/"),
        api.get(`/admin/users/?user_id=${userId}`),
      ]);

      const orders   = Array.isArray(ordersRes.data)
        ? ordersRes.data : ordersRes.data.results || [];
      const products = Array.isArray(productsRes.data)
        ? productsRes.data : productsRes.data.results || [];
      const users    = Array.isArray(usersRes.data)
        ? usersRes.data : usersRes.data.results || [];

      const revenue = orders.reduce(
        (sum, o) => sum + parseFloat(o.total_amount || 0), 0
      );

      setStats({
        totalOrders:   orders.length,
        pendingOrders: orders.filter(o => o.status === "pending").length,
        totalProducts: products.length,
        totalUsers:    users.length,
        revenue,
      });
      setRecentOrders(orders.slice(0, 5));
    } catch (err) {
      console.error("Stats error:", err);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (s) => ({
    pending:    "#f59e0b",
    processing: "#1976d2",
    shipped:    "#5c6bc0",
    delivered:  "#2e7d32",
    cancelled:  "#c62828",
  }[s] || "#888");

  const cards = [
    { label: "Total Orders",  value: stats.totalOrders,               icon: "fa-box",          color: "#4f46e5", bg: "#eef2ff" },
    { label: "Pending",       value: stats.pendingOrders,             icon: "fa-clock",         color: "#f59e0b", bg: "#fff8e1" },
    { label: "Products",      value: stats.totalProducts,             icon: "fa-cake-candles",  color: "#c0607a", bg: "#fdf0f3" },
    { label: "Customers",     value: stats.totalUsers,                icon: "fa-users",         color: "#059669", bg: "#ecfdf5" },
    { label: "Revenue",       value: `₱${stats.revenue.toFixed(2)}`,  icon: "fa-peso-sign",     color: "#0891b2", bg: "#ecfeff" },
  ];

  return (
    <>
      <h2>Dashboard</h2>

      <div className="cards">
        {cards.map(card => (
          <div className="card" key={card.label} style={{ background: card.bg }}>
            <i className={`fa-solid ${card.icon}`}
               style={{ fontSize: "22px", color: card.color, marginBottom: "8px" }}
            ></i>
            <h3>{card.label}</h3>
            <p style={{ color: card.color }}>
              {loading ? "..." : card.value}
            </p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "28px" }}>
        <h3 style={{ marginBottom: "14px", color: "#333" }}>Recent Orders</h3>

        {loading ? (
          <p style={{ color: "#888" }}>
            <i className="fa-solid fa-spinner fa-spin"></i> Loading...
          </p>
        ) : recentOrders.length === 0 ? (
          <p style={{ color: "#aaa" }}>No orders yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.order_id}>
                  <td>#{order.order_id}</td>
                  <td>{order.user_name || `User #${order.user_id}`}</td>
                  <td>{new Date(order.order_date).toLocaleDateString("en-PH", {
                    month: "short", day: "numeric", year: "numeric"
                  })}</td>
                  <td>₱{parseFloat(order.total_amount).toFixed(2)}</td>
                  <td>
                    <span style={{
                      padding: "3px 10px", borderRadius: "20px",
                      fontSize: "12px", fontWeight: "600",
                      color: statusColor(order.status),
                      background: statusColor(order.status) + "20",
                      textTransform: "capitalize"
                    }}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default HomeAdmin;