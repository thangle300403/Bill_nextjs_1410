export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-800 pt-10 pb-6">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Liên hệ */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              Liên hệ với chúng tôi
            </h4>
            <ul className="space-y-2 text-sm">
              <li>Phone: 0868389830</li>
              <li>
                <a href="thangle300403@gmail.com">
                  Mail: thangle300403@gmail.com
                </a>
              </li>
            </ul>
            <div className="flex space-x-4 mt-4 text-xl text-gray-600">
              <a href="https://www.facebook.com/HocLapTrinhWebTaiNha.ThayLoc">
                <i className="fab fa-facebook-f" />
              </a>
              <a href="https://twitter.com">
                <i className="fab fa-twitter" />
              </a>
              <a href="https://www.instagram.com">
                <i className="fab fa-instagram" />
              </a>
              <a href="https://www.pinterest.com/">
                <i className="fab fa-pinterest" />
              </a>
              <a href="https://www.youtube.com/">
                <i className="fab fa-youtube" />
              </a>
            </div>
          </div>

          {/* Bản tin */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Bản tin</h4>
            <p className="text-sm mb-4">
              Nhập Email của bạn để chúng tôi cung cấp thông tin nhanh nhất cho
              bạn về những sản phẩm mới!!
            </p>
            <form className="flex flex-col sm:flex-row items-stretch gap-2">
              <input
                type="text"
                name="email"
                placeholder="Nhập email của bạn.."
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
              >
                Gửi
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Back to top */}
      <div className="text-center mt-10 text-lg cursor-pointer text-gray-400 hover:text-black transition">
        ▲
      </div>
    </footer>
  );
}
