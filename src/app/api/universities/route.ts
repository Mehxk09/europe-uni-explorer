import { NextResponse } from "next/server";

import { getUniversitiesByIds } from "@/lib/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids")?.split(",").filter(Boolean) ?? [];

  if (ids.length === 0) {
    return NextResponse.json([]);
  }

  const universities = await getUniversitiesByIds(ids.slice(0, 4));
  return NextResponse.json(universities);
}
