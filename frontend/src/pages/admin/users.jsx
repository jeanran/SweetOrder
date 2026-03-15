import React, { useState, useEffect } from "react";
import api from "../../services/api";
import "../../styles/Admin.css";

function UsersAdmin() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const res  = await api.get(`/admin/users/?user_id=${userId}`);
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setUsers(data);
    } catch (err) {
      console.error("Users error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (targetId) => {
    if (!window.confirm("Delete this user?")) return;
    const userId = localStorage.getItem("userId");
    try {
      await api.delete(`/admin/users/${targetId}/`, {
        data: { user_id: userId }
      });
      setUsers(prev => prev.filter(u => u.user_id !== targetId));
    } catch (err) {
      alert("Failed to delete user.");
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <h2>Users</h2>

      <div style={{ marginBottom: "16px" }}>
        <input
          type="text" placeholder="Search by name or email..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{
            padding: "9px 14px", borderRadius: "8px",
            border: "1px solid #e0e0e0", fontSize: "14px",
            width: "100%", maxWidth: "360px", outline: "none"
          }}
        />
      </div>

      {loading ? (
        <p><i className="fa-solid fa-spinner fa-spin"></i> Loading users...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", color: "#aaa", padding: "30px" }}>
                  No users found.
                </td>
              </tr>
            ) : filtered.map((user, i) => (
              <tr key={user.user_id}>
                <td>{i + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span style={{
                    padding: "3px 10px", borderRadius: "20px", fontSize: "12px",
                    background: user.role === "admin" ? "#eef2ff" : "#fdf0f3",
                    color: user.role === "admin" ? "#4f46e5" : "#c0607a",
                    fontWeight: "600", textTransform: "capitalize"
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ fontSize: "13px", color: "#888" }}>
                  {new Date(user.created_at).toLocaleDateString("en-PH", {
                    month: "short", day: "numeric", year: "numeric"
                  })}
                </td>
                <td>
                  <button
                    className="delete"
                    onClick={() => handleDelete(user.user_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default UsersAdmin;