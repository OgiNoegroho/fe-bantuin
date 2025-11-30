"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import BuyerLayout from "@/components/layouts/BuyerLayout";
import PaymentButton from "@/components/orders/PaymentButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Package,
  CheckCircle,
  Sparkles,
  FileText,
  Star,
  Shield,
  Calendar,
  MapPin,
  Download,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const BuyerOrderDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const fetchOrder = useCallback(async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`/api/orders/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setOrder(data.data);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/auth/login");
      } else {
        fetchOrder();
      }
    }
  }, [authLoading, isAuthenticated, fetchOrder, router]);

  const handleCompleteOrder = async () => {
    if (rating === 0) return alert("Mohon berikan rating");
    try {
      const token = localStorage.getItem("access_token");
      await fetch(`/api/orders/${order?.id}/approve`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      // Kirim Review
      if (review) {
        await fetch(`/api/reviews/order/${order?.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rating, comment: review }),
        });
      }
      alert("Pesanan selesai! Terima kasih.");
      setShowCompleteDialog(false);
      fetchOrder();
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal menyelesaikan pesanan");
    }
  };

  if (loading || authLoading)
    return (
      <BuyerLayout>
        <div className="p-10 text-center">Loading...</div>
      </BuyerLayout>
    );
  if (!order)
    return (
      <BuyerLayout>
        <div className="p-10 text-center">Order not found</div>
      </BuyerLayout>
    );

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const getStatusProgress = (status: string) => {
    const map: Record<string, number> = {
      DRAFT: 10,
      WAITING_PAYMENT: 20,
      PAID_ESCROW: 40,
      IN_PROGRESS: 60,
      DELIVERED: 80,
      COMPLETED: 100,
      CANCELLED: 0,
    };
    return map[status] || 0;
  };

  const trackingStages = [
    {
      id: 1,
      label: "Pesanan Dibuat",
      date: order.createdAt,
      completed: true,
      icon: Package,
    },
    {
      id: 2,
      label: "Pembayaran",
      date: order.paidAt,
      completed: !!order.paidAt,
      icon: Shield,
    },
    {
      id: 3,
      label: "Dikerjakan",
      date: undefined,
      completed: ["IN_PROGRESS", "DELIVERED", "COMPLETED"].includes(
        order.status
      ),
      icon: Sparkles,
    },
    {
      id: 4,
      label: "Review Hasil",
      date: order.deliveredAt,
      completed: ["DELIVERED", "COMPLETED"].includes(order.status),
      icon: FileText,
    },
    {
      id: 5,
      label: "Selesai",
      date: order.completedAt,
      completed: order.status === "COMPLETED",
      icon: Star,
    },
  ];
  const activeStageIndex = trackingStages.filter((s) => s.completed).length - 1;

  // LOGIKA BARU: Tentukan apakah aksi pembayaran harus ditampilkan
  const showPaymentActions = ["DRAFT", "WAITING_PAYMENT"].includes(
    order.status
  );

  return (
    <BuyerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Button
              variant="ghost"
              className="pl-0 mb-1 hover:bg-transparent hover:text-primary"
              onClick={() => router.push("/buyer/orders")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Pesanan
            </Button>
            <h1 className="text-3xl font-bold font-display text-foreground">
              #{order.id.substring(0, 8).toUpperCase()}
            </h1>
            <p className="text-muted-foreground">
              Layanan: {order.service.title}
            </p>
          </div>
          <Badge
            variant="outline"
            className="text-base py-1 px-4 bg-primary/10 text-primary border-primary/20"
          >
            {order.status.replace("_", " ")}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" /> Tracking Pesanan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-8">
                  <div className="flex justify-between text-sm mb-2 text-muted-foreground">
                    <span>Progress</span>
                    <span>{getStatusProgress(order.status)}%</span>
                  </div>
                  <Progress
                    value={getStatusProgress(order.status)}
                    className="h-2"
                  />
                </div>
                <div className="space-y-6 relative pl-2">
                  <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-muted -z-10" />
                  {trackingStages.map((stage, idx) => {
                    const Icon = stage.icon;
                    const isCompleted = stage.completed;
                    const isActive = idx === activeStageIndex;
                    return (
                      <div key={stage.id} className="flex gap-4 items-start">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 bg-background shrink-0 ${
                            isCompleted
                              ? "border-primary text-primary"
                              : "border-muted text-muted-foreground"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="pt-2">
                          <h4
                            className={`font-medium ${
                              isCompleted
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {stage.label}
                          </h4>
                          {stage.date && (
                            <p className="text-xs text-muted-foreground">
                              {new Date(stage.date).toLocaleDateString("id-ID")}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Service Info */}
            <Card>
              <CardHeader>
                <CardTitle>Detail Jasa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="relative h-32 w-full sm:w-40 rounded-lg overflow-hidden bg-muted border">
                    {order.service.images?.[0] && (
                      <Image
                        src={order.service.images[0]}
                        alt={order.service.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 160px"
                      />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-semibold">
                      {order.service.title}
                    </h3>
                    <Badge variant="secondary">{order.service.category}</Badge>
                    <div className="bg-muted/30 p-4 rounded-lg text-sm text-muted-foreground mt-2">
                      <p className="font-medium text-foreground mb-1">
                        Requirements:
                      </p>
                      {order.requirements}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Action Card */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Status & Aksi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* LOGIKA PEMBAYARAN: Tampilkan tombol jika DRAFT atau WAITING_PAYMENT */}
                {showPaymentActions && (
                  <>
                    <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs text-amber-900 flex gap-2">
                      <AlertCircle className="shrink-0 w-4 h-4 mt-0.5" />
                      <p>
                        Dana Anda akan disimpan dengan aman dalam rekening
                        escrow dan akan dilepaskan kepada penyedia setelah
                        pekerjaan selesai.
                      </p>
                    </div>
                    <PaymentButton orderId={order.id} onSuccess={fetchOrder} />
                  </>
                )}
                {/* END LOGIKA PEMBAYARAN */}

                {order.status === "DELIVERED" && (
                  <Button
                    onClick={() => setShowCompleteDialog(true)}
                    className="w-full"
                  >
                    Terima Pesanan & Selesaikan
                  </Button>
                )}
                {order.status === "IN_PROGRESS" && (
                  <div className="text-sm text-muted-foreground text-center bg-muted/50 p-3 rounded">
                    Penyedia sedang mengerjakan pesanan Anda.
                  </div>
                )}
                <div className="flex justify-between text-sm pt-2 border-t">
                  <span className="text-muted-foreground">Total Biaya</span>
                  <span className="font-bold text-primary">
                    {formatPrice(order.price)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={order.service.seller.profilePicture} />
                  <AvatarFallback>
                    {order.service.seller.fullName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs text-muted-foreground">Penyedia Jasa</p>
                  <p className="font-medium">{order.service.seller.fullName}</p>
                </div>
              </CardContent>
            </Card>

            {/* Communication */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Komunikasi & File</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="files" className="w-full">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="files">File</TabsTrigger>
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                  </TabsList>
                  <TabsContent value="files" className="mt-4 space-y-3">
                    {order.deliveryFiles?.length > 0 ? (
                      order.deliveryFiles.map((file: string, idx: number) => (
                        <div
                          key={idx}
                          className="p-3 bg-muted/30 border rounded-lg flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileText className="h-4 w-4 text-blue-500 shrink-0" />
                            <span className="text-sm truncate">
                              File Hasil {idx + 1}
                            </span>
                          </div>
                          <a
                            href={file}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </a>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        Belum ada file
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="chat" className="mt-4">
                    <div className="bg-muted/30 rounded-lg p-4 text-center text-sm text-muted-foreground min-h-[150px] flex flex-col items-center justify-center">
                      <p>Chat akan segera hadir.</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Complete Dialog */}
        <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Konfirmasi Penyelesaian</DialogTitle>
              <DialogDescription>
                Konfirmasi bahwa pekerjaan telah selesai dan dana dapat
                diteruskan.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <p className="text-sm mb-2 font-medium">Rating</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setRating(star)}>
                      <Star
                        className={`h-8 w-8 ${
                          star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <Textarea
                placeholder="Ulasan Anda..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowCompleteDialog(false)}
              >
                Batal
              </Button>
              <Button onClick={handleCompleteOrder}>Selesai</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </BuyerLayout>
  );
};

export default BuyerOrderDetailPage;
