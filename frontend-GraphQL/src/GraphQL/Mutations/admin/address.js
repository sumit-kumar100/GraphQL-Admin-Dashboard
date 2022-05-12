import { gql } from '@apollo/client';

export const CREATE_ADDRESS = gql`
    mutation createAddress($data: AddressInput!) {
        createAddress(data: $data) 
        {
            success
        }
    }
`

export const UPDATE_ADDRESS = gql`
    mutation updateAddress($data: AddressUpdateInput!) {
      updateAddress(data: $data) 
      {
          success
      }
    }
`

export const DELETE_ADDRESS = gql`
    mutation deleteAddress($id: ID!){
        deleteAddress(id: $id){
          success
        }
      }
`