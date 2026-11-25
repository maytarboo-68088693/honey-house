import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { readRows } from "../lib/googleSheets";

export const dynamic = "force-dynamic";

async function getProducts() {
  try {
    const rows = await readRows("Products!A1:I1000");
    if (!rows.length) return [];
    const headers = rows[0].map(value => String(value).trim());
    return rows.slice(1).filter(row => row[0]).map(row => {
      const item = Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""]));
      return {
        sku: item.SKU,
        name: item["Product Name"],
        description: item.Description,
        unit: item.Unit,
        price: Number(item["Unit Price (THB)"] || 0),
        stock: Number(item["Stock Qty"] || 0),
        imagePath: item["Image Path"],
        active: String(item.Active).toLowerCase() !== "false"
      };
    }).filter(product => product.active);
  } catch (error) {
    console.error("Homepage products error:", error);
    return [];
  }
}

export default async function HomePage() {
  const products = await getProducts();
  return <><Navbar /><main><section className="hero"><h1>ความหวานจากธรรมชาติ<br/>ส่งตรงถึงบ้านคุณ</h1><p>เลือกชมน้ำผึ้งคุณภาพจาก Honey House พร้อมข้อมูลสินค้าที่เชื่อมต่อกับ Google Sheets</p><a className="btn" href="/products">เลือกชมสินค้า</a></section><section className="section"><h2>สินค้าของเรา</h2>{products.length ? <div className="grid">{products.slice(0,3).map(p => <ProductCard key={p.sku} product={p}/>)}</div> : <div className="notice">ยังโหลดสินค้าไม่ได้ กรุณาตรวจสอบการตั้งค่า Google Sheets</div>}</section></main><Footer /></>;
}
