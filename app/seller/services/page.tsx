"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import SellerLayout from "@/components/layouts/SellerLayout";
import ServiceForm, {
  ServiceFormData,
} from "@/components/services/ServiceForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TbPlus,
  TbDots,
  TbEdit,
  TbTrash,
  TbEye,
  TbEyeOff,
  TbStar,
  TbShoppingCart,
} from "react-icons/tb";
import Image from "next/image";

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  deliveryTime: number;
  revisions: number;
  images: string[];
  totalOrders: number;
  avgRating: number;
  totalReviews: number;
  isActive: boolean;
  status: string;
  createdAt: string;
}

const categoryNames: Record<string, string> = {
  DESIGN: "Desain",
  DATA: "Data",
  CODING: "Pemrograman",
  WRITING: "Penulisan",
  EVENT: "Acara",
  TUTOR: "Tutor",
  TECHNICAL: "Teknis",
  OTHER: "Lainnya",
};

const SellerServicesPage = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/");
      } else if (!user?.isSeller) {
        router.push("/seller/activate");
      } else {
        fetchServices();
      }
    }
  }, [authLoading, isAuthenticated, user, router]);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("/api/services/seller/my-services", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setServices(data.data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = async (formData: ServiceFormData) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        await fetchServices();
        setFormOpen(false);
      } else {
        alert(data.error || "Gagal membuat jasa");
      }
    } catch (error) {
      console.error("Error creating service:", error);
      alert("Terjadi kesalahan saat membuat jasa");
    }
  };

  const handleUpdateService = async (formData: ServiceFormData) => {
    if (!editingService) return;

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`/api/services/${editingService.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        await fetchServices();
        setEditingService(null);
        setFormOpen(false);
      } else {
        alert(data.error || "Gagal mengupdate jasa");
      }
    } catch (error) {
      console.error("Error updating service:", error);
      alert("Terjadi kesalahan saat mengupdate jasa");
    }
  };

  const handleToggleActive = async (serviceId: string) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`/api/services/${serviceId}/toggle`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        await fetchServices();
      } else {
        alert(data.error || "Gagal mengubah status jasa");
      }
    } catch (error) {
      console.error("Error toggling service:", error);
      alert("Terjadi kesalahan");
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus jasa ini?")) return;

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`/api/services/${serviceId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        await fetchServices();
      } else {
        alert(data.error || "Gagal menghapus jasa");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Terjadi kesalahan saat menghapus jasa");
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingService(null);
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

  if (!user?.isSeller) {
    return null;
  }

  return (
    <SellerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Jasa Saya</h1>
            <p className="text-muted-foreground">
              Kelola semua jasa yang Anda tawarkan
            </p>
          </div>
          <Button onClick={() => setFormOpen(true)}>
            <TbPlus className="mr-2" />
            Tambah Jasa Baru
          </Button>
        </div>

        {/* Services Grid */}
        {services.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold mb-2">Belum ada jasa</h3>
              <p className="text-muted-foreground mb-4">
                Mulai tawarkan keahlianmu dengan membuat jasa baru
              </p>
              <Button onClick={() => setFormOpen(true)}>
                <TbPlus className="mr-2" />
                Buat Jasa Pertama
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="overflow-hidden">
                <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                  {service.images.length > 0 ? (
                    <Image
                      src={service.images[0]}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-4xl">📦</span>
                    </div>
                  )}

                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon-sm"
                          variant="secondary"
                          className="bg-white/90 hover:bg-white"
                        >
                          <TbDots className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(service)}>
                          <TbEdit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleActive(service.id)}
                        >
                          {service.isActive ? (
                            <>
                              <TbEyeOff className="mr-2 h-4 w-4" />
                              Nonaktifkan
                            </>
                          ) : (
                            <>
                              <TbEye className="mr-2 h-4 w-4" />
                              Aktifkan
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteService(service.id)}
                          variant="destructive"
                        >
                          <TbTrash className="mr-2 h-4 w-4" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="absolute top-2 left-2 flex gap-2">
                    <Badge variant={service.isActive ? "default" : "secondary"}>
                      {service.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                    <Badge variant="outline" className="bg-white/90">
                      {categoryNames[service.category]}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                    {service.title}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between text-sm mb-3">
                    <div className="flex items-center gap-1">
                      <TbStar className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">
                        {Number(service.avgRating) > 0
                          ? Number(service.avgRating).toFixed(1)
                          : "Baru"}
                      </span>
                      {service.totalReviews > 0 && (
                        <span className="text-muted-foreground">
                          ({service.totalReviews})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-muted-foreground">
                      <TbShoppingCart className="h-4 w-4" />
                      <span>{service.totalOrders} pesanan</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground">Harga</p>
                      <p className="font-bold text-primary">
                        Rp {service.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/services/${service.id}`)}
                    >
                      Lihat Detail
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Form Drawer */}
        <ServiceForm
          open={formOpen}
          onOpenChange={handleFormClose}
          onSubmit={editingService ? handleUpdateService : handleCreateService}
          initialData={editingService || undefined}
          mode={editingService ? "edit" : "create"}
        />
      </div>
    </SellerLayout>
  );
};

export default SellerServicesPage;
