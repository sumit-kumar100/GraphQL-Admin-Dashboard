import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../../utils/apollo-client'
import { GET_USERS } from '../../../GraphQL/Queries/admin/users'
import { CREATE_CUSTOMER, CREATE_MERCHANT, UPDATE_CUSTOMER, UPDATE_MERCHANT, DELETE_USER } from '../../../GraphQL/Mutations/admin/users'

export const getUsers = createAsyncThunk('users/getUsers', async (refetch = false, { getState, dispatch }) => {
    if (!refetch) {
        const response = await client.query({ query: GET_USERS })
        if (response) {
            dispatch(actions.getUsersOk(response?.data?.users))
        }
    } else {
        const response = await client.refetchQueries({ include: [{ query: GET_USERS }] })
        if (response) {
            dispatch(actions.getUsersOk(response[0]?.data?.users))
        }
    }

})

export const createUser = createAsyncThunk('users/createUser', async (data, { getState, dispatch }) => {
    const { firstName, lastName, email, password, companyName, companyPanNo, gstNo } = { ...data }
    if (companyName === "None" && companyPanNo === "None" && gstNo === "None") {
        const response = await client.mutate({
            mutation: CREATE_CUSTOMER, variables: {
                data: {
                    firstName,
                    lastName,
                    email,
                    password
                }
            }
        })
        if (response) {
            dispatch(getUsers(true))
            dispatch(actions.updateMessage("Created Successfully !"))
        }
    } else {
        const response = await client.mutate({
            mutation: CREATE_MERCHANT, variables: {
                data: {
                    firstName,
                    lastName,
                    email,
                    password,
                    companyName,
                    companyPanNo,
                    gstNo
                }
            }
        })
        if (response) {
            dispatch(getUsers(true))
            dispatch(actions.updateMessage("Created Successfully !"))
        }
    }
})

export const updateUser = createAsyncThunk('users/updateUser', async (data, { getState, dispatch }) => {
    const { id, firstName, lastName, email, companyName, companyPanNo, gstNo } = { ...data }
    if (companyName === "None" && companyPanNo === "None" && gstNo === "None") {
        const response = await client.mutate({
            mutation: UPDATE_CUSTOMER, variables: {
                data: {
                    id,
                    firstName,
                    lastName,
                    email
                }
            }
        })
        if (response) {
            dispatch(getUsers(true))
            dispatch(actions.updateMessage("Updated Successfully !"))
        }
    } else {
        const response = await client.mutate({
            mutation: UPDATE_MERCHANT, variables: {
                data: {
                    id,
                    firstName,
                    lastName,
                    email,
                    companyName,
                    companyPanNo,
                    gstNo
                }
            }
        })
        if (response) {
            dispatch(getUsers(true))
            dispatch(actions.updateMessage("Updated Successfully !"))
        }
    }
})

export const deleteUser = createAsyncThunk('users/deleteUser', async (id, { dispatch }) => {
    const response = await client.mutate({ mutation: DELETE_USER, variables: { id: id } })
    if (response) {
        dispatch(getUsers(true))
        dispatch(actions.updateMessage("Deleted Successfully !"))
    }
})


export const userSlice = createSlice({
    name: 'users',
    initialState: {
        userData: [],
        message: null,
    },
    reducers: {
        updateMessage: (state, action) => {
            state.message = action.payload
        },
        clearMessage: (state) => {
            state.message = null
        },
        getUsersOk: (state, action) => {
            state.userData = action.payload
        }
    }
})

export const actions = userSlice.actions

export default userSlice.reducer
