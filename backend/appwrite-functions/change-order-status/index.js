import { Client, Databases } from "node-appwrite";

const transitions = {
  created: ["paid"],
  paid: ["preparing"],
  preparing: ["ready"],
  ready: ["delivering"],
  delivering: ["delivered"]
};

export default async ({ req, res }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const { orderId, nextStatus } = JSON.parse(req.body);

  const order = await databases.getDocument(
    process.env.DATABASE_ID,
    "orders",
    orderId
  );

  if (!transitions[order.status]?.includes(nextStatus)) {
    return res.json({ error: "Invalid transition" }, 400);
  }

  await databases.updateDocument(
    process.env.DATABASE_ID,
    "orders",
    orderId,
    { status: nextStatus }
  );

  return res.json({ success: true });
};
