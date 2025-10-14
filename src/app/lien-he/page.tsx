import { Metadata } from "next";
import Link from "next/link";
import ContactPageWrapper from "./ContactPageWrapper";

export const metadata: Metadata = {
  title: "Liên hệ",
};

export default function ContactPage() {
  return (
    <main id="maincontent" className="py-8">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap gap-2 items-center">
            <li>
              <Link href="/" className="hover:underline text-blue-600">
                Trang chủ
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-800 font-semibold">Liên hệ</li>
          </ol>
        </nav>

        {/* Contact Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Map */}
          <div className="w-full">
            <div className="relative w-full pb-[56.25%] overflow-hidden rounded-lg shadow">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.3093684006894!2d106.67651307488161!3d10.78760065898787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f2a557d8f39%3A0x8f1f3aee976c4894!2zMzE2LzE5IMSQLiBMw6ogVsSDbiBT4bu5LCBQaMaw4budbmcgMTQsIFF14bqtbiAzLCBI4buTIENow60gTWluaCwgVmlldG5hbQ!5e0!3m2!1sen!2s!4v1759206344820!5m2!1sen!2s"
                className="absolute top-0 left-0 w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* Contact Info Form */}
          <div className="w-full">
            <h4 className="text-xl font-semibold mb-4 text-gray-900">
              Thông tin liên hệ
            </h4>
            <ContactPageWrapper />
          </div>
        </div>
      </div>
    </main>
  );
}
