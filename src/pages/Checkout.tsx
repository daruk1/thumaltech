import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, Send, Loader2, CheckCircle, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SHIPPING_COST = 400;

const OrderConfirmation = ({ email }: { email: string }) => {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(24 * 60 * 60); // 24 hours

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
        <CheckCircle className="w-10 h-10 text-green-500" />
      </div>
      <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
        Order Placed Successfully!
      </h1>
      <p className="text-muted-foreground max-w-md">
        We will reply within <span className="text-primary font-semibold">24 hours</span>
      </p>

      {/* Timer */}
      <div className="flex items-center gap-2 text-muted-foreground">
        <Clock className="w-5 h-5 text-primary" />
        <div className="flex gap-1 font-mono text-lg font-bold text-foreground">
          <span className="bg-card border border-border rounded-lg px-3 py-2">{String(hours).padStart(2, "0")}</span>
          <span className="flex items-center text-primary">:</span>
          <span className="bg-card border border-border rounded-lg px-3 py-2">{String(mins).padStart(2, "0")}</span>
          <span className="flex items-center text-primary">:</span>
          <span className="bg-card border border-border rounded-lg px-3 py-2">{String(secs).padStart(2, "0")}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2 text-muted-foreground">
        <Mail className="w-5 h-5 text-primary" />
        <p className="text-sm">
          Check your email: <span className="text-foreground font-semibold">{email}</span>
        </p>
      </div>

      <Button onClick={() => navigate("/")} variant="outline" className="gap-2 mt-4">
        <ArrowLeft className="w-4 h-4" /> Back to Store
      </Button>
    </div>
  );
};

const Checkout = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderEmail, setOrderEmail] = useState("");

  const grandTotal = totalPrice + SHIPPING_COST;

  const handleCheckout = async () => {
    if (!name.trim() || !address.trim() || !phone.trim() || !email.trim()) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    if (items.length === 0) {
      toast({ title: "Your cart is empty", variant: "destructive" });
      return;
    }

    setLoading(true);
    const totalFormatted = `LKR ${grandTotal.toLocaleString("en-LK", { minimumFractionDigits: 2 })}`;

    try {
      const { data, error } = await supabase.functions.invoke("send-order", {
        body: {
          name: name.trim(),
          address: address.trim(),
          phone: phone.trim(),
          email: email.trim(),
          items: items.map((item) => ({
            itemNumber: item.itemNumber,
            name: item.name,
            quantity: item.quantity,
            price: `LKR ${(item.priceNum * item.quantity).toLocaleString("en-LK", { minimumFractionDigits: 2 })}`,
          })),
          subtotal: `LKR ${totalPrice.toLocaleString("en-LK", { minimumFractionDigits: 2 })}`,
          shipping: `LKR ${SHIPPING_COST.toLocaleString("en-LK", { minimumFractionDigits: 2 })}`,
          total: totalFormatted,
        },
      });

      if (error) throw error;

      setOrderEmail(email.trim());
      setOrderPlaced(true);
      clearCart();
    } catch (err) {
      console.error("Order error:", err);
      toast({ title: "Failed to submit order", description: "Please try again or contact us directly.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return <OrderConfirmation email={orderEmail} />;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-4">
        <ShoppingBag className="w-16 h-16 text-muted-foreground" />
        <h1 className="font-display text-2xl font-bold text-foreground">Your Cart is Empty</h1>
        <Button onClick={() => navigate("/")} variant="outline" className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </button>

        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">
          Your <span className="text-primary">Cart</span>
        </h1>

        {/* Cart Items */}
        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <div
              key={item.itemNumber}
              className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Item #{item.itemNumber}</p>
                <h3 className="font-display text-sm font-semibold text-foreground truncate">
                  {item.name}
                </h3>
                <p className="text-primary font-bold">{item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.itemNumber, item.quantity - 1)}
                  className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-foreground hover:bg-primary/20 transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center font-semibold text-foreground">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.itemNumber, item.quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-foreground hover:bg-primary/20 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <button
                onClick={() => removeFromCart(item.itemNumber)}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Customer Details */}
        <div className="rounded-xl bg-card border border-border p-6 mb-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">
            Customer Details
          </h2>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="address">Delivery Address</Label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Your delivery address" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+94 7XXXXXXXX" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="mt-1" />
            </div>
          </div>
        </div>

        {/* Total & Checkout */}
        <div className="rounded-xl bg-card border border-primary/30 p-6 box-glow">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Subtotal</span>
              <span className="text-foreground font-semibold">
                LKR {totalPrice.toLocaleString("en-LK", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Shipping</span>
              <span className="text-foreground font-semibold">
                LKR {SHIPPING_COST.toLocaleString("en-LK", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between items-center">
              <span className="text-foreground font-semibold">Total</span>
              <span className="font-display text-2xl font-bold text-primary">
                LKR {grandTotal.toLocaleString("en-LK", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          <Button onClick={handleCheckout} disabled={loading} className="w-full gap-2 text-lg py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            {loading ? "Sending..." : "Checkout & Send Order"}
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-3">
            Order will be sent to Thumal Tech via email
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
