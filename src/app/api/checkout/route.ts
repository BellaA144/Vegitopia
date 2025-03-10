import { NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    console.log("📩 API /api/checkout HIT!");

    const body = await req.json();

    console.log("📝 Request body:", body);

    if (!body || !body.cart) {
      console.error("❌ Invalid request: Missing cart data");

      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    console.log("🛒 Cart data:", body.cart);

    const supabase = await createClient();

    if (!supabase) {
      console.error("❌ Supabase client initialization failed!");

      return NextResponse.json({ message: "Server error: Supabase init failed" }, { status: 500 });
    }

    const { data: session, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.session) {
      console.error("❌ Authentication error:", sessionError);

      return NextResponse.json({ message: "Unauthorized: Invalid session" }, { status: 401 });
    }

    const user = session.session.user;

    console.log("👤 Authenticated User:", user);

    // 🔹 Insert transaksi ke database
    const transactionData = body.cart.map((item: any) => ({
      user_id: user.id,
      product_id: item.product_id,
      quantity: item.quantity,
      total_price: item.total_price ?? 0,
    }));

    console.log("📝 Data to be inserted into transactions:", JSON.stringify(transactionData, null, 2));

    const { data, error } = await supabase.from("transactions").insert(transactionData).select();

    if (error) {
      console.error("❌ Database insert error:", JSON.stringify(error, null, 2));

      return NextResponse.json({ message: "Database error", error: error.message }, { status: 500 });
    }

    console.log("✅ Transaction saved:", data);

    // 🔹 Hapus data dari cart setelah transaksi sukses
    const { error: deleteError } = await supabase
      .from("cart")
      .delete()
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("❌ Error deleting cart items:", deleteError);

      return NextResponse.json({ message: "Cart cleanup failed", error: deleteError.message }, { status: 500 });
    }

    console.log("🛒 Cart successfully cleared!");

    // 🔹 Kurangi stok produk menggunakan transaksi batch
    const updateStockPromises = body.cart.map(async (item: any) => {
      // 🛑 Cek apakah produk ada dan stok valid
      const { data: product, error: fetchError } = await supabase
        .from("products")
        .select("stock")
        .eq("product_id", item.product_id)
        .single();

      if (fetchError || !product) {
        console.error(`❌ Error fetching stock for product ${item.product_id}:`, fetchError);

        return;
      }

      console.log(`🔄 Updating stock for product ${item.product_id}, reducing by ${item.quantity}`);
      console.log(`📦 Current stock: ${product.stock}`);

      const newStock = product.stock ?? 0; // Pastikan stock tidak null

      if (newStock < 0) {
        console.error(`❌ Not enough stock for product ${item.product_id}`);

        return;
      }

      // 🔄 Lakukan update stok
      const { error: stockError } = await supabase
        .from("products")
        .update({ stock: newStock })
        .eq("product_id", item.product_id);

      if (stockError) {
        console.error(`❌ Error updating stock for product ${item.product_id}:`, stockError);
      } else {
        console.log(`✅ Stock updated for product ${item.product_id}: New stock is ${newStock}`);
      }
    });

    await Promise.all(updateStockPromises);


    console.log("📉 Product stock updated!");

    return NextResponse.json({ message: "Checkout successful", transaction: data }, { status: 200 });

  } catch (error) {
    console.error("❌ API Checkout Error:", error);

    return NextResponse.json(
      { message: "Internal Server Error", error: error instanceof Error ? error.message : JSON.stringify(error) },
      { status: 500 }
    );
  }
}
