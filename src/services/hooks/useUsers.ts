import { useQuery } from "react-query"
import { api } from "../axios-api"

type User = {
    data: User;
    ref: any;
    name: string;
    email: string;
    profession: string;
    sex: string;
    id: string;
    created_at: string;
    updated_at: string;
}

type GetUsersResponse = {
    totalCount: number;
    users: User[];
}

export async function getUsers(page: number): Promise<GetUsersResponse> {
    const { data, headers } = await api.get('/users/get', {
        params: {
            page
        }
    })


    const totalCount = Number(headers['x-total-count'])

    const users = data.map((user: User) => {
        return {
            name: user?.data?.name,
            email: user?.data?.email,
            profession: user?.data?.profession,
            sex: user?.data?.sex,
            id: user?.ref['@ref']?.id,
            created_at: new Date(user?.data?.created_at).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            }),
            updated_at: new Date(user?.data?.created_at).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            }),
        }
    })
    return {
        users,
        totalCount
    }
}

export function useUsers(page: number) {
    return useQuery(['users', page], () => getUsers(page),
        {
            staleTime: 1000 * 60 * 10, // 10 min
        })
}
