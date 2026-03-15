import React, { useState, useEffect, useCallback, memo } from "react";
import api from "../../services/api";
import "../../styles/Admin.css";

// ✅ Memoized row — image won't reload unless THIS product changes
const ProductRow = memo(({ product, index, onEdit, onDelete }) => {
  const [imgSrc, setImgSrc] = useState(
    product.image_url || "/assets/placeholder.jpg"
  );

  // ✅ update image if product.image_url changes after edit
  useEffect(() => {
    if (product.image_url) setImgSrc(product.image_url);
  }, [product.image_url]);

  return (
    <tr>
      <td>{index + 1}</td>
      <td>
        <img
          src={imgSrc}
          className="product-img"
          alt={product.product_name}
          loading="lazy"
          onError={() => {
            setImgSrc("/assets/placeholder.jpg");
          }}
        />
      </td>
      <td>
        <strong>{product.product_name}</strong><br />
        <small style={{ color: "#888", textTransform: "capitalize" }}>
          {product.category}
        </small><br />
        <small style={{ color: "#aaa" }}>
          {product.description?.slice(0, 40)}...
        </small>
      </td>
      <td>₱{parseFloat(product.price).toFixed(2)}</td>
      <td>{product.stock}</td>
      <td>
        <span style={{
          padding: "3px 10px", borderRadius: "20px", fontSize: "12px",
          background: product.is_available ? "#e8f5e9" : "#ffebee",
          color:      product.is_available ? "#2e7d32" : "#c62828",
          fontWeight: "600"
        }}>
          {product.is_available ? "Available" : "Hidden"}
        </span>
      </td>
      <td>
        <button className="edit"   onClick={() => onEdit(product)}>Edit</button>
        <button className="delete" onClick={() => onDelete(product.product_id)}>Delete</button>
      </td>
    </tr>
  );
});

function MenuAdmin() {
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [category, setCategory]   = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem]   = useState(null);
  const [preview, setPreview]     = useState(null);
  const [saving, setSaving]       = useState(false);

  const [form, setForm] = useState({
    product_name: "", description: "",
    category: "birthday", price: "",
    stock: 10, is_available: true, image: null
  });

  const fetchProducts = useCallback(async () => {
    const userId = localStorage.getItem("userId")?.trim();
    try {
      const res  = await api.get(`/admin/products/?user_id=${userId}`);
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setProducts(data);
    } catch {
      try {
        const res  = await api.get("/products/");
        const data = Array.isArray(res.data) ? res.data : res.data.results || [];
        setProducts(data);
      } catch (e) {
        console.error("Products error:", e);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const openAdd = useCallback(() => {
    setEditItem(null);
    setForm({
      product_name: "", description: "", category: "birthday",
      price: "", stock: 10, is_available: true, image: null
    });
    setPreview(null);
    setShowModal(true);
  }, []);

  const openEdit = useCallback((product) => {
    setEditItem(product);
    setForm({
      product_name: product.product_name,
      description:  product.description,
      category:     product.category,
      price:        product.price,
      stock:        product.stock,
      is_available: product.is_available,
      image:        null,
    });
    setPreview(product.image_url || null);
    setShowModal(true);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };
  const handleSave = async () => {
  if (!form.product_name || !form.price) {
    alert("Product name and price are required.");
    return;
  }

  setSaving(true);
  const userId  = localStorage.getItem("userId")?.trim();
  const payload = new FormData();
  payload.append("product_name", form.product_name);
  payload.append("description",  form.description);
  payload.append("category",     form.category);
  payload.append("price",        form.price);
  payload.append("stock",        form.stock);
  payload.append("is_available", form.is_available);
  payload.append("user_id",      userId);
  if (form.image) payload.append("image", form.image);

  try {
    if (editItem) {
      const res = await api.patch(
        `/admin/products/${editItem.product_id}/`, payload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      // ✅ update only this product in state
      setProducts(prev =>
        prev.map(p => p.product_id === editItem.product_id ? res.data : p)
      );
    } else {
      const res = await api.post(
        "/admin/products/", payload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      // ✅ add new product to top of list
      setProducts(prev => [res.data, ...prev]);
    }
    setShowModal(false);   // ✅ close modal

  } catch (err) {
    console.error("Save error:", err.response?.data || err);
    alert("Failed to save product: " + (err.response?.data?.error || "Check console"));
  } finally {
    setSaving(false);
  }
};
 

  const handleDelete = useCallback(async (productId) => {
    if (!window.confirm("Delete this product?")) return;
    const userId = localStorage.getItem("userId")?.trim();
    try {
      await api.delete(`/admin/products/${productId}/`, {
        data: { user_id: userId }
      });
      setProducts(prev => prev.filter(p => p.product_id !== productId));
    } catch {
      alert("Failed to delete product.");
    }
  }, []);

  const filtered = products.filter(p => {
    const matchSearch   = p.product_name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "all" || p.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <>
      <h2>Cake Menu</h2>

      <div className="menu-controls">
        <button className="add-btn" onClick={openAdd}>+ Add Cake</button>
        <input
          type="text"
          placeholder="Search cake..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="birthday">Birthday</option>
          <option value="wedding">Wedding</option>
          <option value="anniversary">Anniversary</option>
          <option value="cupcake">Cupcakes</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {loading ? (
        <p><i className="fa-solid fa-spinner fa-spin"></i> Loading...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Product</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center",
                                         color: "#aaa", padding: "30px" }}>
                  No products found.
                </td>
              </tr>
            ) : filtered.map((product, i) => (
              // ✅ ProductRow is memoized — won't re-render unless its own data changes
              <ProductRow
                key={product.product_id}
                product={product}
                index={i}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>
      )}

      {/* Modal only mounts when showModal=true, unmounts when false */}
      {showModal && (
        <div className="modal" style={{ display: "flex" }}>
          <div className="modal-content">
            <h3>{editItem ? "Edit Cake" : "Add Cake"}</h3>

            <label>Cake Name</label>
            <input
              type="text" placeholder="Cake Name"
              value={form.product_name}
              onChange={e => setForm(p => ({ ...p, product_name: e.target.value }))}
            />

            <label>Description</label>
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            />

            <label>Category</label>
            <select
              value={form.category}
              onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
            >
              <option value="birthday">Birthday</option>
              <option value="wedding">Wedding</option>
              <option value="anniversary">Anniversary</option>
              <option value="cupcake">Cupcakes</option>
              <option value="custom">Custom</option>
            </select>

            <label>Price (₱)</label>
            <input
              type="number" placeholder="Price"
              value={form.price}
              onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
            />

            <label>Stock</label>
            <input
              type="number" placeholder="Stock"
              value={form.stock}
              onChange={e => setForm(p => ({ ...p, stock: e.target.value }))}
            />

            <label style={{ display: "flex", alignItems: "center",
                            gap: "8px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={form.is_available}
                onChange={e => setForm(p => ({ ...p, is_available: e.target.checked }))}
              />
              Available to customers
            </label>

            <label style={{ marginTop: "10px" }}>Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />

            {preview && (
              <img
                src={preview}
                alt="preview"
                className="preview-img"
                style={{ marginTop: "10px" }}
              />
            )}

            <div className="modal-buttons">
              <button className="save-btn" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MenuAdmin;