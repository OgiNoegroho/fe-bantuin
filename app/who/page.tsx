"use client";
import { useState, useEffect } from 'react';
import PublicLayout from "@/components/layouts/PublicLayout";

const Who = () => {
  const [scrollY, setScrollY] = useState(0);
  const [activeValue, setActiveValue] = useState(0);
  const [statsInView, setStatsInView] = useState(false);
  const [counts, setCounts] = useState([0, 0, 0, 0]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveValue((prev) => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Intersection Observer untuk trigger animasi saat stats terlihat
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStatsInView(true);
        }
      },
      { threshold: 0.3 }
    );

    const statsElement = document.getElementById('stats-section');
    if (statsElement) {
      observer.observe(statsElement);
    }

    return () => {
      if (statsElement) {
        observer.unobserve(statsElement);
      }
    };
  }, []);

  // Animasi count-up
  useEffect(() => {
    if (!statsInView) return;

    const targets = [500, 50, 1200, 4.9];
    const duration = 1000; // 2 detik
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setCounts(targets.map(target => {
        const value = Math.min(target * progress, target);
        return target === 4.9 ? Math.round(value * 10) / 10 : Math.floor(value);
      }));

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounts(targets);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [statsInView]);

  return (
    <PublicLayout>
    <div className="min-h-screen bg-background font-sans">
      {/* Hero Section with Parallax */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-primary/5 to-accent/10">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute top-20 right-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          ></div>
          <div 
            className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-accent/15 rounded-full blur-3xl"
            style={{ transform: `translateY(${scrollY * 0.2}px)`, animationDelay: '1s' }}
          ></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/10 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-accent/10 rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-10">

            {/* Main Heading with Gradient */}
            <h1 className="text-6xl md:text-8xl font-display font-black text-primary leading-tight">
              Tentang{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
                Bantuin
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
              Menghubungkan mahasiswa berbakat dengan peluang tak terbatas di{" "}
              <span className="text-primary font-bold">UIN Suska Riau</span>
            </p>

            {/* Enhanced Stats with Animation */}
            <div id="stats-section" className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-16">
              {[
                { value: counts[0], suffix: "", label: "Mahasiswa Aktif", color: "primary" },
                { value: counts[1], suffix: "", label: "Kategori Jasa", color: "accent" },
                { value: counts[2].toLocaleString('id-ID'), suffix: "", label: "Transaksi Sukses", color: "primary" },
                { value: counts[3], suffix: "/5", label: "Rating Pengguna", color: "accent" }
              ].map((stat, idx) => (
                <div 
                  key={idx}
                  className="group relative bg-card/60 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-border hover:border-primary transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-primary/20"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className="text-4xl md:text-5xl font-display font-black text-primary mb-3 group-hover:scale-110 transition-transform duration-300">
                      {stat.value}{stat.suffix}
                    </div>
                    <div className="text-xs md:text-sm text-muted-foreground font-semibold">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Story Section - NEW */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-display font-black text-foreground mb-6">
                Cerita <span className="text-primary">Kami</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
            </div>
            
            <div className="bg-card/80 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-border shadow-2xl space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p className="text-xl font-semibold text-foreground">
                Bantuin lahir dari pengalaman nyata mahasiswa UIN Suska Riau.
              </p>
              <p>
                Kami melihat banyak mahasiswa berbakat yang kesulitan menemukan peluang freelance, 
                sementara di sisi lain, banyak mahasiswa dan dosen yang membutuhkan bantuan untuk 
                berbagai keperluan akademik dan non-akademik.
              </p>
              <p>
                Dari situlah ide <span className="text-primary font-bold">Bantuin</span> muncul - 
                sebuah platform yang tidak hanya mempertemukan supply dan demand, tetapi juga 
                membangun ekosistem kolaboratif di mana setiap mahasiswa bisa berkembang dan saling mendukung.
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-border">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-2xl font-bold text-white">
                  B
                </div>
                <div>
                  <div className="font-bold text-foreground">Tim Bantuin</div>
                  <div className="text-sm text-muted-foreground">Mahasiswa untuk Mahasiswa</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section - Enhanced */}
      <section className="py-24 bg-muted/50 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Mission */}
              <div className="group relative bg-card rounded-3xl p-10 border-2 border-border hover:border-primary transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/50 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500 shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-display font-black text-foreground mb-6">Misi Kami</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    Memberdayakan mahasiswa UIN Suska Riau untuk mengembangkan keterampilan, 
                    membangun portofolio, dan mendapatkan penghasilan melalui platform yang 
                    <span className="text-primary font-bold"> aman, mudah, dan terpercaya</span>.
                  </p>
                  <ul className="mt-6 space-y-3">
                    {["Verifikasi ketat dengan NIM", "Sistem pembayaran aman", "Support 24/7"].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-muted-foreground">
                        <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Vision */}
              <div className="group relative bg-card rounded-3xl p-10 border-2 border-border hover:border-accent transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/50 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-500 shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-display font-black text-foreground mb-6">Visi Kami</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    Menjadi <span className="text-accent font-bold">platform marketplace jasa terdepan</span> yang 
                    menciptakan ekosistem kolaboratif di mana setiap mahasiswa UIN Suska Riau 
                    dapat tumbuh, berkembang, dan sukses bersama.
                  </p>
                  <ul className="mt-6 space-y-3">
                    {["Ekosistem kampus terintegrasi", "Peluang tanpa batas", "Komunitas solid"].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-muted-foreground">
                        <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section - Redesigned */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-display font-black text-foreground mb-6">
                Nilai-Nilai <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Kami</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Prinsip fundamental yang menjadi fondasi setiap keputusan dan tindakan kami
              </p>
              <div className="w-32 h-1 bg-gradient-to-r from-primary via-accent to-primary mx-auto rounded-full mt-6"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { 
                  title: "Terpercaya", 
                  desc: "Verifikasi ketat menggunakan NIM dan email kampus resmi untuk menjamin keamanan setiap transaksi", 
                  icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                  gradient: "from-primary to-accent/50"
                },
                { 
                  title: "Beragam", 
                  desc: "Puluhan kategori jasa dari desain grafis, pengetikan, editing video, hingga konsultasi akademik", 
                  icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
                  gradient: "from-primary to-accent/50"
                },
                { 
                  title: "Kolaboratif", 
                  desc: "Membangun jejaring kuat antar mahasiswa untuk saling support dan berkembang bersama", 
                  icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                  gradient: "from-primary to-accent/50"
                },
                { 
                  title: "User-Friendly", 
                  desc: "Interface intuitif yang mudah digunakan bahkan untuk pengguna pertama kali", 
                  icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4",
                  gradient: "from-primary to-accent/50"
                },
                { 
                  title: "Responsif", 
                  desc: "Tim support yang sigap 24/7 siap membantu menyelesaikan setiap kendala dengan cepat", 
                  icon: "M13 10V3L4 14h7v7l9-11h-7z",
                  gradient: "from-primary to-accent/50"
                },
                { 
                  title: "Transparan", 
                  desc: "Sistem rating dan review terbuka untuk memastikan kualitas dan akuntabilitas layanan", 
                  icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
                  gradient: "from-primary to-accent/50"
                }
              ].map((value, idx) => (
                <div 
                  key={idx}
                  className={`relative bg-card rounded-2xl p-8 border-2 border-border hover:border-primary transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group ${activeValue === idx ? 'ring-2 ring-primary shadow-xl shadow-primary/20' : ''}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative">
                    <div className={`w-16 h-16 bg-gradient-to-br ${value.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={value.icon} />
                      </svg>
                    </div>
                    <h4 className="text-2xl font-display font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {value.title}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary"></div>
        <div className="absolute inset-0 bg-grid-white opacity-10"></div>
        
        {/* Animated shapes */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 text-white">
            
            <h2 className="text-5xl md:text-7xl font-display font-black leading-tight">
              Siap Memulai<br />Perjalananmu?
            </h2>
            
            <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto leading-relaxed">
              Daftar sekarang dan jadilah bagian dari ekosistem kolaboratif mahasiswa UIN Suska Riau
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <button className="group px-10 py-5 bg-white text-primary rounded-2xl font-bold text-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3">
               <span>Daftar Sebagai Penyedia</span>                
              </button>
              <button className="group px-10 py-5 bg-transparent border-2 border-white text-white rounded-2xl font-bold text-lg hover:bg-white hover:text-primary transition-all duration-300 flex items-center justify-center gap-3">
                <span>Jelajahi Jasa</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
    </PublicLayout>
  );
};

export default Who;