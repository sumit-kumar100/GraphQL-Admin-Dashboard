import { gql } from '@apollo/client';


export const GET_USERS = gql`
  query{
    users{
      id
      email
    }
  }
`

export const GET_ADDRESS = gql`
  query{
    address{
      edges{
        node{
          id
          userId
          city
          state
          phoneNumber
        }
      }
    }
  }
`


export const GET_ADDRESS_BY_ID = gql`
  query addressById($id: ID!) {
    addressById(id: $id) {
      userId
      houseNo
      colony
      landmark
      pinCode
      city
      state
      phoneNumber
      alternateNumber
    }
  }
`

