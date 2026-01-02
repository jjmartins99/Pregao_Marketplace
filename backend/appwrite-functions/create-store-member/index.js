import { Client, Databases } from "node-appwrite";

export default async ({ req, res, log }) => {
  try {
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);
    const { storeId, userId, role } = JSON.parse(req.body);

    const allowedRoles = [
      "group_manager",
      "store_manager",
      "operator",
      "order_preparer"
    ];

    if (!allowedRoles.includes(role)) {
      return res.json({ error: "Invalid role" }, 400);
    }

    await databases.createDocument(
      process.env.DATABASE_ID,
      "store_members",
      "unique()",
      { storeId, userId, role, createdAt: new Date().toISOString() }
    );

    return res.json({ success: true });
  } catch (e) {
    log(e);
    return res.json({ error: "Internal error" }, 500);
  }
};
