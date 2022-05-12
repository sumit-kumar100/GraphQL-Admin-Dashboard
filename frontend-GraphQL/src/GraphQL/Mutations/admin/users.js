import { gql } from '@apollo/client';


export const CREATE_CUSTOMER = gql`
mutation createCustomer($data: CustomerUserInput!) {
    createCustomer(data: $data) 
    {
        success
    }
}
`

export const UPDATE_CUSTOMER = gql`
mutation updateCustomer($data: CustomerUpdateUserInput!) {
    updateCustomer(data: $data) 
    {
        success
    }
}
`



export const CREATE_MERCHANT = gql`
mutation createMerchant($data: MerchantUserInput!) {
    createMerchant(data: $data) 
    {
        success
    }
}
`

export const UPDATE_MERCHANT = gql`
mutation updateMerchant($data: MerchantUpdateUserInput!) {
    updateMerchant(data: $data) 
    {
        success
    }
}
`

export const DELETE_USER = gql`
mutation deleteUser($id: ID!){
    deleteUser(id: $id){
        success
    }
}
`