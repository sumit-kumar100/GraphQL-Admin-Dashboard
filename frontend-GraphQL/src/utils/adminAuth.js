import { gql } from "@apollo/client";
import { client } from './apollo-client';


const VERIFY_TOKEN = gql`
mutation verifyToken($token: String!){
    verifyToken(token: $token){
        payload
    }
}
`

export const requireAuthentication = (gssp) => {
    return async (context) => {

        const { req, res } = context;

        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            return {
                redirect: {
                    destination: '/admin/login',
                    statusCode: 302
                }
            };
        }

        const response = await client.mutate({ mutation: VERIFY_TOKEN, variables: { token: accessToken } });
        if (response?.data?.verifyToken?.payload?.role === 'ADMIN') {
            return await gssp(context);
        }
        else {
            return {
                redirect: {
                    destination: '/admin/login',
                    statusCode: 302
                }
            };
        }
    }
}