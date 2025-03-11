"use client";

import { useRouter } from "next/navigation";
import { CartType } from "../types";
import { useEffect, useState, useTransition } from "react";
import { createClient } from "@/utils/supabase/client";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { Box, Button, IconButton, Snackbar, TextField, Typography, CircularProgress } from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";

type CartsProps = {
  initialData: CartType[];
};

export default function Carts({ initialData }: CartsProps) {
  const router = useRouter();
  const [cart, setCart] = useState<CartType[]>(initialData);
  const [isPending, startTransition] = useTransition();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCart() {
      if (initialData.length > 0) return;

      try {
        const supabase = createClient();
        const { data, error } = await supabase.from("carts").select("*").order("created_at", { ascending: false });

        if (!error) setCart(data);
      } catch (error) {
        console.error("❌ Fetch Cart Error:", error);
      }
    }

    fetchCart();
  }, [initialData]);

  async function updateQuantity(cart_id: string, newQuantity: number) {
    if (newQuantity < 1) return;

    startTransition(async () => {
      try {
        const supabase = createClient();
        const item = cart.find((i) => i.cart_id === cart_id);
        if (!item) return;

        const unitPrice = (item.total_price || 0) / item.quantity; // Hitung harga per unit

        console.log(`🔄 Updating cart ${cart_id} with quantity ${newQuantity}`);

        const { error } = await supabase
          .from("carts")
          .update({ quantity: newQuantity, total_price: newQuantity * unitPrice })
          .eq("cart_id", cart_id);

        if (error) throw new Error(error.message);

        console.log("✅ Cart updated successfully");

        setCart((prevCart) =>
          prevCart.map((i) =>
            i.cart_id === cart_id ? { ...i, quantity: newQuantity, total_price: newQuantity * unitPrice } : i
          )
        );
        setSuccessMessage("Cart updated successfully!");
      } catch (error) {
        console.error("❌ Update Quantity Error:", error);
      }
    });
  }

  async function removeItem(cart_id: string) {
    startTransition(async () => {
      try {
        const supabase = createClient();
        console.log(`🗑 Removing item ${cart_id}`);

        const { error } = await supabase.from("carts").delete().eq("cart_id", cart_id);

        if (error) throw new Error(error.message);

        console.log("✅ Item removed successfully");

        setCart((prevCart) => prevCart.filter((item) => item.cart_id !== cart_id));
        setSuccessMessage("Item removed successfully!");
      } catch (error) {
        console.error("❌ Remove Item Error:", error);
      }
    });
  }

  const totalPrice = cart.reduce((total, item) => total + (item.total_price || 0), 0);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      console.log("🛒 Checkout button clicked!");

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart }),
      });

      console.log("🔄 Response received!", response);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Invalid response from server" }));
        throw new Error(errorData.message || "Checkout failed");
      }

      const responseData = await response.json();
      console.log("✅ Checkout success!", responseData);

      router.refresh();
      setSuccessMessage("Checkout success!");
    } catch (error) {
      console.error("❌ Checkout Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, borderRadius: 2, boxShadow: 3, bgcolor: "background.paper" }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", display: "flex", alignItems: "center" }}>
        🛒 Your Cart
      </Typography>

      {isPending && <CircularProgress />}

      {cart.length === 0 ? (
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <Typography variant="h6" sx={{ mt: 2, color: "text.secondary" }}>
            🛒 Your cart is empty.
          </Typography>
        </Box>
      ) : (
        <>
          {cart.map((item) => (
            <Box
              key={item.cart_id}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                borderRadius: 2,
                boxShadow: 1,
                bgcolor: "background.default",
                mb: 2,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: "bold" }}>{item.name}</Typography>
                <Typography color="text.secondary">{item.description}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Stock: {item.stock}
                </Typography>
              </Box>

              <IconButton onClick={() => updateQuantity(item.cart_id!, item.quantity - 1)} size="small" disabled={item.quantity <= 1}>
                <Remove fontSize="small" />
              </IconButton>

              <TextField
                value={item.quantity}
                onChange={(e) => updateQuantity(item.cart_id!, parseInt(e.target.value, 10) || 1)}
                type="number"
                sx={{ width: 60 }}
                inputProps={{ min: 1, max: item.stock }}
                size="small"
              />

              <IconButton onClick={() => updateQuantity(item.cart_id!, item.quantity + 1)} size="small" disabled={item.quantity >= item.stock}>
                <Add fontSize="small" />
              </IconButton>

              <IconButton onClick={() => setDeleteItemId(item.cart_id!)} color="error">
                <Delete />
              </IconButton>
            </Box>
          ))}

          <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold", textAlign: "right" }}>
            Total: ${totalPrice.toFixed(2)}
          </Typography>

          <Button variant="contained" color="primary" sx={{ mt: 2 }} fullWidth onClick={handleCheckout} disabled={loading}>
            {loading ? "Processing..." : "Checkout"}
          </Button>
        </>
      )}

      <Snackbar open={!!successMessage} autoHideDuration={3000} onClose={() => setSuccessMessage(null)} message={successMessage} />

      <ConfirmationDialog
        open={!!deleteItemId}
        onClose={() => setDeleteItemId(null)}
        title="Remove Item"
        description="Are you sure you want to remove this item from your cart?"
        confirmLabel="Remove"
        onConfirm={() => {
          if (deleteItemId) removeItem(deleteItemId);
          setDeleteItemId(null);
        }}
      />
    </Box>
  );
}
