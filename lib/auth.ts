import { NextResponse } from "next/server";
import { getSessionUser } from "./session";

export async function requireAdmin() {
  const user = await getSessionUser();

  if (!user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  if (user.role !== "ADMIN") {
    return {
      authorized: false,
      response: NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      ),
    };
  }

  return {
    authorized: true,
    user,
  };
}