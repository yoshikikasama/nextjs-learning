import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    { id: 1, name: "John Doe" },
    { id: 2, name: "Tanaka" },
  ]);
}
