"use client";

import { PayPalButtons } from "@paypal/react-paypal-js";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// Buat interface agar tidak pakai 'any'
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface PayPalSectionProps {
  total: string;
  items: CartItem[];
}

export default function PayPalSection({ total, items }: PayPalSectionProps) {
  const router = useRouter();

  return (
    <div className="pixie-glass p-8 border border-white/5 rounded-3xl">
      <PayPalButtons
        style={{ layout: "vertical", color: "blue", shape: "pill" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                amount: {
                  currency_code: "USD",
                  value: total,
                },
              },
            ],
          });
        }}
        onApprove={async (data) => {
          const loadingToast = toast.loading("Processing payment...");
          
          try {
            // Kirim orderID ke API kita di server
            const response = await fetch("/api/checkout/paypal", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                orderID: data.orderID,
                cartItems: items,
              }),
            });

            const result = await response.json();

            if (result.status === "success") {
              toast.success("Payment Received! Check your email.", { id: loadingToast });
              // Arahkan ke halaman sukses/download
              router.push(`/success?orderId=${result.orderId}`);
            } else {
              throw new Error(result.error || "Capture failed");
            }
          } catch (error) {
            console.error("PayPal Capture Error:", error);
            toast.error("Payment failed. Please contact support.", { id: loadingToast });
          }
        }}
        onError={(err) => {
          console.error("PayPal SDK Error:", err);
          toast.error("PayPal system error. Please try again.");
        }}
      />
    </div>
  );
}