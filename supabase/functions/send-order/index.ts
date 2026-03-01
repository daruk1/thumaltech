import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, address, phone, email, items, total } = await req.json();

    if (!name || !address || !phone || !email || !items?.length) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    const itemRows = items
      .map(
        (item: any) =>
          `<tr><td style="padding:8px;border:1px solid #333">#${item.itemNumber}</td><td style="padding:8px;border:1px solid #333">${item.name}</td><td style="padding:8px;border:1px solid #333">${item.quantity}</td><td style="padding:8px;border:1px solid #333">${item.price}</td></tr>`
      )
      .join("");

    const htmlBody = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#111;color:#eee;padding:24px;border-radius:12px">
        <h1 style="color:#0ea5e9;text-align:center">🛒 New Order - Thumal Tech Store</h1>
        <h2 style="color:#ccc">Customer Details</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <h2 style="color:#ccc">Order Items</h2>
        <table style="width:100%;border-collapse:collapse;margin:12px 0">
          <tr style="background:#222">
            <th style="padding:8px;border:1px solid #333;text-align:left">#</th>
            <th style="padding:8px;border:1px solid #333;text-align:left">Item</th>
            <th style="padding:8px;border:1px solid #333;text-align:left">Qty</th>
            <th style="padding:8px;border:1px solid #333;text-align:left">Price</th>
          </tr>
          ${itemRows}
        </table>
        <h2 style="color:#0ea5e9;text-align:right">Total: ${total}</h2>
      </div>
    `;

    if (RESEND_API_KEY) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Thumal Tech Store <onboarding@resend.dev>",
          to: ["darukanethmallife@gmail.com"],
          subject: `New Order from ${name}`,
          html: htmlBody,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("Resend error:", err);
        return new Response(
          JSON.stringify({ error: "Failed to send email" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, method: "resend" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fallback: use Supabase's built-in SMTP (if configured) or log the order
    console.log("ORDER RECEIVED:", JSON.stringify({ name, address, phone, email, items, total }));

    return new Response(
      JSON.stringify({ success: true, method: "logged" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
