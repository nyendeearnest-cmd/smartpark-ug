import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();

  const session = cookieStore.get("smartpark_session");

  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const user = JSON.parse(session.value);

    return NextResponse.json(user);

  } catch {
    return NextResponse.json(
      { message: "Invalid session" },
      { status: 401 }
    );
  }
}