import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../../utils/apollo-client'
import { GET_USERS, GET_ADDRESS } from '../../../GraphQL/Queries/admin/address'
import { CREATE_ADDRESS, UPDATE_ADDRESS, DELETE_ADDRESS } from '../../../GraphQL/Mutations/admin/address'


export const getUsers = createAsyncThunk('address/getUsers', async (_, { dispatch }) => {
    const response = await client.query({ query: GET_USERS })
    if (response) {
        dispatch(actions.getUsersOk(response?.data?.users))
    }
})

export const getAddress = createAsyncThunk('address/getAddress', async (refetch = false, { dispatch }) => {
    if (!refetch) {
        const response = await client.query({ query: GET_ADDRESS })
        if (response) {
            dispatch(actions.getAddressOk(response?.data?.address?.edges))
        }
    } else {
        const response = await client.refetchQueries({ include: [{ query: GET_ADDRESS }] })
        if (response) {
            dispatch(actions.getAddressOk(response[0]?.data?.address?.edges))
        }
    }
})


export const createAddress = createAsyncThunk('address/createAddress', async (data, { dispatch }) => {
    const response = await client.mutate({ mutation: CREATE_ADDRESS, variables: { data } })
    if (response) {
        dispatch(getAddress(true))
        dispatch(actions.updateMessage("Created Successfully !"))
    }
})

export const updateAddress = createAsyncThunk('address/updateAddress', async (data, { dispatch }) => {
    const response = await client.mutate({ mutation: UPDATE_ADDRESS, variables: { data } })
    if (response) {
        dispatch(getAddress(true))
        dispatch(actions.updateMessage("Updated Successfully !"))
    }
})

export const deleteAddress = createAsyncThunk('address/deleteAddress', async (id, { dispatch }) => {
    const response = await client.mutate({ mutation: DELETE_ADDRESS, variables: { id } })
    if (response) {
        dispatch(getAddress(true))
        dispatch(actions.updateMessage("Deleted Successfully !"))
    }
})

export const addressSlice = createSlice({
    name: 'address',
    initialState: {
        message: null,
        userData: [],
        addressData: []
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
        },
        getAddressOk: (state, action) => {
            state.addressData = action.payload
        }
    }
})

export const actions = addressSlice.actions

export default addressSlice.reducer
