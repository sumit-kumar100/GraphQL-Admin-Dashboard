import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../../utils/apollo-client'
import { GET_ORDER } from '../../../GraphQL/Queries/merchant/order'
import { UPDATE_ORDER, DELETE_ORDER } from '../../../GraphQL/Mutations/merchant/order'

export const getOrder = createAsyncThunk('orders/getOrder', async (refetch = false, { dispatch }) => {
    if (!refetch) {
        const response = await client.query({ query: GET_ORDER })
        if (response) {
            dispatch(actions.getOrderOk(response?.data?.orders?.edges))
        }
    } else {
        const response = await client.refetchQueries({ include: [{ query: GET_ORDER }] })
        if (response) {
            dispatch(actions.getOrderOk(response[0]?.data?.orders?.edges))
        }
    }
})

export const updateOrder = createAsyncThunk('order/updateOrder', async (data, { dispatch }) => {
    const response = await client.mutate({ mutation: UPDATE_ORDER, variables: { data } })
    if (response?.data?.updateOrder?.success) {
        dispatch(getOrder(true))
        dispatch(actions.updateMessage("Updated Successfully !"))
    }
})

export const deleteOrder = createAsyncThunk('order/deleteOrder', async (id, { dispatch }) => {
    const response = await client.mutate({ mutation: DELETE_ORDER, variables: { id } })
    if (response?.data?.deleteOrder?.success) {
        dispatch(getOrder(true))
        dispatch(actions.updateMessage("Deleted Successfully !"))
    }
})


export const orderSlice = createSlice({
    name: 'merchantOrders',
    initialState: {
        orderData: [],
        message: null
    },
    reducers: {
        updateMessage: (state, action) => {
            state.message = action.payload
        },
        clearMessage: (state) => {
            state.message = null
        },
        getOrderOk: (state, action) => {
            state.orderData = action.payload
        },
        clearState: (state) => {
            state.selectedColors = []
            state.selectedSizes = []
            state.variants = []
            state.selectedImage = []
            state.selectedVariantImage = []
        }
    }
})

export const actions = orderSlice.actions

export default orderSlice.reducer
