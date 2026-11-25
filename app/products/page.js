import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import { readRows } from "../../lib/googleSheets";

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
    console.error("Products page error:", error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();
  return <><Navbar /><main><div className="page-title"><h1>สินค้าทั้งหมด</h1><p className="muted">ข้อมูลสินค้าอ่านจาก Google Sheets แท็บ Products</p></div><section className="section">{products.length ? <div className="grid">{products.map(p => <ProductCard key={p.sku} product={p}/>)}</div> : <div className="notice">ไม่พบข้อมูลสินค้า ตรวจสอบชื่อแท็บ Products และการตั้งค่า</div>}</section></main><Footer /></>;
}
