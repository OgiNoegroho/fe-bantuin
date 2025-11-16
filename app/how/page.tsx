import PublicLayout from "@/components/layouts/PublicLayout";

/**
 * Page: Cara Kerja Bantuin
 */
const How = () => {
  return (
    <PublicLayout>
      {/* ==== HowItWorksPage ==== */}
      <div className="min-h-screen bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl text-center mb-12 text-foreground">Cara Kerja Bantuin</h1>

            <div className="grid gap-8">
              {/* Step 1 */}
              <div className="bg-card rounded-lg p-8 flex gap-6 border border-border">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl">
                  1
                </div>
                <div>
                  <h3 className="text-xl mb-2 text-foreground">Cari Jasa yang Dibutuhkan</h3>
                  <p className="text-muted-foreground">
                    Gunakan fitur pencarian dan filter untuk menemukan jasa profesional yang sesuai dengan kebutuhan Anda.
                    Lihat profil lengkap, rating, dan review dari pelanggan sebelumnya.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-card rounded-lg p-8 flex gap-6 border border-border">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-xl mb-2 text-foreground">Pesan & Bayar dengan Aman</h3>
                  <p className="text-muted-foreground">
                    Buat pesanan dengan detail pekerjaan yang jelas. Dana Anda akan ditahan dalam sistem escrow kami,
                    sehingga hanya akan diteruskan ke penyedia setelah pekerjaan selesai dengan memuaskan.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-card rounded-lg p-8 flex gap-6 border border-border">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl">
                  3
                </div>
                <div>
                  <h3 className="text-xl mb-2 text-foreground">Pantau Progress Real-time</h3>
                  <p className="text-muted-foreground">
                    Komunikasi langsung dengan penyedia jasa melalui chat. Pantau progress pekerjaan dengan update
                    berkala dan foto dokumentasi.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-card rounded-lg p-8 flex gap-6 border border-border">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl">
                  4
                </div>
                <div>
                  <h3 className="text-xl mb-2 text-foreground">Konfirmasi & Beri Review</h3>
                  <p className="text-muted-foreground">
                    Setelah pekerjaan selesai, konfirmasi penyelesaian dan berikan rating. Dana akan segera diteruskan
                    ke penyedia. Review Anda membantu pengguna lain membuat keputusan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default How;