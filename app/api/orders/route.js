import { NextResponse } from "next/server";
import { appendRows, readRows } from "../../../lib/googleSheets";

export const dynamic = "force-dynamic";
const clean = value => String(value ?? "").trim();

export async function POST(request) {
  try {
    const body = await request.json();
    const customer = body.customer || {};
    const items = Array.isArray(body.items) ? body.items : [];
    if (!clean(customer.name) || !clean(customer.phone) || !clean(customer.address) || items.length === 0) {
      return NextResponse.json({ error: "กรุณากรอกชื่อ เบอร์โทร ที่อยู่ และรายการสินค้าให้ครบ" }, { status: 400 });
    }

    const productRows = await readRows("Products!A1:I1000");
    if (!productRows.length) return NextResponse.json({ error: "ไม่พบข้อมูลสินค้าในชีต Products" }, { status: 400 });
    const headers = productRows[0].map(value => String(value).trim());
    const productMap = new Map(productRows.slice(1).map(row => {
      const p = Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""]));
      return [String(p.SKU), p];
    }));

    const normalized = [];
    for (const item of items) {
      const sku = clean(item.sku);
      const quantity = Number(item.quantity);
      const product = productMap.get(sku);
      if (!product || String(product.Active).toLowerCase() === "false" || !Number.isInteger(quantity) || quantity < 1) {
        return NextResponse.json({ error: `รายการสินค้า ${sku || "ไม่ทราบ SKU"} ไม่ถูกต้อง` }, { status: 400 });
      }
      const stock = Number(product["Stock Qty"] || 0);
      if (quantity > stock) return NextResponse.json({ error: `สินค้า ${sku} มีสต็อกไม่เพียงพอ` }, { status: 400 });
      normalized.push({ sku, name: product["Product Name"], quantity, price: Number(product["Unit Price (THB)"] || 0) });
    }

    const orderId = `ORD-${Date.now()}`;
    const subtotal = normalized.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const shippingFee = Math.max(0, Number(body.shippingFee || 0));
    const orderRow = [orderId, new Date().toISOString(), clean(customer.name), clean(customer.phone), clean(customer.email), clean(customer.address), clean(customer.subdistrict), clean(customer.district), clean(customer.province), clean(customer.postalCode), "รอชำระเงิน", "รอจัดส่ง", subtotal, shippingFee, subtotal + shippingFee, "", clean(body.note)];
    const itemRows = normalized.map(item => [orderId, item.sku, item.name, item.quantity, item.price, 0, item.quantity * item.price, "รอหยิบ", "รอแพ็ก"]);

    await appendRows("Orders!A:Q", [orderRow]);
    await appendRows("Order_Items!A:I", itemRows);
    return NextResponse.json({ ok: true, orderId, subtotal, shippingFee, total: subtotal + shippingFee }, { status: 201 });
  } catch (error) {
    console.error("Create order API error:", error);
    return NextResponse.json({ error: "บันทึกคำสั่งซื้อไม่สำเร็จ กรุณาตรวจสอบ Google Sheets API และสิทธิ์การแชร์ชีต" }, { status: 500 });
  }
}
