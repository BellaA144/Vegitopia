import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { fetchCarts } from "./actions";
import Carts from "./components/Carts";

export default async function CartsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  const carts = await fetchCarts();

  return <Carts initialData={carts || []} />;
}
