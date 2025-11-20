"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { TbAlertTriangle } from "react-icons/tb";

interface DisputeFormProps {
  orderId: string;
}

const DisputeForm = ({ orderId }: DisputeFormProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (reason.length < 50) {
      setError("Alasan minimal 50 karakter");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`/api/disputes/order/${orderId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });

      const data = await response.json();

      if (data.success) {
        setOpen(false);
        router.refresh();
      } else {
        setError(data.error || "Gagal membuka sengketa");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="destructive" size="sm">
          <TbAlertTriangle className="mr-2 h-4 w-4" />
          Buka Sengketa
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Buka Sengketa</DrawerTitle>
          <DrawerDescription>
            Jelaskan masalah yang Anda alami dengan pesanan ini
          </DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="px-4 pb-6">
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Perhatian:</strong> Sengketa akan ditinjau oleh admin.
                Pastikan Anda memiliki alasan yang valid.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">
                Alasan Sengketa <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Jelaskan secara detail masalah yang Anda alami..."
                rows={8}
                maxLength={2000}
              />
              <p className="text-xs text-muted-foreground">
                {reason.length}/2000 karakter (minimal 50)
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>

          <DrawerFooter className="px-0 pt-6">
            <Button
              type="submit"
              size="lg"
              variant="destructive"
              disabled={loading}
            >
              {loading ? "Membuka..." : "Buka Sengketa"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" size="lg">
                Batal
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default DisputeForm;
