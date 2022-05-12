import { gql } from '@apollo/client';

export const CREATE_PRODUCT = gql`
    mutation createProduct($data: ProductInput!) {
        createProduct(data: $data) 
        {
            success
        }
    }
`

export const UPDATE_PRODUCT = gql`
    mutation updateProduct($data: ProductUpdateInput!) {
      updateProduct(data: $data) 
      {
          success
      }
    }
`

export const DELETE_PRODUCT = gql`
    mutation deleteProduct($id: ID!){
        deleteProduct(id: $id){
          success
        }
      }
`