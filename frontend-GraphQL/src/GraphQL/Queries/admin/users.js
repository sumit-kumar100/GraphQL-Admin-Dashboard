import { gql } from "@apollo/client";

export const GET_USERS = gql`
query{
    users{
      id
      firstName
      lastName
      email
      role
    }
  }
`

export const GET_USER_BY_ID = gql`
query userById($id: ID!){
  userById(id: $id){
    id
    firstName
    lastName
    email
    merchant {
      id
      companyName
      companyPanNo
      gstNo
    }
    role
  }
}
`