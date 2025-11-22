"use client";

import { useState, useEffect } from "react";
import PublicLayout from "@/components/layouts/PublicLayout";
import ServiceCard from "@/components/services/ServiceCard";
import ServiceFilters, {
  FilterState,
} from "@/components/services/ServiceFilters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  TbChevronLeft,
  TbChevronRight,
  TbAdjustmentsHorizontal,
  TbSearch,
} from "react-icons/tb";

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  deliveryTime: number;
  images: string[];
  avgRating: number;
  totalReviews: number;
  seller: {
    id: string;
    fullName: string;
    profilePicture: string | null;
    major: string | null;
    batch: string | null;
    avgRating: number;
  };
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<FilterState>({ sortBy: "newest" });
  const [searchQuery, setSearchQuery] = useState("");

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", pagination.page.toString());
      params.append("limit", pagination.limit.toString());
      params.append("sortBy", filters.sortBy);

      if (searchQuery) params.append("q", searchQuery);
      if (filters.category) params.append("category", filters.category);
      if (filters.priceMin)
        params.append("priceMin", filters.priceMin.toString());
      if (filters.priceMax)
        params.append("priceMax", filters.priceMax.toString());
      if (filters.ratingMin)
        params.append("ratingMin", filters.ratingMin.toString());

      const response = await fetch(`/api/services?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setServices(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [pagination.page, filters, searchQuery]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Jelajahi Jasa
            </h1>
            <p className="text-gray-600">
              Temukan {pagination.total} jasa profesional dari mahasiswa UIN
              Suska Riau
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <TbSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Cari jasa yang kamu butuhkan..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-12 h-12 text-base bg-white border-gray-300 focus:border-green-600 focus:ring-green-600"
              />
            </div>
          </div>

          <div className="flex gap-8">
            {/* Desktop Sidebar Filter */}
            <div className="hidden lg:block w-64 shrink-0">
              <div className="bg-white border-2 border-primary rounded-lg p-6 sticky top-32">
                <div className="flex items-center gap-2 mb-6">
                  <TbAdjustmentsHorizontal className="h-5 w-5" />
                  <h2 className="text-lg font-semibold">Filter</h2>
                </div>
                <ServiceFilters
                  onFilterChange={handleFilterChange}
                  onSearch={handleSearch}
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Mobile Filter Button */}
              <div className="lg:hidden mb-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <TbAdjustmentsHorizontal className="h-4 w-4 mr-2" />
                      Filter & Urutkan
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Filter</SheetTitle>
                      <SheetDescription>
                        Sesuaikan pencarian Anda
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                      <ServiceFilters
                        onFilterChange={handleFilterChange}
                        onSearch={handleSearch}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Sort Options */}
              <div className="bg-primary rounded-lg p-4 mb-6 flex items-center justify-between gap-4 flex-wrap">
                <p className="text-sm text-background">
                  Menampilkan {services.length} dari {pagination.total} hasil
                </p>
                <div className="flex items-center gap-3">
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) =>
                      handleFilterChange({ ...filters, sortBy: value })
                    }
                  >
                    <SelectTrigger className="w-[180px] bg-background">
                      <SelectValue placeholder="Urutkan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Terbaru</SelectItem>
                      <SelectItem value="popular">Terpopuler</SelectItem>
                      <SelectItem value="rating">Rating Tertinggi</SelectItem>
                      <SelectItem value="price-low">Harga Terendah</SelectItem>
                      <SelectItem value="price-high">
                        Harga Tertinggi
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="h-96 bg-muted animate-pulse rounded-lg"
                    />
                  ))}
                </div>
              ) : services.length === 0 ? (
                <div className="bg-white rounded-lg p-12 text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Tidak ada jasa ditemukan
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Coba ubah filter atau kata kunci pencarian Anda
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilters({ sortBy: "newest" });
                      setSearchQuery("");
                    }}
                  >
                    Reset Filter
                  </Button>
                </div>
              ) : (
                <>
                  {/* Services Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                    {services.map((service) => (
                      <ServiceCard key={service.id} service={service} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="h-10 w-10"
                      >
                        <TbChevronLeft className="h-4 w-4" />
                      </Button>

                      <div className="flex gap-2">
                        {[...Array(pagination.totalPages)].map((_, i) => {
                          const page = i + 1;
                          // Show first, last, current, and adjacent pages
                          if (
                            page === 1 ||
                            page === pagination.totalPages ||
                            Math.abs(page - pagination.page) <= 1
                          ) {
                            return (
                              <Button
                                key={page}
                                variant={
                                  pagination.page === page
                                    ? "default"
                                    : "outline"
                                }
                                size="icon"
                                onClick={() => handlePageChange(page)}
                                className={`h-10 w-10 ${
                                  pagination.page === page
                                    ? "bg-green-600 hover:bg-green-700 text-white"
                                    : ""
                                }`}
                              >
                                {page}
                              </Button>
                            );
                          } else if (
                            page === pagination.page - 2 ||
                            page === pagination.page + 2
                          ) {
                            return (
                              <span
                                key={page}
                                className="flex items-center px-2 text-gray-400"
                              >
                                ...
                              </span>
                            );
                          }
                          return null;
                        })}
                      </div>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                        className="h-10 w-10"
                      >
                        <TbChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ServicesPage;
