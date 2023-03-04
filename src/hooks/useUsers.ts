import { useQuery } from "react-query";
import { api } from "../services/axios";

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

export async function getUsers(page: number, registersPerPage: number): Promise<GetUsersResponse> {
    const { data, headers } = await api.get('users/get', {
        params: {
            page,
            per_page: registersPerPage
        }
    })

    const totalCount = headers['x-total-count']

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

export function useUsers(page: number, registersPerPage: number) {
    return useQuery(['users', page], () => getUsers(page, registersPerPage), {
        staleTime: 1000 * 60 * 5
    })
}
