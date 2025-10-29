// components/ShowLoginPopup.tsx
"use client";

import { usePopupStore } from "@/store/popupStore";
import { useEffect } from "react";

export default function ShowLoginPopup() {
  const showPopup = usePopupStore((state) => state.showPopup);

  useEffect(() => {
    // 👇 open login popup automatically when rendered
    showPopup("LOGIN");
  }, [showPopup]);

  return null; // nothing visible, just triggers the popup
}
