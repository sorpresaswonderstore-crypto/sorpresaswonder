import { dbLite as db } from "@/lib/firebase";
import { doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore/lite";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

// PUT /api/admin/products/[id] — toggle published status or update fields
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const productRef = doc(db, "products", id);
    await updateDoc(productRef, body);
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error updating product:", error);
    return Response.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE /api/admin/products/[id] — delete product + UploadThing image
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productRef = doc(db, "products", id);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    const data = productSnap.data();

    // Delete image from UploadThing
    if (data.imageKey) {
      await utapi.deleteFiles(data.imageKey);
    }

    // Delete Firestore document
    await deleteDoc(productRef);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return Response.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
