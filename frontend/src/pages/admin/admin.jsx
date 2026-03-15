import "../../styles/Admin.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

// ✅ all files are flat inside src/pages/admin/
import HomeAdmin       from "./home";
import OrdersAdmin     from "./orders";
import MenuAdmin       from "./menu";
import CategoriesAdmin from "./category";
import UsersAdmin      from "./users";
import SettingsAdmin   from "./settings";

function Admin() {
  const navigate          = useNavigate();
  const [page, setPage]   = useState("home");
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    document.body.classList.add("page-loaded");

    const stored = localStorage.getItem("user");
    if (!stored) { navigate("/login"); return; }

    const userData = JSON.parse(stored);
    if (userData.role !== "admin") {
      navigate("/homepage");
      return;
    }
    setAdmin(userData);

    return () => document.body.classList.remove("page-loaded");
  }, [navigate]);

  const handleLogout = async () => {
    try { await api.post("/auth/logout/"); } catch (e) {}
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const navItems = [
    { key: "home",       label: "Home",       icon: "fa-gauge" },
    { key: "orders",     label: "Orders",     icon: "fa-box" },
    { key: "menu",       label: "Menu",       icon: "fa-cake-candles" },
    { key: "categories", label: "Categories", icon: "fa-tags" },
    { key: "users",      label: "Users",      icon: "fa-users" },
    { key: "settings",   label: "Settings",   icon: "fa-gear" },
  ];

  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>SweetOrder</h2>

        <ul>
          {navItems.map(item => (
            <li
              key={item.key}
              onClick={() => setPage(item.key)}
              style={{
                background:  page === item.key ? "rgba(255,255,255,0.12)" : "transparent",
                borderLeft:  page === item.key ? "3px solid #c0607a" : "3px solid transparent",
                padding:     "12px 20px",
                cursor:      "pointer",
                display:     "flex",
                alignItems:  "center",
                gap:         "10px",
                transition:  "all 0.15s",
                listStyle:   "none",
              }}
            >
              <i
                className={`fa-solid ${item.icon}`}
                style={{
                  width: "16px",
                  color: page === item.key ? "#c0607a" : "rgba(255,255,255,0.6)"
                }}
              ></i>
              {item.label}
            </li>
          ))}
        </ul>

        {/* Admin info + logout at bottom */}
        <div style={{
          marginTop: "auto",
          padding: "16px",
          borderTop: "1px solid rgba(255,255,255,0.1)"
        }}>
          <p style={{ margin: "0 0 2px", fontSize: "13px",
                      fontWeight: "600", color: "#fff" }}>
            {admin?.name}
          </p>
          <p style={{ margin: "0 0 12px", fontSize: "11px",
                      color: "rgba(255,255,255,0.5)" }}>
            {admin?.email}
          </p>
          <button
            onClick={handleLogout}
            style={{
              width: "100%", padding: "9px",
              background: "rgba(255,255,255,0.08)",
              color: "#fff", border: "none",
              borderRadius: "6px", cursor: "pointer",
              fontSize: "13px", display: "flex",
              alignItems: "center",
              justifyContent: "center", gap: "6px"
            }}
          >
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="main">

        {/* TOPBAR */}
        <div className="topbar">
          <div className="topbar-title">
            {navItems.find(n => n.key === page)?.label || "Dashboard"}
          </div>
          <div className="admin-menu">
            <span className="admin-name">
              <i className="fa-solid fa-user" style={{ marginRight: "6px" }}></i>
              {admin?.name}
            </span>
          </div>
        </div>

        {/* PAGE CONTENT */}
        {/* PAGE CONTENT */}
<div className="content">
  <div style={{ display: page === "home"       ? "block" : "none" }}><HomeAdmin /></div>
  <div style={{ display: page === "orders"     ? "block" : "none" }}><OrdersAdmin /></div>
  <div style={{ display: page === "menu"       ? "block" : "none" }}><MenuAdmin /></div>
  <div style={{ display: page === "categories" ? "block" : "none" }}><CategoriesAdmin /></div>
  <div style={{ display: page === "users"      ? "block" : "none" }}><UsersAdmin /></div>
  <div style={{ display: page === "settings"   ? "block" : "none" }}><SettingsAdmin /></div>
</div>
        
      </div>
    </div>
  );
}

export default Admin;