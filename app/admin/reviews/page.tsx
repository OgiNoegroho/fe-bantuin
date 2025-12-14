"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface PendingService {
  id: string;
  title: string;
  description: string;
  images: string[];
  seller: { id: string; fullName: string; email: string };
  createdAt: string;
}

const AdminReviewsPage = () => {
  const [services, setServices] = useState<PendingService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("/api/admin/services/pending", {
        headers: { Authorization: token || "" },
      });
      const data = await res.json();
      if (data.success) {
        setServices(data.data || []);
      } else {
        setServices([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!confirm("Setujui jasa ini?")) return;
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`/api/admin/services/${id}/approve`, {
        method: "POST",
        headers: { Authorization: token || "" },
      });
      const data = await res.json();
      if (data.success) {
        alert("Jasa disetujui");
        fetchPending();
      } else {
        alert(data.error || "Gagal menyetujui jasa");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan");
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt("Alasan penolakan:");
    if (reason === null) return; // cancelled
    if (reason.trim().length === 0) {
      alert("Alasan harus diisi");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`/api/admin/services/${id}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Jasa ditolak");
        fetchPending();
      } else {
        alert(data.error || "Gagal menolak jasa");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Review Jasa</h1>
          <p className="text-muted-foreground">
            Daftar jasa yang menunggu persetujuan administrator
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          </div>
        ) : services.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              Tidak ada jasa yang menunggu review.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <Card key={s.id} className="overflow-hidden">
                <div className="relative aspect-video w-full bg-gray-100">
                  {s.images?.[0] ? (
                    <Image
                      src={s.images[0]}
                      alt={s.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-4xl">📦</span>
                    </div>
                  )}
                </div>
                <CardContent>
                  <h3 className="font-semibold text-foreground mb-1">
                    {s.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    oleh {s.seller.fullName} •{" "}
                    {new Date(s.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {s.description}
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={() => handleApprove(s.id)}>Setujui</Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleReject(s.id)}
                    >
                      Tolak
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReviewsPage;
