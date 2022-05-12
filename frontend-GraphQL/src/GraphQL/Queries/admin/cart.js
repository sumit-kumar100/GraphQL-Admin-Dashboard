import { gql } from "@apollo/client";

export const GET_CART = gql`
query{
  carts{
    edges{
      node{
        id
        userId
        products {
          edges {
            node {
              product{
                title
              }
              quantity
            }
          }
        }
      }
    }
  }
}
`

export const GET_CART_BY_ID = gql`
query cartById($id: ID!) {
  cartById(id: $id) {
    id
    userId
    products{
      edges{
        node{
          product{
            id
            title
            variants{
              edges{
                node{
                  color
                  size
                  listPrice
                }
              }
            }
          }
          variant
          quantity
        }
      }
    }
  }
}
`

export const GET_ADD_CART_INFO = gql`
  query{
    users{
      id
      email
    }
    products{
      edges{
        node{
          id
          title
          variants{
            edges{
              node{
                color
                size
                listPrice
              }
            }
          }
        }
      }
    }
  }
`
