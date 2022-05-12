import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../../../utils/apollo-client'
import { GET_ORDER, GET_ADD_ORDER_INFO, GET_ADDRESS_BY_USER_ID } from '../../../../GraphQL/Queries/admin/order'
import { CREATE_ORDER, UPDATE_ORDER, DELETE_ORDER } from '../../../../GraphQL/Mutations/admin/order'

export const getOrder = createAsyncThunk('cart/getOrder', async (refetch = false, { getState, dispatch }) => {
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

export const getAddress = createAsyncThunk('order/getAddress', async (filters, { getState, dispatch }) => {
    const response = await client.query({ query: GET_ADDRESS_BY_USER_ID, variables: { filters } })
    if (response) {
        dispatch(actions.getAddressOk(response?.data?.queryAddress))
    }
})



export const getOrderInfo = createAsyncThunk('order/getOrderInfo', async (_, { dispatch }) => {
    const response = await client.query({ query: GET_ADD_ORDER_INFO })
    if (response) {
        dispatch(actions.getUsersOk(response?.data?.users))
        dispatch(actions.getProductOk(response?.data?.products?.edges))
    }
})

export const createOrder = createAsyncThunk('order/createOrder', async (data, { dispatch }) => {
    const response = await client.mutate({ mutation: CREATE_ORDER, variables: { data } })
    if (response?.data?.createOrder?.success) {
        dispatch(getOrder(true))
        dispatch(actions.updateMessage("Created Successfully !"))
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
    name: 'adminOrders',
    initialState: {
        addressData: [],
        orderData: [],
        userData: [],
        productData: [],
        variantData: [],
        message: null,
    },
    reducers: {
        updateMessage: (state, action) => {
            state.message = action.payload
        },
        clearMessage: (state) => {
            state.message = null
        },
        updateVariant: (state, action) => {
            const { productId, index } = { ...action.payload }
            const product = state?.productData?.find((product) => product?.node?.id === productId)
            const variant = product?.node?.variants?.edges.map((item) => {
                return { color: item?.node?.color, size: item?.node?.size, listPrice: item?.node?.listPrice }
            })
            let temp_variant = [...state.variantData]
            let temp_item = { ...temp_variant[index] }
            temp_item = variant
            temp_variant[index] = temp_item
            state.variantData = temp_variant
        },
        getAddressOk: (state, action) => {
            state.addressData = action.payload
        },
        setVariant: (state, action) => {
            state.variantData = action.payload
        },
        getUsersOk: (state, action) => {
            state.userData = action.payload
        },
        getProductOk: (state, action) => {
            state.productData = action.payload
        },
        getOrderOk: (state, action) => {
            state.orderData = action.payload
        }
    }
})

export const actions = orderSlice.actions

export default orderSlice.reducer
