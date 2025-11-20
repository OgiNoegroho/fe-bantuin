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
import { TbStar, TbStarFilled } from "react-icons/tb";

interface ReviewFormProps {
  orderId: string;
  onSuccess?: () => void;
}

const ReviewForm = ({ orderId, onSuccess }: ReviewFormProps) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Silakan pilih rating");
      return;
    }

    if (comment.length < 10) {
      setError("Komentar minimal 10 karakter");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`/api/reviews/order/${orderId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });

      const data = await response.json();

      if (data.success) {
        setOpen(false);
        setRating(0);
        setComment("");
        if (onSuccess) onSuccess();
      } else {
        setError(data.error || "Gagal mengirim review");
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
        <Button size="lg" className="w-full">
          <TbStarFilled className="mr-2" />
          Beri Review
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Berikan Review</DrawerTitle>
          <DrawerDescription>
            Bagaimana pengalaman Anda dengan jasa ini?
          </DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="px-4 pb-6">
          <div className="space-y-6">
            {/* Rating Stars */}
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    {star <= (hoveredRating || rating) ? (
                      <TbStarFilled className="h-10 w-10 text-yellow-400" />
                    ) : (
                      <TbStar className="h-10 w-10 text-gray-300" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <Label htmlFor="comment">
                Komentar <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ceritakan pengalaman Anda dengan jasa ini..."
                rows={6}
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground">
                {comment.length}/1000 karakter (minimal 10)
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
              {loading ? "Mengirim..." : "Kirim Review"}
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

export default ReviewForm;
