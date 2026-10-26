import { TEMPLATES } from "@/lib/mockData";

export async function GET() {
  return Response.json({ items: TEMPLATES });
}
