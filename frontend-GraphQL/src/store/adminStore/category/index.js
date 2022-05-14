import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../../utils/apollo-client'
import { GET_DATA } from '../../../GraphQL/Queries/admin/category'
import {
    CREATE_CATEGORY, UPDATE_CATEGORY, DELETE_CATEGORY,
    CREATE_SUBCATEGORY, UPDATE_SUBCATEGORY, DELETE_SUBCATEGORY,
    CREATE_SUBLIST, UPDATE_SUBLIST, DELETE_SUBLIST,
} from '../../../GraphQL/Mutations/admin/category'

export const getData = createAsyncThunk('category/getCategory', async (refetch = false, { dispatch }) => {
    if (!refetch) {
        const response = await client.query({ query: GET_DATA })
        if (response) {
            dispatch(actions.getCategoryOk(response?.data?.category?.edges))
            dispatch(actions.getsubCategoryOk(response?.data?.subcategory?.edges))
            dispatch(actions.getsubListOk(response?.data?.sublist?.edges))
        }
    } else {
        const response = await client.refetchQueries({ include: [{ query: GET_DATA }] })
        if (response) {
            dispatch(actions.getCategoryOk(response[0]?.data?.category?.edges))
            dispatch(actions.getsubCategoryOk(response[0]?.data?.subcategory?.edges))
            dispatch(actions.getsubListOk(response[0]?.data?.sublist?.edges))
        }
    }
})

export const createCategory = createAsyncThunk('category/createCategory', async ({ title }, { dispatch }) => {
    const response = await client.mutate({ mutation: CREATE_CATEGORY, variables: { title } })
    if (response) {
        dispatch(getData(true))
        dispatch(actions.updateMessage("Created Successfully !"))
    }
})

export const updateCategory = createAsyncThunk('products/updateCategory', async ({ id, title }, { dispatch }) => {
    const response = await client.mutate({ mutation: UPDATE_CATEGORY, variables: { id, title } })
    if (response) {
        dispatch(getData(true))
        dispatch(actions.updateMessage("Updated Successfully !"))
    }
})

export const deleteCategory = createAsyncThunk('category/deleteCategory', async (id, { dispatch }) => {
    const response = await client.mutate({ mutation: DELETE_CATEGORY, variables: { id: id } })
    if (response) {
        dispatch(getData(true))
        dispatch(actions.updateMessage("Deleted Successfully !"))
    }
})


export const createSubCategory = createAsyncThunk('category/createSubCategory', async ({ category, title }, { dispatch }) => {
    const response = await client.mutate({ mutation: CREATE_SUBCATEGORY, variables: { category, title } })
    if (response) {
        dispatch(getData(true))
        dispatch(actions.updateMessage("Created Successfully !"))
    }
})

export const updateSubCategory = createAsyncThunk('products/updateSubCategory', async ({ id, category, title }, { dispatch }) => {
    const response = await client.mutate({ mutation: UPDATE_SUBCATEGORY, variables: { id, category, title } })
    if (response) {
        dispatch(getData(true))
        dispatch(actions.updateMessage("Updated Successfully !"))
    }
})

export const deleteSubCategory = createAsyncThunk('category/deleteSubCategory', async (id, { dispatch }) => {
    const response = await client.mutate({ mutation: DELETE_SUBCATEGORY, variables: { id: id } })
    if (response) {
        dispatch(getData(true))
        dispatch(actions.updateMessage("Deleted Successfully !"))
    }
})

export const createSubList = createAsyncThunk('category/createSubList', async ({ subcategory, title }, { dispatch }) => {
    const response = await client.mutate({ mutation: CREATE_SUBLIST, variables: { subcategory, title } })
    if (response) {
        dispatch(getData(true))
        dispatch(actions.updateMessage("Created Successfully !"))
    }
})

export const updateSubList = createAsyncThunk('products/updateSubList', async ({ id, subcategory, title }, { dispatch }) => {
    const response = await client.mutate({ mutation: UPDATE_SUBLIST, variables: { id, subcategory, title } })
    if (response) {
        dispatch(getData(true))
        dispatch(actions.updateMessage("Updated Successfully !"))
    }
})

export const deleteSubList = createAsyncThunk('category/deleteSubList', async (id, { dispatch }) => {
    const response = await client.mutate({ mutation: DELETE_SUBLIST, variables: { id: id } })
    if (response) {
        dispatch(getData(true))
        dispatch(actions.updateMessage("Deleted Successfully !"))
    }
})


export const categorySlice = createSlice({
    name: 'category',
    initialState: {
        message: null,
        categoryData: [],
        subCategoryData: [],
        subListData: []
    },
    reducers: {
        updateMessage: (state, action) => {
            state.message = action.payload
        },
        clearMessage: (state) => {
            state.message = null
        },
        getCategoryOk: (state, action) => {
            state.categoryData = action.payload
        },
        getsubCategoryOk: (state, action) => {
            state.subCategoryData = action.payload
        },
        getsubListOk: (state, action) => {
            state.subListData = action.payload
        },
    }
})

export const actions = categorySlice.actions

export default categorySlice.reducer
