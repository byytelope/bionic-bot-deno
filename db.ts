import { MongoClient } from "./deps.ts";

const mongoClient = new MongoClient();

try {
  await mongoClient.connect(Deno.env.get("BIONIC_MONGO_URI")!);
} catch (error) {
  console.error(error);
}

export default mongoClient.database("bionic_bot_db");
