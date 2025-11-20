"use client";

import { useState, useEffect, createElement } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import SellerLayout from "@/components/layouts/SellerLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  TbArrowLeft,
  TbPaperclip,
  TbSend,
  TbClock,
  TbProgress,
  TbCheck,
  TbX,
  TbInbox,
} from "react-icons/tb";

// Tipe data detail order
interface OrderDetail {
  id: string;
  title: string;
  price: number;
  status: string;
  dueDate: string;
  requirements: string;
  attachments: string[];
  revisionNotes: string[];
  buyer: {
    id: string;
    fullName: string;
    profilePicture: string | null;
  };
}

// Tipe data DTO untuk pengiriman
interface DeliverDto {
  deliveryNote: string;
  deliveryFiles: string[];
}

const statusMap: Record<
  string,
  { text: string; color: string; icon: React.ElementType }
> = {
  PAID_ESCROW: {
    text: "Perlu Dikerjakan",
    color: "bg-blue-100 text-blue-700",
    icon: TbClock,
  },
  IN_PROGRESS: {
    text: "Sedang Dikerjakan",
    color: "bg-yellow-100 text-yellow-700",
    icon: TbProgress,
  },
  REVISION: {
    text: "Revisi",
    color: "bg-orange-100 text-orange-700",
    icon: TbProgress,
  },
  DELIVERED: {
    text: "Terkirim",
    color: "bg-purple-100 text-purple-700",
    icon: TbInbox,
  },
  COMPLETED: {
    text: "Selesai",
    color: "bg-green-100 text-green-700",
    icon: TbCheck,
  },
  CANCELLED: {
    text: "Dibatalkan",
    color: "bg-red-100 text-red-700",
    icon: TbX,
  },
};

