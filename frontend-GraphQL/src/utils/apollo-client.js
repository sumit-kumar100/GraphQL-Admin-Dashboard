import { ApolloClient, InMemoryCache, from } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie'


export const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) =>
            toast.error(`Error : ${message}`)
        );
    }

    if (networkError) console.log(`[Network error]: ${networkError}`);
});

const authLink = setContext((_, { headers }) => {
    const accessToken = Cookies.get('accessToken');
    return {
        headers: {
            ...headers,
            authorization: accessToken ? `JWT ${accessToken}` : "",
        }
    }
});

const HOST = process.env.NEXT_PUBLIC_HOST || 'http://localhost:8000'

export const link = from([
    errorLink,
    new createUploadLink({ uri: `${HOST}/graphql/` }) // We are not using HttpLink instead we are using createUploadLink as it includes both HttpLink and uploadLink
])


export const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(link)
})