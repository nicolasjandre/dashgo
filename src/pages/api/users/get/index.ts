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
    if (req.method === "GET") {
        try {
            const users = await client.query(
                q.Map(
                    q.Paginate(q.Documents(q.Collection('users'))),
                    q.Lambda((x: any) => q.Get(x))
                ))

            const { page = 1, per_page = 10 } = req.query;

            const total = users.data.length
            const pageStart = (Number(page) - 1) * Number(per_page)
            const pageEnd = pageStart + Number(per_page)

            const paginatedUsers = users.data
                .sort((a: User, b: User) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .slice(pageStart, pageEnd);

            res.setHeader('X-Total-Count', total);
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.send(paginatedUsers);

        } catch (e: any) {
            res.status(500).json(e)
        }
    }
}