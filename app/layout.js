import "./globals.css";

export const metadata = {
  title: "Honey House | น้ำผึ้งแท้",
  description: "ร้านขายน้ำผึ้งออนไลน์"
};

export default function RootLayout({ children }) {
  return <html lang="th"><body>{children}</body></html>;
}
