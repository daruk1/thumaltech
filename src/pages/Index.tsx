import { Youtube, MessageCircle, Smartphone, Monitor, Camera, Cpu, ShoppingBag, Phone, ShoppingCart, Plus, User, Package, LogOut } from "lucide-react";
import ChatBot from "@/components/ChatBot";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import heroImg from "@/assets/thumal-tech-logo.png";
import heroBg from "@/assets/hero-bg.jpg";
import product1 from "@/assets/product-1.png";
import product2 from "@/assets/product-2.png";
import product3 from "@/assets/product-3.png";
import product4 from "@/assets/product-4.png";
import product5 from "@/assets/product-5.png";
import product6 from "@/assets/product-6.png";

const YOUTUBE_URL = "https://youtube.com/@thumaltech?si=h7wPDlZXb5lVXjz4";
const WHATSAPP_URL = "https://whatsapp.com/channel/0029Va55eIE8kyyFFFTx9a3Q";
const STORE_URL = "https://wa.me/thumaltech";

const PRODUCTS = [
  { itemNumber: 1, name: "HD Aerial Drone", price: "LKR 15,600.00", priceNum: 15600, image: product1 },
  { itemNumber: 2, name: "Brushless Motor Drone", price: "LKR 13,599.00", priceNum: 13599, image: product2 },
  { itemNumber: 3, name: "E99 Pro 4K Drone", price: "LKR 8,500.00", priceNum: 8500, image: product3 },
  { itemNumber: 4, name: "Mini Dual Camera Drone", price: "LKR 10,500.00", priceNum: 10500, image: product4 },
  { itemNumber: 5, name: "Gaming Earphone", price: "LKR 1,400.00", priceNum: 1400, image: product5 },
  { itemNumber: 6, name: "Wireless Keyboard & Mouse", price: "LKR 2,400.00", priceNum: 2400, image: product6 },
];

const Index = () => {
  const { addToCart, totalItems } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAddToCart = (product: typeof PRODUCTS[0]) => {
    addToCart(product);
    toast({ title: `${product.name} added to cart!` });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Floating Nav Buttons */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-2">
        {user ? (
          <>
            <button
              onClick={() => navigate("/my-orders")}
              className="flex items-center gap-2 px-3 py-2.5 rounded-full bg-card border border-border text-foreground text-sm font-semibold hover:border-primary/50 transition-all"
            >
              <Package className="w-4 h-4" /> Orders
            </button>
            <button
              onClick={async () => { await signOut(); toast({ title: "Signed out" }); }}
              className="flex items-center gap-2 px-3 py-2.5 rounded-full bg-card border border-border text-muted-foreground text-sm hover:border-destructive/50 hover:text-destructive transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate("/auth")}
            className="flex items-center gap-2 px-3 py-2.5 rounded-full bg-card border border-border text-foreground text-sm font-semibold hover:border-primary/50 transition-all"
          >
            <User className="w-4 h-4" /> Sign In
          </button>
        )}
        <button
          onClick={() => navigate("/checkout")}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/30 hover:scale-105 transition-transform"
        >
          <ShoppingCart className="w-5 h-5" />
          {totalItems > 0 && (
            <span className="bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </div>

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
            {["wQN2D_jEyDk", "c6UMRpGOyGU", "72TkPN3Zd8o"].map((id) => (
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
            <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-primary/50 text-primary hover:bg-primary/10 font-semibold transition-all">
              <Youtube className="w-5 h-5" /> View All Videos
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
              <div key={item.title} className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:box-glow">
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
          <p className="text-muted-foreground text-center mb-2 max-w-lg mx-auto">
            Buy tested & reviewed products directly from us
          </p>
          <p className="text-muted-foreground text-center mb-12 flex items-center justify-center gap-2">
            <Phone className="w-4 h-4 text-primary" />
            <a href="tel:+94782099026" className="text-primary hover:underline font-semibold">+94 782099026</a>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map((product) => (
              <div
                key={product.itemNumber}
                className="group rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:box-glow bg-card"
              >
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-md font-display">
                    #{product.itemNumber}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-sm font-semibold text-foreground mb-1">{product.name}</h3>
                  <p className="text-primary font-bold text-lg mb-3">{product.price}</p>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary/10 border border-primary/30 text-primary font-semibold text-sm hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    <Plus className="w-4 h-4" /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a href={STORE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-primary/50 text-primary hover:bg-primary/10 font-semibold transition-all">
              <ShoppingBag className="w-5 h-5" /> Visit Thumal Tech Store
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-display text-sm text-muted-foreground">© 2026 Thumal Tech. All rights reserved. Made by Daruka</p>
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
      <ChatBot />
    </div>
  );
};

export default Index;
