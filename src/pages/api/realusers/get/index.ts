import { NextApiRequest, NextApiResponse } from "next";

type User = {
    data: User;
    name: string;
    email: string;
    profession: string;
    sex: string;
    needUpdateProfile: boolean;
    created_at: string;
    updated_at: string;
}

export const faunadb = require('faunadb');

const q = faunadb.query;

const client = new faunadb.Client({
    secret: process.env.FAUNA_SECRET,
    domain: 'db.fauna.com'
})

module.exports = async (req: NextApiRequest, res: NextApiResponse) => {
    const { email } = req.body.data || "";

    if (req.method === "POST" && email !== "") {
        try {
            const user = await client.query(
                q.Get(
                    q.Match(
                        q.Index('real_user_by_email'), (String(email))
                    )
                )
            )

            return res.status(200).json(user as User)

        } catch (e: any) {
            return res.status(500).json(e.message)
        }
    }

    if (email === "") {
        return res.status(500).json('Nenhum e-mail informado.')
    }
}