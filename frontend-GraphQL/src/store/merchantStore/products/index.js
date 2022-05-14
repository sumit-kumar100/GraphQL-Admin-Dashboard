import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { colors, sizes } from '../../../constant'
import { client } from '../../../utils/apollo-client'
import { GET_PRODUCTS } from '../../../GraphQL/Queries/merchant/product'
import { GET_SUBLIST } from '../../../GraphQL/Queries/merchant/category'
import { CREATE_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT } from '../../../GraphQL/Mutations/merchant/product'

export const getProduct = createAsyncThunk('products/getProduct', async (refetch = false, { getState, dispatch }) => {
    if (!refetch) {
        const response = await client.query({ query: GET_PRODUCTS })
        if (response) {
            dispatch(actions.getProductOk(response?.data?.products?.edges))
        }
    } else {
        const response = await client.refetchQueries({ include: [{ query: GET_PRODUCTS }] })
        if (response) {
            dispatch(actions.getProductOk(response[0]?.data?.products?.edges))
        }
    }

})

export const createProduct = createAsyncThunk('products/createProduct', async (rawData, { getState, dispatch }) => {
    const state = getState().merchantProducts
    const data = {
        ...rawData,
        images: state.selectedImage,
        colors: state.selectedColors,
        sizes: state.selectedSizes,
        variants: state.variants
    }
    const response = await client.mutate({ mutation: CREATE_PRODUCT, variables: { data: data } })
    if (response) {
        dispatch(getProduct(true))
        dispatch(actions.updateMessage("Created Successfully !"))
    }
})

export const updateProduct = createAsyncThunk('products/updateProduct', async (rawData, { getState, dispatch }) => {
    const state = getState().merchantProducts
    const data = {
        ...rawData,
        images: state.selectedImage,
        colors: state.selectedColors,
        sizes: state.selectedSizes,
        variants: state.variants
    }
    const response = await client.mutate({ mutation: UPDATE_PRODUCT, variables: { data: data } })
    if (response) {
        dispatch(getProduct(true))
        dispatch(actions.updateMessage("Updated Successfully !"))
    }
})

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id, { dispatch }) => {
    const response = await client.mutate({ mutation: DELETE_PRODUCT, variables: { id: id } })
    if (response) {
        dispatch(getProduct(true))
        dispatch(actions.updateMessage("Deleted Successfully !"))
    }
})

export const getSubList = createAsyncThunk('products/getSubList', async (_, { dispatch }) => {
    const response = await client.query({ query: GET_SUBLIST })
    if (response) {
        dispatch(actions.getsubListOk(response?.data?.sublist?.edges))
    }
})

export const productSlice = createSlice({
    name: 'merchantProducts',
    initialState: {
        productData: [],
        subListData: [],
        message: null,
        colors: colors,
        sizes: sizes,
        selectedColors: [],
        selectedSizes: [],
        variants: [],
        selectedImage: [],
        selectedVariantImage: []
    },
    reducers: {
        updateMessage: (state, action) => {
            state.message = action.payload
        },
        clearMessage: (state) => {
            state.message = null
        },
        clearState: (state) => {
            state.selectedColors = []
            state.selectedSizes = []
            state.variants = []
            state.selectedImage = []
            state.selectedVariantImage = []
        },
        pushColor: (state, action) => {
            if (!state.selectedColors.includes(action.payload)) {
                state.selectedColors.push(action.payload)
                if (state.selectedSizes.length) {
                    state.selectedSizes.map((size) => {
                        state.variants.push({
                            images: [],
                            color: action.payload,
                            size: size,
                            listPrice: 0,
                            quantity: 0
                        })
                    })
                }
            } else {
                state.selectedColors.splice(state.selectedColors.indexOf(action.payload), 1)
                if (state.variants.length) {
                    state.variants = state.variants.filter((variant) => variant.color !== action.payload)
                }
            }
        },
        pushSize: (state, action) => {
            if (!state.selectedSizes.includes(action.payload)) {
                state.selectedSizes.push(action.payload)
                if (state.selectedColors.length) {
                    state.selectedColors.map((color) => {
                        state.variants.push({
                            images: [],
                            color: color,
                            size: action.payload,
                            listPrice: 500,
                            quantity: 10
                        })
                    })
                }
            } else {
                state.selectedSizes.splice(state.selectedColors.indexOf(action.payload), 1)
                if (state.variants.length) {
                    state.variants = state.variants.filter((variant) => variant.size !== action.payload)
                }
            }
        },
        updateVariant: (state, action) => {
            const { key, value, index } = { ...action.payload }
            state.variants[index][key] = value
        },
        removeVariant: (state, action) => {
            state.variants.splice(action.payload, 1)

            // Removing Alternate selectedColors ands selectedSizes
            const newColors = []
            const newSizes = []
            state.variants.map((variant) => {
                if (!newColors.includes(variant.color)) {
                    newColors.push(variant.color)
                }
                if (!newSizes.includes(variant.size)) {
                    newSizes.push(variant.size)
                }
            })
            state.selectedColors = newColors
            state.selectedSizes = newSizes
        },
        addSelectedImage: (state, action) => {
            state.selectedImage = [...state.selectedImage, action.payload]
        },
        addVariantImage: (state, action) => {
            const { index, image } = { ...action.payload }
            state.variants[index].images.push(image)
            state.selectedVariantImage = [...state.selectedVariantImage, image]
        },
        handleVariant: (state, action) => {
            state.variants = [...state.variants, action.payload]
        },
        handleColors: (state, action) => {
            state.selectedColors = action.payload
        },
        handleSizes: (state, action) => {
            state.selectedSizes = action.payload
        },
        deleteGallary: (state) => {
            state.selectedImage = []
            state.selectedVariantImage = []
            state.variants = state.variants.map(variant => ({ ...variant, images: [] }))
        },
        // Extra Reducers
        getProductOk: (state, action) => {
            state.productData = action.payload
        },
        getsubListOk: (state, action) => {
            state.subListData = action.payload
        },
    }
})

export const actions = productSlice.actions

export default productSlice.reducer
