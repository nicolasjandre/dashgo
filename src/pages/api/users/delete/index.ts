import { NextApiRequest, NextApiResponse } from "next";

export const faunadb = require('faunadb');

const q = faunadb.query;

const client = new faunadb.Client({
    secret: process.env.FAUNA_SECRET,
    domain: 'db.fauna.com'
})

module.exports = async (req: NextApiRequest, res: NextApiResponse) => {
    const { userId } = req.body;

    if (req.method === "DELETE") {
        try {
            await client.query(
                q.Delete(q.Ref(q.Collection('users'), String(userId) + 'oi'))
            )

            return res.status(200).json('Usuário deletado com sucesso.')

        } catch (e: any) {
            res.status(500).json(e.message)
        }
    }
}