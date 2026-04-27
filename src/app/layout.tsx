import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "Log Dog - Painel de Vendas | Distribuidora de Cosméticos Pet",
  description: "Sistema interno de vendas inteligente para distribuidora de cosméticos pet. Gerencie clientes, campanhas e aumente seus pedidos.",
  keywords: "vendas, pet, cosméticos, distribuidora, CRM, painel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
