/* eslint-disable @next/next/no-css-tags */
// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosNonAuthInstanceNest } from "@/lib/utils";
import { Category } from "@/types/category";
import ChatBotWidget from "@/components/chatBot/ChatBotWidget";

export const metadata: Metadata = {
  title: "Thangles Godashop",
  description: "Web site created using Next.js App Router",
};

interface CategoryListResponse {
  items: Category[];
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const resCategory = await axiosNonAuthInstanceNest.get<CategoryListResponse>(
    `/categories`
  );

  const categories = resCategory.data.items;

  return (
    <html lang="vi">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/css/style.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="">
        <Header categories={categories} />
        <ToastContainer />
        {children}
        <Footer />
        <ChatBotWidget />
      </body>
    </html>
  );
}
