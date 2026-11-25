export default function Navbar() {
  const store = process.env.NEXT_PUBLIC_STORE_NAME || "Honey House";
  return <header className="nav"><a className="brand" href="/">{store} 🍯</a><nav className="navlinks"><a href="/">หน้าแรก</a><a href="/products">สินค้า</a></nav></header>;
}
