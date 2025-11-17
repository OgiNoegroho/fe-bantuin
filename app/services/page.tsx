"use client";

import { useState, useEffect } from "react";
import PublicLayout from "@/components/layouts/PublicLayout";
import ServiceCard from "@/components/services/ServiceCard";
import ServiceFilters, {
  FilterState,
} from "@/components/services/ServiceFilters";
import { Button } from "@/components/ui/button";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";

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
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Jelajahi Jasa
            </h1>
            <p className="text-muted-foreground">
              Temukan berbagai jasa profesional dari mahasiswa UIN Suska Riau
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <ServiceFilters
                  onFilterChange={handleFilterChange}
                  onSearch={handleSearch}
                />
              </div>
            </div>

            {/* Services Grid */}
            <div className="lg:col-span-3">
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
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Tidak ada jasa ditemukan
                  </h3>
                  <p className="text-muted-foreground">
                    Coba ubah filter atau kata kunci pencarian Anda
                  </p>
                </div>
              ) : (
                <>
                  {/* Results Info */}
                  <div className="mb-4 text-sm text-muted-foreground">
                    Menampilkan {services.length} dari {pagination.total} jasa
                  </div>

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
                                className="flex items-center px-2"
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
