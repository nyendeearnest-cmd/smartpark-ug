import "./globals.css";
import { Toaster } from "sonner";

<Toaster richColors position="top-right" />

export const metadata = {
  title: "SmartPark UG",
  description: "Parking Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}