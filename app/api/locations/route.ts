import { getDb } from "@/data/db";
import { Location } from "@/data/entities/Location";

export async function GET() {
  const db = await getDb();
  const locations = await db.findAll(Location);

  return Response.json(locations);
}
