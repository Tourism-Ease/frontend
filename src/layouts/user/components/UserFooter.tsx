import { Link } from "react-router";
import { Plane, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#f5f5f5] text-gray-500 pt-10 pb-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
              <Plane className="h-6 w-6 text-gray-800" />
              <span className="text-xl font-extrabold uppercase tracking-widest text-gray-800">Safarny</span>
            </div>

            <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto sm:mx-0">
              Discover unforgettable journeys with comfort and ease.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-800 font-semibold text-lg mb-3 text-center sm:text-left">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-center sm:text-left">
              <li>
                <Link to="/" className="hover:text-gray-800 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/trips" className="hover:text-gray-800 transition">
                  Trips
                </Link>
              </li>
              <li>
                <Link
                  to="/packages"
                  className="hover:text-gray-800 transition"
                >
                  Packages
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gray-800 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-gray-800 font-semibold text-lg mb-3 text-center sm:text-left">
              Support
            </h3>
            <ul className="space-y-2 text-sm text-center sm:text-left">
              <li>
                <a className="hover:text-gray-800 transition" href="#">
                  FAQs
                </a>
              </li>
              <li>
                <a className="hover:text-gray-800 transition" href="#">
                  Customer Support
                </a>
              </li>
              <li>
                <a className="hover:text-gray-800 transition" href="#">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a className="hover:text-gray-800 transition" href="#">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gray-800 font-semibold text-lg mb-3 text-center sm:text-left">
              Contact Us
            </h3>

            <div className="flex justify-center sm:justify-start items-center gap-3 mb-3">
              <Phone className="h-5 w-5 text-primary" />
              <span className="text-sm text-gray-600">+20 123 456 7890</span>
            </div>

            <div className="flex justify-center sm:justify-start items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <span className="text-sm text-gray-600">
                safarnycompany@gmail.com
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-300 mt-10 pt-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Safarny. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
