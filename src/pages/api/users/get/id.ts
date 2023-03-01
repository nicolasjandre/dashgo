import { NextApiRequest, NextApiResponse } from "next";

type User = {
    data: User;
    name: string;
    email: string;
    profession: string;
    sex: string;
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
    const { userId } = req.body.data;

    if (req.method === "POST") {
        try {
            const user: User = await client.query(
                q.Get(q.Ref(q.Collection("users"), String(userId))),
            )

            return res.status(200).json(user)

        } catch (e: any) {
            res.status(500).json(e)
        }
    }
}