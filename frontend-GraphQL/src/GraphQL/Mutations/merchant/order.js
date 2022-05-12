import { gql } from '@apollo/client';


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