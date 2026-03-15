import React, { useState, useEffect } from "react";
import api from "../../services/api";
import "../../styles/Admin.css";

function OrdersAdmin() {
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const res  = await api.get(`/admin/orders/?user_id=${userId}`);
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setOrders(data);
    } catch (err) {
      console.error("Orders error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    const userId = localStorage.getItem("userId");
    try {
      await api.patch(`/admin/orders/${orderId}/`, {
        status: newStatus, user_id: userId
      });
      setOrders(prev =>
        prev.map(o => o.order_id === orderId ? { ...o, status: newStatus } : o)
      );
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const filtered = orders.filter(o =>
    String(o.order_id).includes(search) ||
    (o.user_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (s) => ({
    pending:    "#f59e0b",
    processing: "#1976d2",
    shipped:    "#5c6bc0",
    delivered:  "#2e7d32",
    cancelled:  "#c62828",
  }[s] || "#888");

  return (
    <>
      <h2>Orders</h2>

      <div style={{ marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="Search by order ID or customer..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: "9px 14px", borderRadius: "8px",
            border: "1px solid #e0e0e0", fontSize: "14px",
            width: "100%", maxWidth: "360px", outline: "none"
          }}
        />
      </div>

      {loading ? (
        <p><i className="fa-solid fa-spinner fa-spin"></i> Loading orders...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", color: "#aaa", padding: "30px" }}>
                  No orders found.
                </td>
              </tr>
            ) : filtered.map(order => (
              <tr key={order.order_id}>
                <td>#{order.order_id}</td>
                <td>{order.user_name || `User #${order.user_id}`}</td>
                <td>{new Date(order.order_date).toLocaleDateString("en-PH", {
                  month: "short", day: "numeric", year: "numeric"
                })}</td>
                <td>₱{parseFloat(order.total_amount).toFixed(2)}</td>
                <td>
                  <select
                    className="status-dropdown"
                    value={order.status}
                    onChange={e => updateStatus(order.order_id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <button className="view-btn" onClick={() => setSelected(order)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* VIEW MODAL */}
      {selected && (
        <div className="modal" style={{ display: "flex" }}>
          <div className="modal-content">
            <h3>Order #{selected.order_id}</h3>
            <p><strong>Customer:</strong> {selected.user_name}</p>
            <p><strong>Date:</strong> {new Date(selected.order_date).toLocaleDateString("en-PH", {
              year: "numeric", month: "long", day: "numeric"
            })}</p>
            <p><strong>Address:</strong> {selected.delivery_address}</p>
            <p>
              <strong>Status: </strong>
              <span style={{
                color: statusColor(selected.status),
                fontWeight: "600", textTransform: "capitalize"
              }}>
                {selected.status}
              </span>
            </p>
            <hr style={{ margin: "12px 0" }} />
            <strong>Items:</strong>
            {selected.order_details?.map(item => (
              <div key={item.order_detail_id} style={{
                display: "flex", justifyContent: "space-between",
                padding: "6px 0", fontSize: "14px",
                borderBottom: "1px solid #f5f5f5"
              }}>
                <span>{item.product_name} × {item.quantity}</span>
                <span>₱{parseFloat(item.subtotal).toFixed(2)}</span>
              </div>
            ))}
            <div style={{
              display: "flex", justifyContent: "space-between",
              marginTop: "12px", fontWeight: "700", fontSize: "16px"
            }}>
              <span>Total</span>
              <span style={{ color: "#c0607a" }}>
                ₱{parseFloat(selected.total_amount).toFixed(2)}
              </span>
            </div>
            <div className="modal-buttons" style={{ marginTop: "16px" }}>
              <button onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default OrdersAdmin;