"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TbCreditCard, TbLoader } from "react-icons/tb";
import { useRouter } from "next/navigation";

interface PaymentButtonProps {
  orderId: string;
  onSuccess?: () => void;
}

declare global {
  interface Window {
    snap: any;
  }
}

const PaymentButton = ({ orderId, onSuccess }: PaymentButtonProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Load Midtrans Snap Script
  useEffect(() => {
    const snapScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    // NOTE: Ganti client key sesuai env Anda
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";

    const scriptId = "midtrans-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = snapScriptUrl;
      script.setAttribute("data-client-key", clientKey);
      document.body.appendChild(script);
    }

    return () => {
      // Cleanup script jika perlu, tapi biasanya dibiarkan untuk SPA
    };
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");

      // 1. Panggil API Confirm untuk dapat Snap Token
      const res = await fetch(`/api/orders/${orderId}/confirm`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success && data.paymentToken) {
        // 2. Buka Snap Popup
        if (window.snap) {
          window.snap.pay(data.paymentToken, {
            onSuccess: function (result: any) {
              console.log("Payment success", result);
              if (onSuccess) onSuccess();
              router.refresh();
            },
            onPending: function (result: any) {
              console.log("Payment pending", result);
              router.refresh();
            },
            onError: function (result: any) {
              console.error("Payment error", result);
              alert("Pembayaran gagal");
            },
            onClose: function () {
              console.log(
                "Customer closed the popup without finishing the payment"
              );
            },
          });
        } else {
          alert("Gagal memuat sistem pembayaran. Silakan refresh halaman.");
        }
      } else {
        alert(data.message || "Gagal inisialisasi pembayaran");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Terjadi kesalahan saat memproses pembayaran");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-primary hover:bg-primary/90"
    >
      {loading ? (
        <>
          <TbLoader className="animate-spin mr-2" /> Memproses...
        </>
      ) : (
        <>
          <TbCreditCard className="mr-2" /> Bayar Sekarang
        </>
      )}
    </Button>
  );
};

export default PaymentButton;
