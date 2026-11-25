import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";

async function getProducts() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/products`, { cache: "no-store" });
    if (!response.ok) return [];
    return (await response.json()).products || [];
  } catch { return []; }
}

export default async function ProductsPage() {
  const products = await getProducts();
  return <><Navbar /><main><div className="page-title"><h1>สินค้าทั้งหมด</h1><p className="muted">ข้อมูลสินค้าอ่านจาก Google Sheets แท็บ Products</p></div><section className="section">{products.length ? <div className="grid">{products.map(p => <ProductCard key={p.sku} product={p}/>)}</div> : <div className="notice">ไม่พบข้อมูลสินค้า ตรวจสอบชื่อแท็บ Products และการตั้งค่า</div>}</section></main><Footer /></>;
}
