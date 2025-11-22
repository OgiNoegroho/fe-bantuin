"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import SellerLayout from "@/components/layouts/SellerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TbChartBar,
  TbCoin,
  TbShoppingCart,
  TbStar,
  TbPackage,
  TbTrendingUp,
  TbTrendingDown,
} from "react-icons/tb";

interface ServiceStats {
  id: string;
  title: string;
  price: number;
  totalOrders: number;
  avgRating: number;
  status: string;
}

interface SellerStats {
  user: {
    id: string;
    fullName: string;
    avgRating: number;
    totalReviews: number;
    totalOrdersCompleted: number;
  };
  stats: {
    totalServices: number;
    activeOrders: number;
    completedOrders: number;
    totalRevenue: number;
  };
  services: ServiceStats[];
}

const SellerStatsPage = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/");
      } else if (!user?.isSeller) {
        router.push("/seller/activate");
      } else {
        fetchStats();
      }
    }
  }, [authLoading, isAuthenticated, user, router]);

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("/api/users/seller/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.error || "Gagal memuat statistik");
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan");
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

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
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive text-center">{error}</p>
          </CardContent>
        </Card>
      </SellerLayout>
    );
  }

  if (!stats) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700 border-green-200";
      case "PAUSED":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "DELETED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <SellerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Statistik Penjualan
          </h1>
          <p className="text-muted-foreground">
            Lihat performa bisnis Anda secara keseluruhan
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Revenue */}
          <Card className="border-2 border-primary/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Pendapatan
                </CardTitle>
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <TbCoin className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(stats.stats.totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Dari {stats.stats.completedOrders} pesanan selesai
              </p>
            </CardContent>
          </Card>

          {/* Total Services */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Jasa
                </CardTitle>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <TbPackage className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.stats.totalServices}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Jasa yang aktif
              </p>
            </CardContent>
          </Card>

          {/* Completed Orders */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pesanan Selesai
                </CardTitle>
                <div className="bg-green-100 p-2 rounded-lg">
                  <TbShoppingCart className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.stats.completedOrders}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total transaksi sukses
              </p>
            </CardContent>
          </Card>

          {/* Active Orders */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pesanan Aktif
                </CardTitle>
                <div className="bg-purple-100 p-2 rounded-lg">
                  <TbChartBar className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.stats.activeOrders}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Sedang berjalan
              </p>
            </CardContent>
          </Card>
        </div>

        {/* User Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Performa Anda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <TbStar className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Rating Rata-rata
                  </p>
                  <p className="text-2xl font-bold">
                    {Number(stats.user.avgRating).toFixed(1)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    dari {stats.user.totalReviews} ulasan
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <TbShoppingCart className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Selesai</p>
                  <p className="text-2xl font-bold">
                    {stats.user.totalOrdersCompleted}
                  </p>
                  <p className="text-xs text-muted-foreground">pesanan</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <TbCoin className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Rata-rata per Order
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.stats.completedOrders > 0
                      ? formatCurrency(
                          stats.stats.totalRevenue / stats.stats.completedOrders
                        )
                      : formatCurrency(0)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Performa Jasa</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.services.length === 0 ? (
              <div className="text-center py-12">
                <TbPackage className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Belum ada jasa yang dibuat
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.services.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground">
                          {service.title}
                        </h3>
                        <Badge
                          variant="outline"
                          className={getStatusColor(service.status)}
                        >
                          {service.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <TbStar className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {Number(Number(service.avgRating || 0).toFixed(1))}
                        </span>
                        <span className="flex items-center gap-1">
                          <TbShoppingCart className="h-4 w-4" />
                          {service.totalOrders} pesanan
                        </span>
                        <span className="font-medium text-primary">
                          {formatCurrency(service.price)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {service.totalOrders > 5 ? (
                        <TbTrendingUp className="h-5 w-5 text-green-600" />
                      ) : (
                        <TbTrendingDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SellerLayout>
  );
};

export default SellerStatsPage;
