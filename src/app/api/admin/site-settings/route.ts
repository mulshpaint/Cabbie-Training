import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";

async function getOrCreateGlobalSettings() {
  const settings = await SiteSettings.findOneAndUpdate(
    { singletonKey: "global" },
    { $setOnInsert: { singletonKey: "global", holdingPageEnabled: false } },
    { new: true, upsert: true }
  ).lean();

  return settings;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const settings = await getOrCreateGlobalSettings();

    return NextResponse.json({
      holdingPageEnabled: Boolean(settings?.holdingPageEnabled),
    });
  } catch (error) {
    console.error("Fetch site settings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch site settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const body = (await req.json()) as { holdingPageEnabled?: unknown };
    if (typeof body.holdingPageEnabled !== "boolean") {
      return NextResponse.json(
        { error: "holdingPageEnabled must be a boolean" },
        { status: 400 }
      );
    }

    const updated = await SiteSettings.findOneAndUpdate(
      { singletonKey: "global" },
      {
        $set: { holdingPageEnabled: body.holdingPageEnabled },
        $setOnInsert: { singletonKey: "global" },
      },
      { new: true, upsert: true }
    ).lean();

    return NextResponse.json({
      holdingPageEnabled: Boolean(updated?.holdingPageEnabled),
    });
  } catch (error) {
    console.error("Update site settings error:", error);
    return NextResponse.json(
      { error: "Failed to update site settings" },
      { status: 500 }
    );
  }
}
