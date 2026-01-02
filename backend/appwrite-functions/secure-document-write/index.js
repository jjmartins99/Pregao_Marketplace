export default async ({ req, res }) => {
  return res.json({
    message: "All sensitive writes must pass through dedicated functions"
  });
};
