"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import PublicLayout from "@/components/layouts/PublicLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  TbUser,
  TbBriefcase,
  TbEdit,
  TbMail,
  TbPhone,
  TbSchool,
  TbId,
  TbStar,
  TbTrophy,
  TbShoppingCart,
  TbCoin,
  TbPackage,
} from "react-icons/tb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Interface untuk statistik seller (sama seperti di halaman stats)
interface SellerStats {
  stats: {
    totalServices: number;
    activeOrders: number;
    completedOrders: number;
    totalRevenue: number;
  };
}

export default function ProfilePage() {
  const { user, isAuthenticated, loading, refreshUser } = useAuth();
  const router = useRouter();

  // State untuk Seller Stats
  const [sellerStats, setSellerStats] = useState<SellerStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // State untuk Phone Verification
  const [isPhoneDialogOpen, setIsPhoneDialogOpen] = useState(false);
  const [phoneNumberInput, setPhoneNumberInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [verificationStep, setVerificationStep] = useState<"request" | "verify">(
    "request"
  );
  const [isSubmittingPhone, setIsSubmittingPhone] = useState(false);

  // State untuk Bio Edit
  const [isBioDialogOpen, setIsBioDialogOpen] = useState(false);
  const [bioInput, setBioInput] = useState("");
  const [isSubmittingBio, setIsSubmittingBio] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [loading, isAuthenticated, router]);

  // Fetch Seller Stats hanya jika user adalah seller
  useEffect(() => {
    const fetchSellerStats = async () => {
      if (user?.isSeller) {
        setLoadingStats(true);
        try {
          const token = localStorage.getItem("access_token");
          const res = await fetch("/api/users/seller/stats", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (data.success) {
            setSellerStats(data.data);
          }
        } catch (error) {
          console.error("Gagal mengambil statistik seller", error);
        } finally {
          setLoadingStats(false);
        }
      }
    };

    if (user) {
      fetchSellerStats();
    }
  }, [user]);

  if (loading || !user) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </PublicLayout>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleRequestOtp = async () => {
    if (!phoneNumberInput) {
      toast.error("Nomor telepon tidak boleh kosong");
      return;
    }

    setIsSubmittingPhone(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("/api/users/request-phone-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phoneNumber: phoneNumberInput }),
      });
      const data = await res.json();
      if (data.success || res.ok) {
        toast.success("Kode Verifikasi dikirim ke WhatsApp Anda");
        if (data.developer_note) toast.info(data.developer_note);
        setVerificationStep("verify");
      } else {
        toast.error(data.message || "Gagal mengirim OTP");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat menghubungi server");
    } finally {
      setIsSubmittingPhone(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpInput) {
      toast.error("Masukkan kode OTP");
      return;
    }

    setIsSubmittingPhone(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("/api/users/verify-phone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ otp: otpInput }),
      });
      const data = await res.json();
      if (data.success || res.ok) {
        toast.success("Nomor telepon berhasil diverifikasi");
        await refreshUser();
        setIsPhoneDialogOpen(false);
        // Reset
        setTimeout(() => {
          setVerificationStep("request");
          setPhoneNumberInput("");
          setOtpInput("");
        }, 300);
      } else {
        toast.error(data.message || "OTP Salah / Kadaluarsa");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat verifikasi");
    } finally {
      setIsSubmittingPhone(false);
    }
  };

  const handleUpdateBio = async () => {
    setIsSubmittingBio(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("/api/users/update-profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bio: bioInput }),
      });
      const data = await res.json();
      if (data.success || res.ok) {
        toast.success("Bio berhasil diperbarui");
        await refreshUser();
        setIsBioDialogOpen(false);
      } else {
        toast.error(data.message || "Gagal memperbarui bio");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat menghubungi server");
    } finally {
      setIsSubmittingBio(false);
    }
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* 1. Profile Header Card */}
          <Card className="mb-8 border-none shadow-md overflow-hidden">
            <div className="h-32 bg-linear-to-r from-primary to-secondary relative">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-grid-white/10" />
            </div>
            <CardContent className="relative pt-0 px-8 pb-8">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-12">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  <AvatarImage
                    src={user.profilePicture || ""}
                    alt={user.fullName}
                  />
                  <AvatarFallback className="text-4xl bg-primary text-white">
                    {getInitials(user.fullName)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-1 mt-4 md:mt-0 md:mb-2">
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {user.fullName}
                    </h1>
                    {user.isVerified && (
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-700 border-blue-200 w-fit"
                      >
                        Terverifikasi
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>

                <div className="flex gap-3 mt-4 md:mt-0 md:mb-2">
                  <Button
                    onClick={() => router.push("/buyer/settings")}
                    variant="outline"
                  >
                    <TbEdit className="mr-2 h-4 w-4" /> Edit Profil
                  </Button>
                  {user.isSeller && (
                    <Button onClick={() => router.push("/seller/dashboard")}>
                      Dashboard Penyedia
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Tabs Section */}
          <Tabs defaultValue="pengguna" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
              <TabsTrigger value="pengguna" className="gap-2">
                <TbUser className="h-4 w-4" /> Profil Pengguna
              </TabsTrigger>
              <TabsTrigger value="penyedia" className="gap-2">
                <TbBriefcase className="h-4 w-4" /> Profil Penyedia
              </TabsTrigger>
            </TabsList>

            {/* --- TAB 1: PENGGUNA (BUYER) --- */}
            <TabsContent
              value="pengguna"
              className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Info Akademik */}
                <Card className="md:col-span-1 h-fit">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TbSchool className="text-primary" /> Info Akademik
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">
                        NIM
                      </p>
                      <p className="font-medium flex items-center gap-2">
                        <TbId className="text-gray-400" />
                        {user.nim || "-"}
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">
                        Jurusan
                      </p>
                      <p className="font-medium">{user.major || "-"}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">
                        Angkatan
                      </p>
                      <p className="font-medium">{user.batch || "-"}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Bio & Kontak */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Informasi Pribadi</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <TbMail className="h-4 w-4" />
                          <span className="text-sm font-medium">Email</span>
                        </div>
                        <p className="text-foreground">{user.email}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <TbPhone className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            Nomor Telepon
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-foreground">
                            {user.phoneNumber || "-"}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-primary"
                            onClick={() => {
                              setPhoneNumberInput(user.phoneNumber || "");
                              setIsPhoneDialogOpen(true);
                            }}
                          >
                            <TbEdit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-lg border">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-semibold text-foreground">
                          Bio / Deskripsi Diri
                        </h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-primary"
                          onClick={() => {
                            setBioInput(user.bio || "");
                            setIsBioDialogOpen(true);
                          }}
                        >
                          <TbEdit className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {user.bio ||
                          "Belum ada deskripsi diri. Tambahkan di pengaturan profil."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* --- TAB 2: PENYEDIA (SELLER) --- */}
            <TabsContent
              value="penyedia"
              className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2"
            >
              {user.isSeller ? (
                <>
                  {/* Seller Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-6 flex flex-col gap-2">
                        <span className="text-muted-foreground text-xs uppercase font-bold">
                          Rating
                        </span>
                        <div className="flex items-center gap-2">
                          <TbStar className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                          <span className="text-3xl font-bold">
                            {Number(user.avgRating).toFixed(1)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Dari {user.totalReviews} ulasan
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6 flex flex-col gap-2">
                        <span className="text-muted-foreground text-xs uppercase font-bold">
                          Pesanan Selesai
                        </span>
                        <div className="flex items-center gap-2">
                          <TbTrophy className="h-6 w-6 text-primary" />
                          <span className="text-3xl font-bold">
                            {user.totalOrdersCompleted}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Total Proyek Sukses
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6 flex flex-col gap-2">
                        <span className="text-muted-foreground text-xs uppercase font-bold">
                          Total Pendapatan
                        </span>
                        <div className="flex items-center gap-2">
                          <TbCoin className="h-6 w-6 text-green-600" />
                          <span className="text-2xl font-bold truncate">
                            {loadingStats
                              ? "..."
                              : sellerStats
                                ? formatCurrency(sellerStats.stats.totalRevenue)
                                : "Rp 0"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Pendapatan Bersih
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6 flex flex-col gap-2">
                        <span className="text-muted-foreground text-xs uppercase font-bold">
                          Jasa Aktif
                        </span>
                        <div className="flex items-center gap-2">
                          <TbPackage className="h-6 w-6 text-blue-600" />
                          <span className="text-3xl font-bold">
                            {loadingStats
                              ? "..."
                              : sellerStats?.stats.totalServices || 0}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Layanan Ditawarkan
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Shortcut to Seller Dashboard */}
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-8 flex flex-col items-center text-center">
                      <h3 className="text-xl font-bold text-primary mb-2">
                        Kelola Bisnis Jasa Anda
                      </h3>
                      <p className="text-muted-foreground mb-6 max-w-lg">
                        Akses dashboard penyedia untuk mengelola pesanan masuk,
                        mengedit layanan, dan melihat analitik mendalam.
                      </p>
                      <Button
                        size="lg"
                        onClick={() => router.push("/seller/dashboard")}
                      >
                        Buka Dashboard Penyedia
                      </Button>
                    </CardContent>
                  </Card>
                </>
              ) : (
                // Tampilan Jika Bukan Seller
                <Card className="border-dashed border-2">
                  <CardContent className="py-16 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                      <TbBriefcase className="h-10 w-10 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Anda Belum Menjadi Penyedia Jasa
                    </h2>
                    <p className="text-muted-foreground max-w-md mb-8">
                      Daftar sekarang untuk mulai menawarkan keahlian Anda
                      kepada ribuan mahasiswa UIN Suska Riau dan dapatkan
                      penghasilan tambahan.
                    </p>
                    <Button
                      size="lg"
                      onClick={() => router.push("/seller/activate")}
                    >
                      Daftar Sebagai Penyedia
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>


      <Dialog open={isPhoneDialogOpen} onOpenChange={setIsPhoneDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ubah Nomor Telepon</DialogTitle>
            <DialogDescription>
              {verificationStep === "request"
                ? "Masukkan nomor WhatsApp aktif Anda untuk mendapatkan kode verifikasi."
                : "Masukkan 6 digit kode yang dikirim ke WhatsApp Anda."}
            </DialogDescription>
          </DialogHeader>

          {verificationStep === "request" ? (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Nomor WhatsApp</Label>
                <Input
                  id="phone"
                  placeholder="Contoh: 081234567890"
                  value={phoneNumberInput}
                  onChange={(e) => setPhoneNumberInput(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Kode Verifikasi (OTP)</Label>
                <Input
                  id="otp"
                  placeholder="123456"
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            {verificationStep === "request" ? (
              <Button onClick={handleRequestOtp} disabled={isSubmittingPhone}>
                {isSubmittingPhone ? "Mengirim..." : "Kirim Kode"}
              </Button>
            ) : (
              <div className="flex flex-col w-full gap-2">
                <Button onClick={handleVerifyOtp} disabled={isSubmittingPhone}>
                  {isSubmittingPhone ? "Memverifikasi..." : "Verifikasi"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setVerificationStep("request")}
                  disabled={isSubmittingPhone}
                >
                  Kembali ubah nomor
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isBioDialogOpen} onOpenChange={setIsBioDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ubah Bio / Deskripsi Diri</DialogTitle>
            <DialogDescription>
              Ceritakan sedikit tentang diri Anda, keahlian, atau pengalaman yang relevan.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Contoh: Mahasiswa Teknik Informatika yang berpengalaman dalam..."
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateBio} disabled={isSubmittingBio}>
              {isSubmittingBio ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PublicLayout >
  );
}