const SellerOrderDetailPage = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deliveryData, setDeliveryData] = useState<DeliverDto>({
    deliveryNote: "",
    deliveryFiles: [],
  });
  const [tempFileUrl, setTempFileUrl] = useState("");

  const fetchOrderDetail = async () => {
    if (!orderId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setOrder(data.data);
      } else {
        setError(data.message || "Gagal memuat order");
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchOrderDetail();
    }
  }, [orderId, authLoading, user]);

  const handleStartWork = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`/api/orders/${orderId}/start`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        fetchOrderDetail(); // Refresh data
      } else {
        alert(data.message || "Gagal memulai pekerjaan");
      }
    } catch (err) {
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleDeliverWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deliveryData.deliveryFiles.length === 0) {
      alert("Anda harus melampirkan minimal 1 file hasil kerja.");
      return;
    }
    if (deliveryData.deliveryNote.length < 10) {
      alert("Catatan pengiriman minimal 10 karakter.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`/api/orders/${orderId}/deliver`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(deliveryData),
      });
      const data = await response.json();
      if (data.success) {
        fetchOrderDetail(); // Refresh data
      } else {
        alert(data.message || "Gagal mengirimkan pekerjaan");
      }
    } catch (err) {
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const addFileUrl = () => {
    if (tempFileUrl && deliveryData.deliveryFiles.length < 10) {
      setDeliveryData((prev) => ({
        ...prev,
        deliveryFiles: [...prev.deliveryFiles, tempFileUrl],
      }));
      setTempFileUrl("");
    }
  };

  const removeFileUrl = (index: number) => {
    setDeliveryData((prev) => ({
      ...prev,
      deliveryFiles: prev.deliveryFiles.filter((_, i) => i !== index),
    }));
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (authLoading || loading) {
    return (
      <SellerLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </SellerLayout>
    );
  }

  if (error) {
    return (
      <SellerLayout>
        <p className="text-destructive">{error}</p>
      </SellerLayout>
    );
  }

  if (!order) {
    return null;
  }

  const currentStatus = statusMap[order.status] || {
    text: order.status,
    color: "bg-gray-100 text-gray-700",
    icon: TbClock,
  };

  return (
    <SellerLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.push("/seller/orders")}>
          <TbArrowLeft className="mr-2" />
          Kembali ke Daftar Pesanan
        </Button>

        {/* Order Header */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl mb-2">{order.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Order: #{order.id.substring(0, 8)}</span>
                  <span>Tenggat: {formatDate(order.dueDate)}</span>
                </div>
              </div>
              <Badge className={`${currentStatus.color} text-sm`}>
                {createElement(currentStatus.icon, {
                  className: "h-4 w-4 mr-1.5",
                })}
                {currentStatus.text}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={order.buyer.profilePicture || ""} />
                <AvatarFallback>
                  {getInitials(order.buyer.fullName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-muted-foreground">Dipesan oleh</p>
                <p className="font-medium">{order.buyer.fullName}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold text-primary">
                Rp {Number(order.price).toLocaleString("id-ID")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Kebutuhan Pembeli</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap mb-4">
              {order.requirements}
            </p>
            {order.attachments.length > 0 && (
              <div>
                <Label>Lampiran:</Label>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  {order.attachments.map((file, i) => (
                    <li key={i} className="text-sm">
                      <a
                        href={file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {file}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {order.revisionNotes.length > 0 && (
              <div className="mt-4">
                <Label>Catatan Revisi Terakhir:</Label>
                <p className="text-sm text-muted-foreground p-3 bg-orange-50 border border-orange-200 rounded-md mt-2">
                  {order.revisionNotes[order.revisionNotes.length - 1]}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Panel */}
        {order.status === "PAID_ESCROW" && (
          <Card className="border-primary">
            <CardHeader>
              <CardTitle>Mulai Pengerjaan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Pembeli telah melakukan pembayaran. Klik tombol di bawah untuk
                memulai pengerjaan.
              </p>
              <Button size="lg" onClick={handleStartWork} disabled={loading}>
                <TbProgress className="mr-2" />
                Mulai Kerjakan
              </Button>
            </CardContent>
          </Card>
        )}

        {(order.status === "IN_PROGRESS" || order.status === "REVISION") && (
          <Card className="border-primary">
            <form onSubmit={handleDeliverWork}>
              <CardHeader>
                <CardTitle>Kirim Hasil Pekerjaan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="deliveryNote">
                    Catatan Pengiriman{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="deliveryNote"
                    value={deliveryData.deliveryNote}
                    onChange={(e) =>
                      setDeliveryData((p) => ({
                        ...p,
                        deliveryNote: e.target.value,
                      }))
                    }
                    placeholder="Contoh: Halo, ini hasil pekerjaannya ya. Semoga sesuai..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label>
                    File Hasil Kerja (Link){" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={tempFileUrl}
                      onChange={(e) => setTempFileUrl(e.target.value)}
                      placeholder="https://link-ke-hasil-kerja.com/file.zip"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addFileUrl}
                      disabled={!tempFileUrl}
                    >
                      Tambah
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {deliveryData.deliveryFiles.map((file, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-sm p-2 bg-gray-100 rounded"
                      >
                        <span className="truncate">{file}</span>
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => removeFileUrl(i)}
                        >
                          <TbX />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <Button type="submit" size="lg" disabled={loading}>
                  <TbSend className="mr-2" />
                  Kirim Hasil
                </Button>
              </CardContent>
            </form>
          </Card>
        )}

        {order.status === "DELIVERED" && (
          <Card>
            <CardContent className="py-6 text-center">
              <p className="font-medium">Menunggu Persetujuan Pembeli</p>
              <p className="text-sm text-muted-foreground">
                Pekerjaan telah dikirim. Pembeli akan meninjau hasil Anda.
              </p>
            </CardContent>
          </Card>
        )}

        {order.status === "COMPLETED" && (
          <Card className="border-green-500">
            <CardContent className="py-6 text-center">
              <TbCheck className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <p className="font-medium text-lg">Pesanan Selesai</p>
              <p className="text-sm text-muted-foreground">
                Dana telah dilepaskan ke dompet Anda.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </SellerLayout>
  );
};

export default SellerOrderDetailPage;
