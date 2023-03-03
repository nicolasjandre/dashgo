import { NextApiRequest, NextApiResponse } from "next";

export const faunadb = require('faunadb');

const q = faunadb.query;

const client = new faunadb.Client({
    secret: process.env.FAUNA_SECRET,
    domain: 'db.fauna.com'
})

module.exports = async (req: NextApiRequest, res: NextApiResponse) => {
    const { name, email, sex, profession } = req.body;

    if (req.method === "POST") {
        try {
            const user = await client.query(
                q.Get(
                    q.Match(
                        q.Index('real_user_by_email'), (String(email))
                    )
                )
            )

            if (user) {
                return res.status(409).json('Usuário já cadastrado.')
            }
        } catch (e: any) {
            if (e.message === 'instance not found') {
                try {
                    const dbs = await client.query(
                        q.Create(q.Collection("real_users"), {
                            data: {
                                name,
                                email,
                                sex,
                                profession,
                                picture: "none",
                                needUpdateProfile: true,
                                created_at: Date.now(),
                                updated_at: Date.now()
                            }
                        }
                        )
                    )

                    return res.status(200).json(dbs)
                } catch {
                    return res.status(500).json('Não foi possível cadastrar o usuário.')
                }
            }

            return res.status(500).json('Não foi possível cadastrar o usuário.')
        }
    }
}