import { dbLite as db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore/lite";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

// GET /api/settings — get store settings (logo)
export async function GET() {
  try {
    const settingsRef = doc(db, "settings", "store");
    const snap = await getDoc(settingsRef);
    if (snap.exists()) {
      return Response.json(snap.data());
    }
    return Response.json({ logoUrl: null, logoKey: null });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return Response.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// POST /api/settings — update store settings (logo)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { logoUrl, logoKey, oldLogoKey } = body;

    // Delete old logo from UploadThing if exists
    if (oldLogoKey) {
      await utapi.deleteFiles(oldLogoKey);
    }

    const settingsRef = doc(db, "settings", "store");
    await setDoc(settingsRef, { logoUrl, logoKey }, { merge: true });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error updating settings:", error);
    return Response.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
