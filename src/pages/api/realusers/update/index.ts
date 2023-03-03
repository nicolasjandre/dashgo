import { NextApiRequest, NextApiResponse } from "next";

export const faunadb = require("faunadb");

const q = faunadb.query;

const client = new faunadb.Client({
  secret: process.env.FAUNA_SECRET,
  domain: "db.fauna.com",
});

module.exports = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, name, sex, profession } = req.body.user;

  if (req.method === "PATCH") {
    try {
      await client.query(
        q.Update(q.Ref(q.Collection("real_users"), String(id)), {
          data: {
            name,
            sex,
            profession,
            needUpdateProfile: false,
            updated_at: Date.now(),
          },
        })
      );
    
      return res.status(200).json("Os dados do usuário foram atualizados.");

    } catch (e: any) {
        return res.status(500).json(e.message);
    }
  }
};
