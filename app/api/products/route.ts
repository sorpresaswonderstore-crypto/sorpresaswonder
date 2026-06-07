import { dbLite as db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore/lite";

export async function GET() {
  try {
    const productsRef = collection(db, "products");
    const q = query(
      productsRef,
      where("published", "==", true),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return Response.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return Response.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
