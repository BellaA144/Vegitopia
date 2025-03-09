import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { getCart } from "./actions";
import Carts from "./components/Carts";

export default async function CartPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  const cart = await getCart();

  console.log("cart", cart);

  return <Carts initialData={cart || []} />

}
