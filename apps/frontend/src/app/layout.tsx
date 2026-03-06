import "./globals.css";

export const metadata = {
  title: "SmartStyle Admin",
  description: "Admin panel",
  icons: {
    icon: "/logo-favicon.png",
  },
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
