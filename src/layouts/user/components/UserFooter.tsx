import { Link } from "react-router";
import { Plane, Facebook, Instagram, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#f5f5f5] text-gray-700 pt-10 pb-8 border-t border-gray-200">
      <div className="px-4">
        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
              <Plane className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-gray-900">TourEase</span>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto sm:mx-0">
              Discover unforgettable journeys with comfort and ease.
            </p>

            {/* Social */}
            <div className="flex justify-center sm:justify-start items-center gap-3 mt-4">
              <a
                href="#"
                className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-100 transition"
              >
                <Facebook className="h-4 w-4 text-gray-700" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-100 transition"
              >
                <Instagram className="h-4 w-4 text-gray-700" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-3 text-center sm:text-left">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-center sm:text-left">
              <li>
                <Link to="/" className="hover:text-primary transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/trips" className="hover:text-primary transition">
                  Trips
                </Link>
              </li>
              <li>
                <Link
                  to="/destinations"
                  className="hover:text-primary transition"
                >
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="hover:text-primary transition">
                  Bookings
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-3 text-center sm:text-left">
              Support
            </h3>
            <ul className="space-y-2 text-sm text-center sm:text-left">
              <li>
                <a className="hover:text-primary transition" href="#">
                  FAQs
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition" href="#">
                  Customer Support
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition" href="#">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition" href="#">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-3 text-center sm:text-left">
              Contact Us
            </h3>

            <div className="flex justify-center sm:justify-start items-center gap-3 mb-3">
              <Phone className="h-5 w-5 text-primary" />
              <span className="text-sm text-gray-600">+20 123 456 7890</span>
            </div>

            <div className="flex justify-center sm:justify-start items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <span className="text-sm text-gray-600">
                support@tourease.com
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-300 mt-10 pt-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} TourEase. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
