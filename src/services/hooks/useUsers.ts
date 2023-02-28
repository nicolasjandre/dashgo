import { useQuery, UseQueryOptions } from "react-query"
import { api } from "../axios-api"

type User = {
    name: string,
    email: string,
    id: string,
    created_at: string,
}

type GetUsersResponse = {
    totalCount: number,
    users: User[]
}

type GetUserResponse = {
    user: User
}

export async function getUsers(page: number): Promise<GetUsersResponse> {
    const { data, headers } = await api('/users', {
        params: {
            page,
        }
    })

    const totalCount = Number(headers['x-total-count'])

    const users = data.users.map((user: User) => {
        return {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: new Date(user.created_at).toLocaleDateString('pt-BR', {
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

export async function getUser(userId: number): Promise<GetUserResponse> {
    const { data } = await api.get(`/users/${userId}`)

    const user = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        created_at: new Date(data.user.created_at).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        }),
    }

    return {
        user,
    }
}

export function useUsers(page: number) {
    return useQuery(['users', page], () => getUsers(page),
    {
    staleTime: 1000 * 60 * 10, // 10 min
    })
}

export function useUser(userId: number) {
    const response = useQuery(['users', userId], () => getUser(userId),
    {
    staleTime: 1000 * 60 * 10, // 10 min
    })

    return {
        response,
        user: response.data?.user
    }
}