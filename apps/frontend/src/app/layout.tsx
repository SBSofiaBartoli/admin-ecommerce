import "./globals.css";

export const metadata = {
  title: "Admin Ecommerce",
  description: "Admin panel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-background">{children}</body>
    </html>
  );
}
