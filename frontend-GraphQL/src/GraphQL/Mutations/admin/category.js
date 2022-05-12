import { gql } from '@apollo/client';

// Category Mutation
export const CREATE_CATEGORY = gql`
    mutation createCategory($title: String!) {
        createCategory(title: $title) 
        {
            success
        }
    }
`

export const UPDATE_CATEGORY = gql`
    mutation updateCategory($id: ID!,$title: String!) {
      updateCategory(id: $id, title: $title) 
      {
          success
      }
    }
`

export const DELETE_CATEGORY = gql`
    mutation deleteCategory($id: ID!){
        deleteCategory(id: $id){
          success
        }
      }
`

// Subcategory Mutation
export const CREATE_SUBCATEGORY = gql`
    mutation createSubcategory($category: ID!, $title: String!) {
        createSubcategory(category:$category , title: $title) 
        {
            success
        }
    }
`

export const UPDATE_SUBCATEGORY = gql`
    mutation updateSubcategory($id: ID!, $category: ID! , $title: String!) {
      updateSubcategory(id: $id, category:$category ,title: $title) 
      {
          success
      }
    }
`

export const DELETE_SUBCATEGORY = gql`
    mutation deleteSubcategory($id: ID!){
        deleteSubcategory(id: $id){
          success
        }
      }
`

// SubList
export const CREATE_SUBLIST = gql`
    mutation createSublist($subcategory: ID!, $title: String!) {
        createSublist(subcategory:$subcategory , title: $title) 
        {
            success
        }
    }
`

export const UPDATE_SUBLIST = gql`
    mutation updateSublist($id: ID!, $subcategory: ID! , $title: String!) {
      updateSublist(id: $id, subcategory: $subcategory ,title: $title) 
      {
          success
      }
    }
`

export const DELETE_SUBLIST = gql`
    mutation deleteSublist($id: ID!){
        deleteSublist(id: $id){
          success
        }
      }
`