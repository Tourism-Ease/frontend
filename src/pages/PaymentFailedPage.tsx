import { FaTimesCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg border p-8 text-center">

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-4 rounded-full">
            <FaTimesCircle className="text-red-600 w-12 h-12" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900">Payment Failed</h1>

        {/* Message */}
        <p className="text-gray-600 mt-3">
          Unfortunately, your payment could not be processed.
          Please try again later or use another payment method.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex flex-col gap-3">

          <Button
            className="w-full"
            onClick={() => (window.location.href = "/contact")}
          >
            Contact Support
          </Button>

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => (window.location.href = "/")}
          >
            Go Back Home
          </Button>
        </div>

        {/* Small hint */}
        <p className="text-xs text-gray-400 mt-4">
          If this issue continues, consider contacting customer support.
        </p>
      </div>
    </div>
  );
}
