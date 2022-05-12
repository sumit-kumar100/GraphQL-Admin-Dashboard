import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
query{
    products{
      edges{
        node{
          id
          title
          listPrice
          cost
          quantity
        }
      }
    }
  }
`

export const GET_PRODUCT_BY_ID = gql`
query productById($id: ID!) {
  productById(id: $id) {
    id
    sublist{
      id
      title
    }
    title
    brand
    description
    mrp
    listPrice
    cost
    quantity
    gstIncluded
    images {
      edges {
        node {
          image {
            data
          }
        }
      }
    }
    colors
    sizes
    variants{
      edges{
				node{
          images{
            edges{
              node{
                image{
                  data
                }
              }
            }
          }
          color
          size
          listPrice
          quantity
        }
      }
    }
    status
  }
}
`


