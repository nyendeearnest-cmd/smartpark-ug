import { cookies } from "next/headers";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "ATTENDANT";
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();

  const session = cookieStore.get("smartpark_session");

  if (!session) return null;

  try {
    return JSON.parse(session.value);
  } catch {
    return null;
  }
}