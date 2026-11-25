import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

async function getProducts() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/products`, { cache: "no-store" });
    if (!response.ok) return [];
    return (await response.json()).products || [];
  } catch { return []; }
}

export default async function HomePage() {
  const products = await getProducts();
  return <><Navbar /><main><section className="hero"><h1>ความหวานจากธรรมชาติ<br/>ส่งตรงถึงบ้านคุณ</h1><p>เลือกชมน้ำผึ้งคุณภาพจาก Honey House พร้อมข้อมูลสินค้าที่เชื่อมต่อกับ Google Sheets</p><a className="btn" href="/products">เลือกชมสินค้า</a></section><section className="section"><h2>สินค้าของเรา</h2>{products.length ? <div className="grid">{products.slice(0,3).map(p => <ProductCard key={p.sku} product={p}/>)}</div> : <div className="notice">ยังโหลดสินค้าไม่ได้ กรุณาตรวจสอบการตั้งค่า Google Sheets</div>}</section></main><Footer /></>;
}
