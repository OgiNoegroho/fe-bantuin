"use client";

import { useState } from "react";
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
import { TbMessage } from "react-icons/tb";

interface ReviewResponseFormProps {
  reviewId: string;
  onSuccess?: () => void;
}

const ReviewResponseForm = ({
  reviewId,
  onSuccess,
}: ReviewResponseFormProps) => {
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (response.length < 10) {
      setError("Tanggapan minimal 10 karakter");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`/api/reviews/${reviewId}/respond`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ response }),
      });

      const data = await res.json();

      if (data.success) {
        setOpen(false);
        setResponse("");
        if (onSuccess) onSuccess();
      } else {
        setError(data.error || "Gagal mengirim tanggapan");
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
        <Button variant="outline" size="sm">
          <TbMessage className="mr-2 h-4 w-4" />
          Tanggapi Review
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Tanggapi Review</DrawerTitle>
          <DrawerDescription>
            Berikan tanggapan profesional untuk review ini
          </DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="px-4 pb-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="response">
                Tanggapan Anda <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="response"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Terima kasih atas feedback Anda..."
                rows={6}
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground">
                {response.length}/1000 karakter (minimal 10)
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>

          <DrawerFooter className="px-0 pt-6">
            <Button type="submit" size="lg" disabled={loading}>
              {loading ? "Mengirim..." : "Kirim Tanggapan"}
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

export default ReviewResponseForm;
