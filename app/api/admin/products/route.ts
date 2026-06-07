import { dbLite as db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore/lite";

// GET /api/admin/products — all products (draft + published)
export async function GET() {
  try {
    const productsRef = collection(db, "products");
    const q = query(productsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return Response.json(products);
  } catch (error) {
    console.error("Error fetching admin products:", error);
    return Response.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST /api/admin/products — create new product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, productCode, imageUrl, imageKey } = body;

    if (!name || !price || !productCode || !imageUrl) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const productsRef = collection(db, "products");
    const docRef = await addDoc(productsRef, {
      name,
      description: description || "",
      price: parseFloat(price),
      productCode,
      imageUrl,
      imageKey,
      published: false,
      createdAt: serverTimestamp(),
    });

    return Response.json({ id: docRef.id, success: true }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return Response.json({ error: "Failed to create product" }, { status: 500 });
  }
}
