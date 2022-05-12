import { gql } from '@apollo/client';

export const CREATE_CART = gql`
mutation createCart($data: CartInput!) {
    createCart(data: $data) 
    {
        success
    }
}
`

export const UPDATE_CART = gql`
mutation updateCart($data: CartUpdateInput!) {
    updateCart(data: $data) 
    {
        success
    }
}
`


export const DELETE_CART = gql`
    mutation deleteCart($id: ID!){
        deleteCart(id: $id){
          success
        }
      }
`