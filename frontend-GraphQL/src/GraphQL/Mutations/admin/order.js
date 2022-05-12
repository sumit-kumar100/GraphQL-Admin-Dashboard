import { gql } from '@apollo/client';

export const CREATE_ORDER = gql`
mutation createOrder($data: OrderInput!) {
    createOrder(data: $data) 
    {
        success
    }
}
`

export const UPDATE_ORDER = gql`
    mutation updateOrder($data: OrderUpdateInput!) {
        updateOrder(data: $data) 
        {
            success
        }
    }
`


export const DELETE_ORDER = gql`
    mutation deleteOrder($id: ID!){
        deleteOrder(id: $id){
          success
        }
      }
`