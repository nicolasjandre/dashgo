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
      const user = await client.query(
        q.Let(
          {
            userExists: q.Exists(
              q.Match(q.Index("user_by_email"), email as string)
            ),
          },
          q.If(
            q.Var("userExists"),
            q.Abort("Este e-mail já está em uso."),
            q.Create(q.Collection("users"), {
              data: {
                name,
                email,
                sex,
                profession,
                created_at: Date.now(),
                updated_at: Date.now(),
              },
            })
          )
        )
      );

      return res.status(200).json("Usuário cadastrado com sucesso!");
    } catch (e: any) {
        if (e?.description) {
            return res.status(409).json(e?.description)
        }
      return res.status(500).json("Não foi possível cadastrar o usuário.");
    }
  }
};
