import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft, Package, MapPin, XCircle, Loader2, ShoppingBag, Edit3, Check, X,
} from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface OrderItem {
  id: string;
  item_number: number;
  name: string;
  price_num: number;
  quantity: number;
}

interface Order {
  id: string;
  customer_name: string;
  address: string;
  phone: string;
  email: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  confirmed: "bg-blue-500/20 text-blue-400",
  shipped: "bg-purple-500/20 text-purple-400",
  delivered: "bg-green-500/20 text-green-400",
  cancelled: "bg-destructive/20 text-destructive",
};

const MyOrders = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editAddress, setEditAddress] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  const fetchOrders = async () => {
    if (!user) return;
    setLoading(true);
    const { data: ordersData, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Failed to load orders", variant: "destructive" });
      setLoading(false);
      return;
    }

    const ordersWithItems: Order[] = [];
    for (const order of ordersData || []) {
      const { data: itemsData } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", order.id);
      ordersWithItems.push({ ...order, items: itemsData || [] });
    }
    setOrders(ordersWithItems);
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const handleEditAddress = (order: Order) => {
    setEditingOrderId(order.id);
    setEditAddress(order.address);
  };

  const handleSaveAddress = async (orderId: string) => {
    setSaving(true);
    const { error } = await supabase
      .from("orders")
      .update({ address: editAddress.trim() })
      .eq("id", orderId);

    if (error) {
      toast({ title: "Failed to update address", variant: "destructive" });
    } else {
      toast({ title: "Address updated!" });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, address: editAddress.trim() } : o))
      );
    }
    setEditingOrderId(null);
    setSaving(false);
  };

  const handleCancelOrder = async (orderId: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", orderId);

    if (error) {
      toast({ title: "Failed to cancel order", variant: "destructive" });
    } else {
      toast({ title: "Order cancelled" });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "cancelled" } : o))
      );
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
          My <span className="text-primary">Orders</span>
        </h1>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center gap-4 mt-20">
            <ShoppingBag className="w-16 h-16 text-muted-foreground" />
            <p className="text-muted-foreground">No orders yet</p>
            <Button onClick={() => navigate("/")} variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Start Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="rounded-xl bg-card border border-border p-6">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString("en-LK", {
                          year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusColors[order.status] || statusColors.pending}`}>
                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-2 mb-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <span className="text-foreground">
                        {item.name} <span className="text-muted-foreground">x{item.quantity}</span>
                      </span>
                      <span className="text-foreground font-semibold">
                        LKR {(item.price_num * item.quantity).toLocaleString("en-LK", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-border pt-3 mb-4 space-y-1 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>LKR {Number(order.subtotal).toLocaleString("en-LK", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>LKR {Number(order.shipping).toLocaleString("en-LK", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between font-bold text-primary">
                    <span>Total</span>
                    <span>LKR {Number(order.total).toLocaleString("en-LK", { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  {editingOrderId === order.id ? (
                    <div className="flex-1 flex gap-2">
                      <Input
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        className="text-sm"
                      />
                      <Button size="sm" onClick={() => handleSaveAddress(order.id)} disabled={saving} className="gap-1">
                        {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingOrderId(null)}>
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">{order.address}</p>
                  )}
                </div>

                {/* Actions */}
                {order.status !== "cancelled" && order.status !== "delivered" && (
                  <div className="flex gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => handleEditAddress(order)}
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit Address
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive" className="gap-1.5">
                          <XCircle className="w-3.5 h-3.5" /> Cancel Order
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. Your order will be cancelled.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep Order</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleCancelOrder(order.id)}>
                            Yes, Cancel
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
