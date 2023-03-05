import { NextApiRequest, NextApiResponse } from "next";

export const faunadb = require("faunadb");

const q = faunadb.query;

const client = new faunadb.Client({
  secret: process.env.FAUNA_SECRET,
  domain: "db.fauna.com",
});

module.exports = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, email, sex, profession } = req.body;

  if (req.method === "POST") {
    try {
      const response = await client.query(
        q.If(
          q.Not(
            q.Exists(
              q.Match(
                q.Index("real_user_by_email"),
                q.Casefold(email as string)
              )
            )
          ),
          q.Create(q.Collection("real_users"), {
            data: {
              name,
              email,
              sex,
              profession,
              picture: "none",
              needUpdateProfile: true,
              created_at: Date.now(),
              updated_at: Date.now(),
            },
          }),
          q.Get(
            q.Match(q.Index("real_user_by_email"), q.Casefold(email as string))
          )
        )
      );
      return res.status(200).json(response);
    } catch (e: any) {
      return res.status(500).json(e?.message || e);
    }
  }
};
