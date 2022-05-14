import { Card, Grid, FormControl, TextField, Select, InputLabel, MenuItem, Button, Chip } from '@mui/material'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useEffect, useState } from 'react'
import { client } from '../../../utils/apollo-client'
import { GET_CART_BY_ID } from '../../../GraphQL/Queries/admin/cart'
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';


const defaultValues = {
    userId: ""
}

const CartCard = ({ state, edit, setEdit, dispatch, setExpanded, createCart, updateCart, actions }) => {

    const validateSchema = yup.object().shape({
        userId: yup.string().required()
    })

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues,
        resolver: yupResolver(validateSchema)
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "products"
    });

    const [pending, setPending] = useState(false)

    const onSubmit = async (data) => {
        setPending(true)
        if (edit) {
            await dispatch(updateCart({ ...data, id: edit }))
        } else {
            await dispatch(createCart(data))
        }
        setExpanded('panel2')
        setEdit(null)
        reset({ ...defaultValues })
        setPending(false)
    }

    const fetchDetail = async (id) => {
        const response = await client.refetchQueries({ include: [{ query: GET_CART_BY_ID, variables: { id } }] })
        const { cartById } = { ...response[0]?.data }
        reset({ ...defaultValues, userId: cartById.userId })
        const reduxVariant = []
        cartById?.products?.edges?.forEach((item, index) => {
            const product = state?.productData?.find((p) => p?.node?.id === item?.node?.product?.id)
            let temp_variant = [...reduxVariant]
            let temp_item = { ...temp_variant[index] }
            temp_item = product?.node?.variants?.edges.map((item) => {
                return (
                    {
                        color: item?.node?.color,
                        size: item?.node?.size,
                        listPrice: item?.node?.listPrice
                    }
                )
            })
            temp_variant[index] = temp_item
            reduxVariant = temp_variant
            append(
                {
                    product: item?.node?.product?.id,
                    variant: item.node.variant.split(" ").join(""),
                    quantity: item?.node?.quantity
                }
            )
        })
        dispatch(actions.setVariant(reduxVariant))
    }


    useEffect(() => {
        if (edit) {
            reset({ ...defaultValues })
            setExpanded('panel1')
            fetchDetail(edit)
        }
        // eslint-disable-next-line
    }, [edit])

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card sx={{ p: 2 }}>
                <Grid container spacing={2}>
                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                            mb: 1
                        }}>
                        <Controller
                            id='userId'
                            name='userId'
                            control={control}
                            render={({ field }) => (
                                <FormControl
                                    fullWidth
                                    error={errors.userId ? true : false}>
                                    <InputLabel id="demo-simple-select-label">
                                        Select User
                                    </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        label="Select User"
                                        {...field}>
                                        {state?.userData?.map((item, i) => {
                                            return (
                                                <MenuItem
                                                    key={i}
                                                    value={`${item?.id}`}
                                                >
                                                    {item?.email}
                                                </MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>
                            )}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={12}
                        sx={{
                            mx: 1,
                            fontSize: 20
                        }}>
                        Shopping Cart
                    </Grid>
                    {fields.map((item, index) => (
                        <Grid container spacing={2} sx={{ p: 2 }} key={index}>
                            <Grid item xs={12} md={4}>
                                <Controller
                                    name={`products.${index}.product`}
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <FormControl fullWidth >
                                            <InputLabel >
                                                Select Product
                                            </InputLabel>
                                            <Select
                                                label="Select Product"
                                                required
                                                onChange={(e) => {
                                                    onChange(e)
                                                    dispatch(actions.updateVariant({ productId: e.target.value, index }))
                                                }}
                                                value={value}>
                                                {state?.productData?.map((item, i) => {
                                                    return (
                                                        <MenuItem value={item?.node?.id} key={i}>
                                                            {item?.node?.title.slice(0, 30)}..
                                                        </MenuItem>
                                                    )
                                                })}
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Controller
                                    name={`products.${index}.variant`}
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl fullWidth>
                                            <InputLabel >
                                                Select Variant
                                            </InputLabel>
                                            <Select
                                                label="Select Variant"
                                                required
                                                {...field}>
                                                {state?.variantData[index]?.map((item, i) => {
                                                    return (
                                                        <MenuItem
                                                            value={JSON.stringify(item)}
                                                            key={i}
                                                            sx={{ display: 'flex', justifyContent: 'space-around' }}
                                                        >
                                                            <Chip
                                                                sx={{
                                                                    height: 25,
                                                                    width: 25,
                                                                    display: 'inline-flex',
                                                                    borderRadius: 100,
                                                                    background: item?.color,
                                                                    border: 1
                                                                }}
                                                            />
                                                            <Chip label={item?.size} sx={{ mx: 2 }} />
                                                            <Chip label={`₹ ${item?.listPrice}`} />
                                                        </MenuItem>
                                                    )
                                                })}
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                md={2}>
                                <Controller
                                    name={`products.${index}.quantity`}
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            fullWidth
                                            label="Quantity"
                                            variant="outlined"
                                            required
                                            {...field}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                md={2}>
                                <DeleteForeverTwoToneIcon
                                    onClick={() => fields.length > 1 ? remove(index) : null}
                                    color="error"
                                    sx={{
                                        mt: 2,
                                        mx: 3,
                                        cursor: 'pointer'
                                    }}
                                />
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
                <br />
                <Button onClick={() => append({ product: "", variant: "", quantity: "" })}>
                    Add {fields.length > 0 ? "More" : ""} Product +
                </Button>
                <br /><br />
                <button type='submit' className='mybtn' disabled={pending}>
                    {pending ? "Processing" : <>{!edit ? 'Create' : 'Update'} Cart</>}
                </button>
            </Card >
        </form >
    )
}


export default CartCard