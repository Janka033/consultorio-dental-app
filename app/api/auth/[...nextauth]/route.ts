import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// Exportar helper para server-side
export async function getSession() {
  return await handler.auth();
}