"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import SellerLayout from "@/components/layouts/SellerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
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
  Download,
  Send,
  ArrowLeft,
  Briefcase,
  Plus,
  RefreshCcw,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SellerOrderDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [showDeliverDialog, setShowDeliverDialog] = useState(false);

  const [progressTitle, setProgressTitle] = useState("");
  const [progressDesc, setProgressDesc] = useState("");
  const [progressFile, setProgressFile] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [deliveryFile, setDeliveryFile] = useState("");

  const fetchOrder = useCallback(async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`/api/orders/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setOrder(data.data);
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

  const handleStartWork = async () => {
    if (!confirm("Mulai kerjakan pesanan ini?")) return;
    try {
      const token = localStorage.getItem("access_token");
      await fetch(`/api/orders/${order?.id}/start`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrder();
    } catch (e) {
      alert("Gagal memulai pekerjaan");
    }
  };

  const handleSubmitProgress = async () => {
    try {
      const token = localStorage.getItem("access_token");
      await fetch(`/api/orders/${order?.id}/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: progressTitle,
          description: progressDesc,
          images: progressFile ? [progressFile] : [],
        }),
      });
      setShowProgressDialog(false);
      fetchOrder();
    } catch (e) {
      alert("Gagal update progress");
    }
  };

  const handleSubmitDeliver = async () => {
    try {
      const token = localStorage.getItem("access_token");
      await fetch(`/api/orders/${order?.id}/deliver`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          deliveryNote,
          deliveryFiles: deliveryFile ? [deliveryFile] : [],
        }),
      });
      setShowDeliverDialog(false);
      fetchOrder();
    } catch (e) {
      alert("Gagal mengirim hasil");
    }
  };


  const isValidImageUrl = (url: string) => {
  return url?.startsWith('http://') || url?.startsWith('https://') || url?.startsWith('/');
};

  if (loading || authLoading)
    return (
      <SellerLayout>
        <div className="p-10 text-center">Loading...</div>
      </SellerLayout>
    );
  if (!order)
    return (
      <SellerLayout>
        <div className="p-10 text-center">Order not found</div>
      </SellerLayout>
    );

  const getStatusProgress = (status: string) => {
    const map: Record<string, number> = {
      DRAFT: 10,
      WAITING_PAYMENT: 20,
      PAID_ESCROW: 35,
      IN_PROGRESS: 50,
      REVISION: 65, 
      DELIVERED: 80,
      COMPLETED: 100,
      CANCELLED: 0,
    };
    return map[status] || 0;
  };

  const isRevisionStage = order.status === 'REVISION';
  const hasRevisionHistory = order.revisionCount > 0;
  const isAfterRevision = ["DELIVERED", "COMPLETED"].includes(order.status);
  
  const trackingStages = [
    {
      id: 1,
      label: "Pesanan Masuk",
      date: order.createdAt,
      completed: true,
      icon: Package,
    },
    {
      id: 2,
      label: "Dibayar",
      date: order.paidAt,
      completed: !!order.paidAt,
      icon: Shield,
    },
    {
      id: 3,
      label: "Pengerjaan",
      date: undefined,
      completed: ["IN_PROGRESS", "REVISION", "DELIVERED", "COMPLETED"].includes(
        order.status
      ),
      icon: Sparkles,
    },
    ...(hasRevisionHistory || isRevisionStage ? [{
        id: 3.5,
        label: `Revisi Diminta (${order.revisionCount}x)`,
        date: order.status === 'REVISION' ? order.deliveredAt : undefined, 
        completed: isRevisionStage || isAfterRevision,
        icon: RefreshCcw,
    }] : []),
    {
      id: 4,
      label: "Dikirim",
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

  return (
    <SellerLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
          <div>
            <Button
              variant="ghost"
              className="pl-0 mb-1 hover:bg-transparent hover:text-primary"
              onClick={() => router.push("/seller/orders")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
            </Button>
            <h1 className="text-3xl font-bold font-display text-foreground">
              #{order.id.substring(0, 8).toUpperCase()}
            </h1>
            <p className="text-muted-foreground">
              Layanan: {order.service.title}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {order.status === "PAID_ESCROW" && (
              <Button onClick={handleStartWork} size="lg">
                <Briefcase className="mr-2 h-4 w-4" /> Mulai Kerjakan
              </Button>
            )}
            
            {(order.status === "IN_PROGRESS" || order.status === "REVISION") && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowProgressDialog(true)}
                >
                  <Plus className="mr-2 h-4 w-4" /> Update Progress
                </Button>
                <Button onClick={() => setShowDeliverDialog(true)}>
                  <Send className="mr-2 h-4 w-4" /> Kirim Hasil
                  {order.status === "REVISION" && (
                    <Badge variant="secondary" className="bg-white/30 text-white ml-1">Revisi</Badge>
                  )}
                </Button>
              </>
            )}
            
            {order.status === "REVISION" && (
                <Badge
                    variant="outline"
                    className="text-xs py-2 px-4 bg-orange-100 text-orange-700 border-orange-300 ml-2"
                >
                    Revisi ke-{order.revisionCount} diminta
                </Badge>
            )}
            
            <Badge
              variant="outline"
              className="text-base py-2 px-4 bg-primary/10 text-primary border-primary/20 ml-2"
            >
              {order.status.replace("_", " ")}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" /> Status Pengerjaan
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
                    
                    const statusClass = isCompleted
                              ? "border-primary text-primary"
                              : "border-muted text-muted-foreground";

                    return (
                      <div key={stage.id} className="flex gap-4 items-start">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 bg-background shrink-0 ${statusClass}`}
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
                          {stage.id === 3.5 && order.status === 'REVISION' && (
                             <p className="text-xs text-orange-600 font-medium">
                               Menunggu Anda Menyerahkan Hasil Revisi
                             </p>
                          )}
                          {stage.id === 3.5 && order.status === 'DELIVERED' && (
                             <p className="text-xs text-green-600 font-medium">
                               Hasil Revisi Dikirim Ulang
                             </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {order.progressLogs?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Riwayat Update</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.progressLogs.map((log: any) => (
                    <div
                      key={log.id}
                      className="bg-muted/30 p-4 rounded-lg border border-border"
                    >
                      <div className="flex justify-between mb-2">
                        <h4 className="font-semibold text-sm">{log.title}</h4>
                        <span className="text-xs text-muted-foreground">
                          {new Date(log.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {log.description}
                      </p>
                      {log.images?.length > 0 && (
                        <div className="flex gap-2">
                          {log.images.map((img: string, i: number) => {
                            const isUrlValid = isValidImageUrl(img); 

                            return (
                              <a
                                href={isUrlValid ? img : '#'} 
                                target="_blank"
                                key={i}
                                className="block h-16 w-16 relative rounded overflow-hidden border"
                              >
                                {isUrlValid ? (
                                  <Image
                                    src={img} 
                                    alt={`Progress ${i + 1}`}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground text-center p-1 bg-red-100/50">
                                    URL Invalid
                                  </div>
                                )}
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            
            {order.revisionNotes && order.revisionNotes.length > 0 && (
              <Card className="border-2 border-orange-400">
                  <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-orange-700">
                         <RefreshCcw className="h-5 w-5" /> Riwayat Revisi ({order.revisionNotes.length})
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      {order.revisionNotes.map((note: string, index: number) => (
                          <div key={index} className="p-4 rounded-lg border border-orange-200 bg-orange-50/50">
                              <h4 className="font-semibold text-sm text-orange-700 mb-2">
                                  Permintaan Revisi ke-{index + 1}
                              </h4>
                              <div className="text-sm text-foreground whitespace-pre-wrap border-l-2 border-orange-400 pl-3">
                                  {note}
                              </div>
                          </div>
                      ))}
                      <p className="text-xs text-muted-foreground mt-2">
                          Total Jatah Revisi: {order.maxRevisions}x
                      </p>
                  </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Requirements Pembeli</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 p-4 rounded-lg text-sm whitespace-pre-wrap text-muted-foreground">
                  {order.requirements}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
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
                              Hasil {idx + 1}
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
                        Belum ada file dikirim
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="chat" className="mt-4">
                    <div className="bg-muted/30 rounded-lg p-4 text-center text-sm text-muted-foreground min-h-[150px] flex flex-col items-center justify-center">
                      <p>Fitur Chat segera hadir.</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={order.buyer.profilePicture} />
                  <AvatarFallback>{order.buyer.fullName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs text-muted-foreground">Pembeli</p>
                  <p className="font-medium">{order.buyer.fullName}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={showProgressDialog} onOpenChange={setShowProgressDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Progress</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Judul</Label>
                <Input
                  placeholder="Contoh: Sketsa selesai"
                  value={progressTitle}
                  onChange={(e) => setProgressTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Deskripsi</Label>
                <Textarea
                  placeholder="Keterangan..."
                  value={progressDesc}
                  onChange={(e) => setProgressDesc(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Lampiran (Link)</Label>
                <Input
                  placeholder="https://..."
                  value={progressFile}
                  onChange={(e) => setProgressFile(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowProgressDialog(false)}
              >
                Batal
              </Button>
              <Button onClick={handleSubmitProgress}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showDeliverDialog} onOpenChange={setShowDeliverDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Kirim Hasil Akhir
                {order.status === "REVISION" && <span className="text-orange-600"> (Revisi)</span>}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Catatan</Label>
                <Textarea
                  placeholder="Pesan untuk pembeli..."
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Link File (Google Drive/Dropbox)</Label>
                <Input
                  placeholder="https://..."
                  value={deliveryFile}
                  onChange={(e) => setDeliveryFile(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeliverDialog(false)}
              >
                Batal
              </Button>
              <Button onClick={handleSubmitDeliver}>Kirim</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SellerLayout>
  );
};

export default SellerOrderDetailPage;