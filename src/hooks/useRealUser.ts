import { useQuery } from "react-query"
import { api } from "../services/axios";


type User = {
    name: string;
    email: string;
    profession: string;
    sex: string;
    id: string;
    picture: string;
    needUpdateProfile: boolean;
    created_at: string;
    updated_at: string;
}

type GetRealUserResponse = {
    user: User;
}

export async function getRealUser(email: string): Promise<GetRealUserResponse | undefined> {
    if (!email) {
        return
    }
    try {
        const data = await api.post(`/realusers/get`, {
            data: {
                email,
            },
        });

    
        const user: User = {
            name: data?.data?.data?.name,
            email: data?.data?.data?.email,
            profession: data?.data?.data?.profession,
            sex: data?.data?.data?.sex,
            id: data?.data?.ref["@ref"]?.id,
            picture: data?.data?.data?.picture,
            needUpdateProfile: data?.data?.data?.needUpdateProfile,
            created_at: new Date(data?.data?.data?.created_at).toLocaleDateString(
                "pt-BR",
                {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                }
            ),
            updated_at: new Date(data?.data?.data?.updated_at).toLocaleDateString(
                "pt-BR",
                {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                }
            ),
        };
    
        return {
            user,
        };
    } catch (error: any) {
        console.error(error.message);
    }
}

export function useRealUser(email: string) {
    return useQuery(["real_user"], () => getRealUser(email));
}