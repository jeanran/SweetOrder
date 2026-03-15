import React, { useState } from "react";
import "../../styles/Admin.css";

function SettingsAdmin() {
  const [form, setForm] = useState({
    shopName:    "SweetOrder",
    shopEmail:   "",
    shopPhone:   "",
    deliveryFee: "50",
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
  };

  const saveSettings = () => {
    localStorage.setItem("adminSettings", JSON.stringify(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <h2>Site Settings</h2>

      {saved && (
        <div style={{
          background: "#e8f5e9", color: "#2e7d32", padding: "12px",
          borderRadius: "8px", marginBottom: "16px", fontSize: "14px"
        }}>
          <i className="fa-solid fa-check-circle"></i> Settings saved!
        </div>
      )}

      <div className="settings-container">

        <div className="settings-section">
          <h3>Store Information</h3>

          <label>Shop Name</label>
          <input
            name="shopName" type="text"
            value={form.shopName} onChange={handleChange}
          />

          <label>Shop Email</label>
          <input
            name="shopEmail" type="email"
            placeholder="example@email.com"
            value={form.shopEmail} onChange={handleChange}
          />

          <label>Contact Number</label>
          <input
            name="shopPhone" type="text"
            placeholder="+63 912 345 6789"
            value={form.shopPhone} onChange={handleChange}
          />
        </div>

        <div className="settings-section">
          <h3>Delivery Settings</h3>

          <label>Delivery Fee (₱)</label>
          <input
            name="deliveryFee" type="number"
            value={form.deliveryFee} onChange={handleChange}
          />
        </div>

        <div className="settings-section">
          <h3>Branding</h3>
          <label>Upload Store Logo</label>
          <input type="file" accept="image/*" />
        </div>

        <div className="settings-actions">
          <button className="save-btn" onClick={saveSettings}>
            Save Settings
          </button>
        </div>

      </div>
    </>
  );
}

export default SettingsAdmin;