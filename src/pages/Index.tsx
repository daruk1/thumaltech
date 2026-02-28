import { Youtube, MessageCircle, Smartphone, Monitor, Camera, Cpu, ShoppingBag } from "lucide-react";
import heroImg from "@/assets/thumal-tech-logo.png";
import heroBg from "@/assets/hero-bg.jpg";
import product1 from "@/assets/product-1.png";
import product2 from "@/assets/product-2.png";
import product3 from "@/assets/product-3.png";
import product4 from "@/assets/product-4.png";

const YOUTUBE_URL = "https://youtube.com/@thumaltech?si=h7wPDlZXb5lVXjz4";
const WHATSAPP_URL = "https://whatsapp.com/channel/0029Va55eIE8kyyFFFTx9a3Q";

const PRODUCTS = [
  { name: "HD Aerial Drone", price: "LKR 4,500", image: product1, url: "https://wa.me/p/25727513903606477/21591454912740" },
  { name: "Brushless Motor Drone", price: "LKR 6,800", image: product2, url: "https://wa.me/p/25772645522367770/21591454912740" },
  { name: "E99 Pro 4K Drone", price: "LKR 3,200", image: product3, url: "https://wa.me/p/25436969965973648/21591454912740" },
  { name: "Mini Dual Camera Drone", price: "LKR 2,900", image: product4, url: "https://wa.me/p/33175652652050086/21591454912740" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />

        <div className="relative z-10 flex flex-col items-center gap-8 px-4 text-center">
          <div className="relative animate-float">
            <div className="w-48 h-48 md:w-60 md:h-60 rounded-full overflow-hidden border-4 border-primary/50 box-glow">
              <img src={heroImg} alt="Thumal Tech" className="w-full h-full object-cover" />
            </div>
          </div>

          <div>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-wider text-glow text-foreground">
              THUMAL <span className="text-primary">TECH</span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
              Tech Reviews • Gadgets • Tutorials • Unboxing
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-red-600 hover:bg-red-700 text-foreground font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-red-600/30"
            >
              <Youtube className="w-6 h-6" />
              Subscribe on YouTube
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-green-600 hover:bg-green-700 text-foreground font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-green-600/30"
            >
              <MessageCircle className="w-6 h-6" />
              Join WhatsApp Channel
            </a>
          </div>
        </div>
      </section>

      {/* Latest Videos */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-12 text-foreground">
            Latest <span className="text-primary">Videos</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "wQN2D_jEyDk",
              "c6UMRpGOyGU",
              "72TkPN3Zd8o",
            ].map((id) => (
              <div key={id} className="rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:box-glow">
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${id}`}
                    title="YouTube video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-primary/50 text-primary hover:bg-primary/10 font-semibold transition-all"
            >
              <Youtube className="w-5 h-5" />
              View All Videos
            </a>
          </div>
        </div>
      </section>

      {/* Content Categories */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-12 text-foreground">
            What You'll <span className="text-primary">Find Here</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Smartphone, title: "Smartphone Reviews", desc: "In-depth reviews of the latest smartphones" },
              { icon: Camera, title: "Drone & Camera", desc: "Aerial photography and camera tech" },
              { icon: Monitor, title: "Tech Tutorials", desc: "Step-by-step guides and how-tos" },
              { icon: Cpu, title: "Gadget Unboxing", desc: "First look at newest gadgets" },
              { icon: Youtube, title: "YouTube Shorts", desc: "Quick tech tips and tricks" },
              { icon: MessageCircle, title: "Community", desc: "Join the Thumal Tech family" },
            ].map((item) => (
              <div
                key={item.title}
                className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:box-glow"
              >
                <item.icon className="w-10 h-10 text-primary mb-4 group-hover:animate-pulse-glow" />
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Store */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-4 text-foreground">
            Thumal Tech <span className="text-primary">Store</span>
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">
            Buy tested & reviewed products directly from us via WhatsApp
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.map((product) => (
              <a
                key={product.name}
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:box-glow bg-card"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-sm font-semibold text-foreground mb-1">{product.name}</h3>
                  <p className="text-primary font-bold text-lg mb-3">{product.price}</p>
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-primary/80 group-hover:text-primary transition-colors">
                    <ShoppingBag className="w-4 h-4" />
                    Buy on WhatsApp
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-display text-sm text-muted-foreground">
            © 2025 Thumal Tech. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-green-500 transition-colors">
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
