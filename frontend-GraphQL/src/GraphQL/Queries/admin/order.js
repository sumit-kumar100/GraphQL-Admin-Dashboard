import { gql } from "@apollo/client";

export const GET_ORDER = gql`
query{
  orders{
    edges{
      node{
        id
        userId
        address{
          id
          houseNo
          colony
          landmark
          pinCode
          city
          state
          phoneNumber
          alternateNumber
        }
        product {
          id
          title
          brand
          description
          mrp
          listPrice
          cost
          quantity
          gstIncluded
          colors
          sizes
          variants{
            edges{
              node{
                color
                size
                listPrice
                quantity
              }
            }
          }
          status
        }
        variant
        quantity
        orderStatus
      }
    }
  }
}
`

export const GET_ORDER_BY_ID = gql`
query orderById($id: ID!) {
  orderById(id: $id) {
    id
    userId
    address{
      id
    }
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
    orderStatus
  }
}
`

export const GET_ADD_ORDER_INFO = gql`
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

export const GET_ADDRESS_BY_USER_ID = gql`
query queryAddress($filters: GenericScalar!) {
  queryAddress(filters: $filters) {
    id
    city
    state
  }
}
`
