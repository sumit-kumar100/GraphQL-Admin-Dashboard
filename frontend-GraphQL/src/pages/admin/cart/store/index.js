import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../../../utils/apollo-client'
import { GET_CART, GET_ADD_CART_INFO } from '../../../../GraphQL/Queries/admin/cart'
import { CREATE_CART, UPDATE_CART, DELETE_CART } from '../../../../GraphQL/Mutations/admin/cart'

export const getCart = createAsyncThunk('cart/getCart', async (refetch = false, { getState, dispatch }) => {
    if (!refetch) {
        const response = await client.query({ query: GET_CART })
        if (response) {
            dispatch(actions.getCartOk(response?.data?.carts?.edges))
        }
    } else {
        const response = await client.refetchQueries({ include: [{ query: GET_CART }] })
        if (response) {
            dispatch(actions.getCartOk(response[0]?.data?.carts?.edges))
        }
    }

})

export const getCartInfo = createAsyncThunk('cart/getCartInfo', async (_, { dispatch }) => {
    const response = await client.query({ query: GET_ADD_CART_INFO })
    if (response) {
        dispatch(actions.getUsersOk(response?.data?.users))
        dispatch(actions.getProductOk(response?.data?.products?.edges))
    }
})

export const createCart = createAsyncThunk('cart/createCart', async (data, { dispatch }) => {
    const response = await client.mutate({ mutation: CREATE_CART, variables: { data } })
    if (response?.data?.createCart?.success) {
        dispatch(getCart(true))
        dispatch(actions.updateMessage("Created Successfully !"))
    }
})

export const updateCart = createAsyncThunk('cart/updateCart', async (data, { dispatch }) => {
    const response = await client.mutate({ mutation: UPDATE_CART, variables: { data } })
    if (response?.data?.updateCart?.success) {
        dispatch(getCart(true))
        dispatch(actions.updateMessage("Updated Successfully !"))
    }
})

export const deleteCart = createAsyncThunk('cart/deleteCart', async (id, { dispatch }) => {
    const response = await client.mutate({ mutation: DELETE_CART, variables: { id } })
    if (response?.data?.deleteCart?.success) {
        dispatch(getCart(true))
        dispatch(actions.updateMessage("Deleted Successfully !"))
    }
})


export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartData: [],
        userData: [],
        productData: [],
        variantData: [],
        cartData: [],
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
        setVariant: (state, action) => {
            state.variantData = action.payload
        },
        getUsersOk: (state, action) => {
            state.userData = action.payload
        },
        getProductOk: (state, action) => {
            state.productData = action.payload
        },
        getCartOk: (state, action) => {
            state.cartData = action.payload
        }
    }
})

export const actions = cartSlice.actions

export default cartSlice.reducer
