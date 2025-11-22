"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import PublicLayout from "@/components/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TbHome, TbArrowLeft, TbSearch } from "react-icons/tb";

export default function NotFound() {
  const router = useRouter();

  return (
    <PublicLayout>
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <Card className="border-2">
            <CardContent className="pt-12 pb-12 px-6 md:px-12">
              <div className="text-center space-y-6">
                {/* 404 Number */}
                <div className="relative">
                  <h1 className="font-display text-9xl md:text-[12rem] font-bold text-primary/20 select-none">
                    404
                  </h1>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-gradient-to-br from-primary to-secondary rounded-full p-8 shadow-lg">
                      <TbSearch className="h-16 w-16 text-white" />
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                    Halaman Tidak Ditemukan
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Maaf, halaman yang kamu cari tidak ada atau sudah dipindahkan.
                  </p>
                </div>

                {/* Description */}
                <div className="pt-4 space-y-4">
                  <p className="text-muted-foreground">
                    Mungkin kamu salah ketik URL, atau halaman ini sudah dihapus.
                    Coba kembali ke halaman utama atau gunakan menu navigasi untuk
                    menemukan apa yang kamu cari.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                  <Button
                    onClick={() => router.back()}
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    <TbArrowLeft className="mr-2 h-5 w-5" />
                    Kembali
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    <Link href="/">
                      <TbHome className="mr-2 h-5 w-5" />
                      Ke Halaman Utama
                    </Link>
                  </Button>
                </div>

                {/* Helpful Links */}
                <div className="pt-8 border-t">
                  <p className="text-sm text-muted-foreground mb-4">
                    Atau coba kunjungi:
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Link
                      href="/services"
                      className="text-primary hover:text-primary/80 hover:underline text-sm font-medium transition-colors"
                    >
                      Layanan
                    </Link>
                    <Link
                      href="/how"
                      className="text-primary hover:text-primary/80 hover:underline text-sm font-medium transition-colors"
                    >
                      Cara Kerja
                    </Link>
                    <Link
                      href="/who"
                      className="text-primary hover:text-primary/80 hover:underline text-sm font-medium transition-colors"
                    >
                      Tentang Kami
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}

