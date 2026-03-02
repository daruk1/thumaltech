import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SHIPPING_COST = 400;

const Checkout = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const grandTotal = totalPrice + SHIPPING_COST;

  // Pre-fill email from auth
  useEffect(() => {
    if (user?.email) setEmail(user.email);
    if (user?.user_metadata?.full_name) setName(user.user_metadata.full_name);
  }, [user]);

  const handleCheckout = async () => {
    if (!user) {
      toast({ title: "Please sign in first", description: "You need an account to place orders.", variant: "destructive" });
      navigate("/auth");
      return;
    }

    if (!name.trim() || !address.trim() || !phone.trim() || !email.trim()) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    if (items.length === 0) {
      toast({ title: "Your cart is empty", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      // 1. Save order to database
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          customer_name: name.trim(),
          address: address.trim(),
          phone: phone.trim(),
          email: email.trim(),
          subtotal: totalPrice,
          shipping: SHIPPING_COST,
          total: grandTotal,
        })
        .select("id")
        .single();

      if (orderError) throw orderError;

      // 2. Save order items
      const orderItems = items.map((item) => ({
        order_id: orderData.id,
        item_number: item.itemNumber,
        name: item.name,
        price_num: item.priceNum,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Send email notification
      const totalFormatted = `LKR ${grandTotal.toLocaleString("en-LK", { minimumFractionDigits: 2 })}`;
      await supabase.functions.invoke("send-order", {
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

      clearCart();
      toast({ title: "Order placed successfully!" });
      navigate("/my-orders");
    } catch (err: any) {
      console.error("Order error:", err);
      toast({ title: "Failed to submit order", description: err.message || "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

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

        {/* Login prompt */}
        {!authLoading && !user && (
          <div className="rounded-xl bg-primary/10 border border-primary/30 p-4 mb-6 flex items-center justify-between">
            <p className="text-sm text-foreground">Sign in to place orders and track them</p>
            <Button size="sm" onClick={() => navigate("/auth")} className="gap-1.5">
              Sign In
            </Button>
          </div>
        )}

        {/* Cart Items */}
        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <div key={item.itemNumber} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Item #{item.itemNumber}</p>
                <h3 className="font-display text-sm font-semibold text-foreground truncate">{item.name}</h3>
                <p className="text-primary font-bold">{item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.itemNumber, item.quantity - 1)} className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-foreground hover:bg-primary/20 transition-colors">
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center font-semibold text-foreground">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.itemNumber, item.quantity + 1)} className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-foreground hover:bg-primary/20 transition-colors">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <button onClick={() => removeFromCart(item.itemNumber)} className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Customer Details */}
        <div className="rounded-xl bg-card border border-border p-6 mb-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">Customer Details</h2>
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
              <span className="text-foreground font-semibold">LKR {totalPrice.toLocaleString("en-LK", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">Shipping</span>
              <span className="text-foreground font-semibold">LKR {SHIPPING_COST.toLocaleString("en-LK", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between items-center">
              <span className="text-foreground font-semibold">Total</span>
              <span className="font-display text-2xl font-bold text-primary">LKR {grandTotal.toLocaleString("en-LK", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
          <Button onClick={handleCheckout} disabled={loading} className="w-full gap-2 text-lg py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            {loading ? "Sending..." : "Checkout & Send Order"}
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-3">Order will be sent to Thumal Tech via email</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
