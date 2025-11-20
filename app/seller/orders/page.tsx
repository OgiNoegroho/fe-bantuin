"use client";

import { useState, useEffect, createElement } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import SellerLayout from "@/components/layouts/SellerLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TbInbox, TbProgress, TbCheck, TbX, TbClock } from "react-icons/tb";

// Tipe data untuk Order (bisa disesuaikan dari prisma/schema.prisma)
interface Order {
  id: string;
  title: string;
  price: number;
  status: string;
  dueDate: string;
  buyer: {
    fullName: string;
    profilePicture: string | null;
  };
  service: {
    images: string[];
  };
}

// Map untuk status
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
  REVISION: {
    text: "Revisi",
    color: "bg-orange-100 text-orange-700",
    icon: TbProgress,
  },
  DISPUTED: { text: "Sengketa", color: "bg-gray-500 text-white", icon: TbX },
};

const SellerOrdersPage = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("active");

  const tabsConfig = [
    {
      value: "active",
      label: "Aktif",
      statuses: ["PAID_ESCROW", "IN_PROGRESS", "REVISION", "DELIVERED"],
    },
    { value: "completed", label: "Selesai", statuses: ["COMPLETED"] },
    { value: "other", label: "Lainnya", statuses: ["CANCELLED", "DISPUTED"] },
  ];

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/");
      } else if (!user?.isSeller) {
        router.push("/seller/activate");
      } else {
        fetchOrders();
      }
    }
  }, [authLoading, isAuthenticated, user, router]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const params = new URLSearchParams({ role: "worker" });

      const response = await fetch(`/api/orders?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredOrders = () => {
    const config = tabsConfig.find((t) => t.value === currentTab);
    if (!config) return orders;
    return orders.filter((order) => config.statuses.includes(order.status));
  };

  const filteredOrders = getFilteredOrders();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
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

  return (
    <SellerLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Pesanan Saya</h1>

        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList>
            {tabsConfig.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabsConfig.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-6">
              {filteredOrders.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <TbInbox className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      Tidak ada pesanan
                    </h3>
                    <p className="text-muted-foreground">
                      Tidak ada pesanan dengan status "{tab.label}" saat ini.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <Card key={order.id} className="overflow-hidden">
                      <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                        <Image
                          src={
                            order.service.images[0] || "/placeholder-image.png"
                          }
                          alt={order.title}
                          width={120}
                          height={90}
                          className="rounded-lg object-cover border"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                              {order.title}
                            </h3>
                            <Badge className={statusMap[order.status]?.color}>
                              {createElement(statusMap[order.status]?.icon, {
                                className: "h-4 w-4 mr-1.5",
                              })}
                              {statusMap[order.status]?.text}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Dipesan oleh:{" "}
                            <strong>{order.buyer.fullName}</strong>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Tenggat Waktu:{" "}
                            <strong>{formatDate(order.dueDate)}</strong>
                          </p>
                        </div>
                        <div className="flex flex-col md:items-end justify-between shrink-0 md:pl-4 md:border-l">
                          <p className="text-lg font-bold text-primary mb-2 md:mb-0">
                            Rp {Number(order.price).toLocaleString("id-ID")}
                          </p>
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/seller/orders/${order.id}`}>
                              Kelola Pesanan
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </SellerLayout>
  );
};

export default SellerOrdersPage;
