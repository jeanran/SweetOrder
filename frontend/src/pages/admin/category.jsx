import React from "react";
import "../../styles/Admin.css";

function CategoriesAdmin() {
  const categories = [
    { id: 1, name: "Birthday Cakes",    count: 0, description: "Cakes for birthday celebrations." },
    { id: 2, name: "Wedding Cakes",     count: 3, description: "Elegant cakes for weddings." },
    { id: 3, name: "Anniversary Cakes", count: 2, description: "Cakes for anniversaries." },
    { id: 4, name: "Cupcakes",          count: 5, description: "Small single-serving cakes." },
    { id: 5, name: "Custom Cakes",      count: 1, description: "Made-to-order custom designs." },
  ];

  return (
    <>
      <h2>Categories</h2>

      <p style={{ color: "#888", fontSize: "13px", marginBottom: "16px" }}>
        Categories are managed via Django Admin. Shown here for reference.
      </p>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Category Name</th>
              <th>Products</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id}>
                <td>{cat.id}</td>
                <td><strong>{cat.name}</strong></td>
                <td>{cat.count}</td>
                <td style={{ color: "#888", fontSize: "13px" }}>{cat.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default CategoriesAdmin;