// app/lien-he/ContactPageWrapper.tsx
"use client";

import dynamic from "next/dynamic";

const ContactForm = dynamic(() => import("@/components/ContactForm"), {
  ssr: false,
});

export default function ContactPageWrapper() {
  return <ContactForm />;
}
