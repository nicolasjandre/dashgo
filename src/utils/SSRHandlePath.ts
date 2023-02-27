import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";

export function SSRHandlePath<P>(fn: GetServerSideProps<P | any>) {
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
        const cookies = parseCookies(ctx);
        const { resolvedUrl } = ctx

        if (resolvedUrl === '/' && cookies["dashgo.token"]) {
            return {
                redirect: {
                    destination: "/dashboard",
                    permanent: false,
                },
            };
        }

        if (resolvedUrl !== '/' && resolvedUrl !== '/register' && !cookies["dashgo.token"]) {
            return {
                redirect: {
                    destination: "/",
                    permanent: false,
                }
            }
        }

        return await fn(ctx);
    }
}