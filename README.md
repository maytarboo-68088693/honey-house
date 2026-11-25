# Honey House 🍯

ร้านขายน้ำผึ้งออนไลน์ สร้างด้วย Next.js และเชื่อมข้อมูลสินค้า/คำสั่งซื้อกับ Google Sheets

## โครงสร้าง

- `app/` หน้าเว็บไซต์และ API
- `components/` ส่วนประกอบหน้าเว็บ
- `lib/googleSheets.js` ตัวเชื่อม Google Sheets API
- `public/product-images/` รูปสินค้า
- `.env.example` ตัวอย่างค่าตั้งต้น

## เตรียม Google Sheets

ใช้ไฟล์เทมเพลตร้านน้ำผึ้งที่สร้างไว้ก่อนหน้า และคงชื่อแท็บกับหัวคอลัมน์ตามนี้:

- `Products`: `SKU`, `Product Name`, `Description`, `Unit`, `Unit Price (THB)`, `Stock Qty`, `Weight (g)`, `Image Path`, `Active`
- `Orders`: คอลัมน์ A-Q ตามเทมเพลต
- `Order_Items`: `Order ID`, `SKU`, `Product Name`, `Quantity`, `Unit Price (THB)`, `Discount (THB)`, `Line Total (THB)`, `Pick Status`, `Pack Status`
- `Packing_Shipping`: คอลัมน์ตามเทมเพลต

อัปโหลดไฟล์ Excel ไป Google Drive แล้วเปิดด้วย Google Sheets จากนั้นคัดลอก Spreadsheet ID จาก URL

## ตั้งค่า Google Sheets API

1. สร้างหรือเลือกโปรเจกต์ใน Google Cloud Console
2. เปิดใช้งาน Google Sheets API
3. สร้าง Service Account และดาวน์โหลด JSON key
4. แชร์ Google Sheet ให้ค่า `client_email` ของ Service Account เป็น Editor
5. แปลง JSON key เป็น Base64 แล้วตั้งค่า `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64`
6. ตั้งค่า `GOOGLE_SHEET_ID`

ห้าม commit ไฟล์ JSON key หรือ `.env.local` ขึ้น GitHub

## รันในเครื่อง

```bash
npm install
cp .env.example .env.local
npm run dev
```

กรอกค่าใน `.env.local` แล้วเปิด `http://localhost:3000`

## API

- `GET /api/products` อ่านสินค้า Active จากแท็บ Products
- `POST /api/orders` รับข้อมูลลูกค้าและรายการสินค้า แล้วบันทึกลง Orders และ Order_Items

ตัวอย่าง body สำหรับ `POST /api/orders`:

```json
{
  "customer": {
    "name": "ลูกค้าทดสอบ",
    "phone": "0800000000",
    "email": "customer@example.com",
    "address": "ที่อยู่จัดส่ง",
    "subdistrict": "แขวง/ตำบล",
    "district": "เขต/อำเภอ",
    "province": "กรุงเทพมหานคร",
    "postalCode": "10000"
  },
  "items": [{ "sku": "HNY-001", "quantity": 2 }],
  "shippingFee": 40,
  "note": ""
}
```

## Deploy บน Vercel

Import repository นี้ใน Vercel แล้วเพิ่ม Environment Variables: `GOOGLE_SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64` และ `NEXT_PUBLIC_STORE_NAME` จากนั้น Deploy

## หมายเหตุ

นี่เป็นโครงเริ่มต้นสำหรับงานเรียน/ทดสอบ ยังไม่มีระบบชำระเงินจริง ระบบตัดสต็อกอัตโนมัติ หรือระบบป้องกันคำสั่งซื้อซ้ำ ควรเพิ่มการตรวจสอบและทดสอบก่อนเปิดรับคำสั่งซื้อจริง
