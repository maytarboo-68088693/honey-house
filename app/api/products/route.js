import { NextResponse } from "next/server";
import { readRows } from "../../../lib/googleSheets";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await readRows("Products!A1:I1000");
    if (!rows.length) return NextResponse.json({ products: [] });
    const headers = rows[0].map(value => String(value).trim());
    const products = rows.slice(1).filter(row => row[0]).map(row => {
      const item = Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""]));
      return {
        sku: item.SKU,
        name: item["Product Name"],
        description: item.Description,
        unit: item.Unit,
        price: Number(item["Unit Price (THB)"] || 0),
        stock: Number(item["Stock Qty"] || 0),
        weight: Number(item["Weight (g)"] || 0),
        imagePath: item["Image Path"],
        active: String(item.Active).toLowerCase() !== "false"
      };
    }).filter(product => product.active);
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json({ error: "Unable to read products from Google Sheets." }, { status: 500 });
  }
}
