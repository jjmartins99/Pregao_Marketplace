import { Client, Databases } from "node-appwrite";

export default async ({ req, res }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const { deliveryId, nextStatus } = JSON.parse(req.body);

  await databases.updateDocument(
    process.env.DATABASE_ID,
    "deliveries",
    deliveryId,
    { status: nextStatus }
  );

  return res.json({ success: true });
};
