import { gql } from '@apollo/client';


export const GET_DATA = gql`
    query{
        category{
            edges{
                node{
                    id
                    title
                }
            }
        }
        subcategory{
            edges{
                node{
                    id
                    title
                }
            }
        }
        sublist{
            edges{
                node{
                    id
                    title
                }
            }
        }
    }
`

export const GET_SUBLIST = gql`
query{
    sublist{
      edges{
        node{
          id
          title
        }
      }
    }
  }
`

export const GET_CATEGORY_BY_ID = gql`
query categoryById($id: ID!) {
  categoryById(id: $id) {
    id
    title
  }
}
`

export const GET_SUBCATEGORY_BY_ID = gql`
    query subcategoryById($id: ID!) {
        subcategoryById(id: $id) {
            id
            title
            category{
                id
                title 
            }
        }
    }
`

export const GET_SUBLIST_BY_ID = gql`
    query sublistById($id: ID!) {
        sublistById(id: $id) {
            id
            title
            subCategory{
                id
                title
            }
        }
    }
`
