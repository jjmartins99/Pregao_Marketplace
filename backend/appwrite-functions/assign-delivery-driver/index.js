import { Client, Databases } from "node-appwrite";

export default async ({ req, res }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const { orderId, driverId } = JSON.parse(req.body);

  await databases.createDocument(
    process.env.DATABASE_ID,
    "deliveries",
    "unique()",
    {
      orderId,
      driverId,
      status: "assigned",
      createdAt: new Date().toISOString()
    }
  );

  await databases.updateDocument(
    process.env.DATABASE_ID,
    "orders",
    orderId,
    { status: "delivering" }
  );

  return res.json({ success: true });
};
