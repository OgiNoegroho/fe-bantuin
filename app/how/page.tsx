"use client";

import PublicLayout from "@/components/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  TbSearch,
  TbShieldCheck,
  TbMessages,
  TbStar,
  TbCreditCard,
  TbTrendingUp,
  TbUsers,
  TbPackage,
  TbChartBar,
  TbBell,
  TbLock,
  TbArrowRight,
  TbCheck,
  TbUserCheck,
  TbClock,
  TbWallet,
} from "react-icons/tb";

/**
 * Page: Cara Kerja Bantuin
 */
const How = () => {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-b from-white via-green-50/30 to-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-primary via-secondary to-primary text-white py-20 md:py-28">
          <div className="absolute inset-0 bg-grid-white/10"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-6 bg-accent/30 text-white border-accent/50 hover:bg-accent/40">
                Platform Jasa Mahasiswa #1
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Cara Kerja <span className="text-accent">Bantuin</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Platform marketplace yang menghubungkan mahasiswa dengan
                penyedia jasa profesional. Mudah, aman, dan terpercaya.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/services">
                  <Button
                    size="lg"
                    className="bg-accent text-primary hover:bg-accent/90"
                  >
                    Cari Jasa
                    <TbArrowRight className="ml-2" />
                  </Button>
                </Link>
                <Link href="/seller/activate">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-secondary text-black hover:bg-scroll"
                  >
                    Jadi Penyedia
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  1000+
                </div>
                <div className="text-sm text-gray-600">Jasa Tersedia</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  500+
                </div>
                <div className="text-sm text-gray-600">Penyedia Aktif</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  5000+
                </div>
                <div className="text-sm text-gray-600">Pesanan Selesai</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  4.8
                </div>
                <div className="text-sm text-gray-600">Rating Rata-rata</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works - Buyer */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <Badge className="mb-4 bg-accent/20 text-primary border-accent/30">
                  Untuk Pembeli
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Cara Memesan Jasa
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Proses pemesanan yang mudah dan aman dengan sistem escrow
                  untuk melindungi dana Anda
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Step 1 */}
                <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xl font-bold">
                        1
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <TbSearch className="h-6 w-6 text-primary" />
                          <h3 className="text-xl font-semibold text-foreground">
                            Cari & Pilih Jasa
                          </h3>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          Gunakan fitur pencarian dan filter berdasarkan
                          kategori, harga, dan rating. Lihat profil lengkap
                          penyedia, portofolio, dan review dari pembeli
                          sebelumnya.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">
                            Filter Kategori
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Lihat Rating
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Baca Review
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Step 2 */}
                <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xl font-bold">
                        2
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <TbCreditCard className="h-6 w-6 text-primary" />
                          <h3 className="text-xl font-semibold text-foreground">
                            Pesan & Bayar Aman
                          </h3>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          Buat pesanan dengan detail pekerjaan yang jelas. Dana
                          Anda akan ditahan dalam sistem escrow yang aman, hanya
                          akan diteruskan ke penyedia setelah pekerjaan selesai.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">
                            <TbShieldCheck className="mr-1" />
                            Escrow System
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <TbLock className="mr-1" />
                            Pembayaran Aman
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Step 3 */}
                <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xl font-bold">
                        3
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <TbMessages className="h-6 w-6 text-primary" />
                          <h3 className="text-xl font-semibold text-foreground">
                            Pantau Progress
                          </h3>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          Komunikasi langsung dengan penyedia jasa melalui
                          sistem chat. Pantau progress pekerjaan dengan update
                          berkala dan notifikasi real-time.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">
                            Chat Real-time
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <TbBell className="mr-1" />
                            Notifikasi
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Step 4 */}
                <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white text-xl font-bold">
                        4
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <TbStar className="h-6 w-6 text-primary" />
                          <h3 className="text-xl font-semibold text-foreground">
                            Konfirmasi & Review
                          </h3>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          Setelah pekerjaan selesai, konfirmasi penyelesaian dan
                          berikan rating. Dana akan segera diteruskan ke
                          penyedia. Review Anda membantu pengguna lain.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">
                            Rating & Review
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <TbWallet className="mr-1" />
                            Dana Diteruskan
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works - Seller */}
        <section className="py-20 bg-gradient-to-br from-accent/10 to-accent/5">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <Badge className="mb-4 bg-secondary/20 text-secondary border-secondary/30">
                  Untuk Penyedia Jasa
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Cara Menjadi Penyedia
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Mulai hasilkan uang dengan menawarkan keahlian Anda kepada
                  ribuan mahasiswa
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Seller Step 1 */}
                <Card className="border-2 hover:border-secondary/50 transition-all hover:shadow-lg bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary text-white text-xl font-bold">
                        1
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <TbUserCheck className="h-6 w-6 text-secondary" />
                          <h3 className="text-xl font-semibold text-foreground">
                            Daftar & Verifikasi
                          </h3>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          Login dengan akun Google kampus Anda. Lengkapi profil
                          dengan informasi jurusan, angkatan, dan bio. Aktifkan
                          mode penyedia jasa untuk mulai menawarkan layanan.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">
                            Login Google
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Verifikasi Kampus
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Seller Step 2 */}
                <Card className="border-2 hover:border-secondary/50 transition-all hover:shadow-lg bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary text-white text-xl font-bold">
                        2
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <TbPackage className="h-6 w-6 text-secondary" />
                          <h3 className="text-xl font-semibold text-foreground">
                            Buat Jasa
                          </h3>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          Buat listing jasa dengan deskripsi detail, harga
                          kompetitif, dan waktu pengerjaan. Upload portofolio
                          untuk menarik lebih banyak pembeli.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">
                            Upload Portofolio
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Set Harga
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Seller Step 3 */}
                <Card className="border-2 hover:border-secondary/50 transition-all hover:shadow-lg bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary text-white text-xl font-bold">
                        3
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <TbClock className="h-6 w-6 text-secondary" />
                          <h3 className="text-xl font-semibold text-foreground">
                            Terima & Kerjakan
                          </h3>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          Terima pesanan yang masuk, komunikasi dengan pembeli
                          untuk detail pekerjaan. Kerjakan dengan profesional
                          dan update progress secara berkala.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">
                            Kelola Pesanan
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Update Progress
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Seller Step 4 */}
                <Card className="border-2 hover:border-secondary/50 transition-all hover:shadow-lg bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary text-white text-xl font-bold">
                        4
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <TbTrendingUp className="h-6 w-6 text-secondary" />
                          <h3 className="text-xl font-semibold text-foreground">
                            Terima Pembayaran
                          </h3>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          Setelah pembeli konfirmasi, dana akan langsung masuk
                          ke akun Anda. Dapatkan rating positif untuk
                          meningkatkan reputasi dan menarik lebih banyak
                          pembeli.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">
                            <TbWallet className="mr-1" />
                            Terima Dana
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Build Reputasi
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                  Fitur Unggulan
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Kenapa Pilih Bantuin?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Platform terlengkap dengan fitur-fitur yang memudahkan
                  transaksi jasa
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Feature 1 */}
                <Card className="border-2 hover:shadow-lg transition-all hover:border-primary/30">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TbShieldCheck className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      Sistem Escrow
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Dana Anda aman dengan sistem escrow. Pembayaran hanya
                      diteruskan setelah pekerjaan selesai.
                    </p>
                  </CardContent>
                </Card>

                {/* Feature 2 */}
                <Card className="border-2 hover:shadow-lg transition-all hover:border-secondary/30">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TbUsers className="h-8 w-8 text-secondary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      Komunitas Terpercaya
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Semua pengguna terverifikasi dengan email kampus. Rating
                      dan review transparan dari pengguna lain.
                    </p>
                  </CardContent>
                </Card>

                {/* Feature 3 */}
                <Card className="border-2 hover:shadow-lg transition-all hover:border-accent/50">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TbMessages className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      Chat Real-time
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Komunikasi langsung dengan penyedia atau pembeli melalui
                      sistem chat terintegrasi.
                    </p>
                  </CardContent>
                </Card>

                {/* Feature 4 */}
                <Card className="border-2 hover:shadow-lg transition-all hover:border-primary/30">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TbChartBar className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      Dashboard Analytics
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Pantau performa jasa Anda dengan statistik lengkap dan
                      insight yang berguna.
                    </p>
                  </CardContent>
                </Card>

                {/* Feature 5 */}
                <Card className="border-2 hover:shadow-lg transition-all hover:border-secondary/30">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TbBell className="h-8 w-8 text-secondary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      Notifikasi Real-time
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Dapatkan update instan untuk setiap pesanan, pesan, dan
                      perubahan status.
                    </p>
                  </CardContent>
                </Card>

                {/* Feature 6 */}
                <Card className="border-2 hover:shadow-lg transition-all hover:border-accent/50">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TbStar className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      Rating & Review
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Sistem rating transparan membantu Anda memilih penyedia
                      terbaik dan membangun reputasi.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <Badge className="mb-4 bg-muted text-muted-foreground border-border">
                  Kategori Jasa
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Berbagai Kategori Tersedia
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Temukan atau tawarkan jasa di berbagai kategori sesuai
                  kebutuhan
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "Desain", icon: "🎨", color: "purple" },
                  { name: "Pemrograman", icon: "💻", color: "blue" },
                  { name: "Penulisan", icon: "✍️", color: "orange" },
                  { name: "Data", icon: "📊", color: "green" },
                  { name: "Tutor", icon: "📚", color: "indigo" },
                  { name: "Acara", icon: "🎉", color: "pink" },
                  { name: "Teknis", icon: "🔧", color: "red" },
                  { name: "Lainnya", icon: "📦", color: "gray" },
                ].map((category, index) => (
                  <Card
                    key={index}
                    className="border-2 hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer"
                  >
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-3">{category.icon}</div>
                      <h3 className="font-semibold text-foreground">
                        {category.name}
                      </h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};

export default How;
