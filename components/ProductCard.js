export default function ProductCard({ product }) {
  return <article className="card">
    {product.imagePath ? <img className="product-image" src={product.imagePath} alt={product.name} /> : <div className="product-placeholder">🍯</div>}
    <div className="card-body"><h3>{product.name}</h3><p className="muted">{product.description}</p>
      <p className="price">{Number(product.price || 0).toLocaleString("th-TH")} บาท / {product.unit || "ชิ้น"}</p>
      <p className="muted">รหัสสินค้า: {product.sku} · คงเหลือ {product.stock}</p></div>
  </article>;
}
