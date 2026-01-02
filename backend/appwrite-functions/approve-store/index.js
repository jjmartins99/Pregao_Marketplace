import { Client, Databases, Teams } from "node-appwrite";

export default async ({ req, res, log }) => {
  try {
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);
    const teams = new Teams(client);

    const { storeId, action } = JSON.parse(req.body);

    const memberships = await teams.listMemberships("marketplace");

    const isSupervisor = memberships.memberships.some(m =>
      m.userId === req.headers["x-appwrite-user-id"] &&
      m.roles.includes("supervisor")
    );

    if (!isSupervisor) {
      return res.json({ error: "Unauthorized" }, 403);
    }

    const store = await databases.getDocument(
      process.env.DATABASE_ID,
      "stores",
      storeId
    );

    if (store.status !== "pending_approval") {
      return res.json({ error: "Invalid status" }, 400);
    }

    await databases.updateDocument(
      process.env.DATABASE_ID,
      "stores",
      storeId,
      { status: action === "approve" ? "active" : "rejected" }
    );

    return res.json({ success: true });
  } catch (e) {
    log(e);
    return res.json({ error: "Internal error" }, 500);
  }
};
