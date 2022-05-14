import { Card, TextField, Grid, Box, FormControlLabel, Checkbox, Typography } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useEffect, Fragment, useState } from 'react'
import { client } from '../../../utils/apollo-client'
import { GET_USER_BY_ID } from '../../../GraphQL/Queries/admin/users'

const defaultValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    companyName: "None",
    companyPanNo: "None",
    gstNo: "None"
}

const UserCard = ({ state, edit, setEdit, createUser, updateUser, dispatch, setExpanded }) => {

    const [merchant, setMerchant] = useState(false)

    const [pending, setPending] = useState(false)

    const validateSchema = yup.object().shape({
        firstName: yup.string().required(),
        lastName: yup.string().required(),
        email: yup.string().email("Enter a valid email").required(),
        password: !edit ? yup.string().min(5).required() : null,
        companyName: yup.string().required(),
        companyPanNo: yup.string().required(),
        gstNo: yup.string().required()
    })

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm({
        defaultValues,
        resolver: yupResolver(validateSchema)
    })

    const onSubmit = async (data) => {
        setPending(true)
        if (edit) {
            await dispatch(updateUser({ ...data, id: edit }))
        } else {
            await dispatch(createUser(data))
        }
        setExpanded('panel2')
        setEdit(null)
        setMerchant(false)
        reset({ ...defaultValues })
        setPending(false)
    }

    const fetchDetail = async (id) => {
        const response = await client.refetchQueries({ include: [{ query: GET_USER_BY_ID, variables: { id } }] })
        if (response) {
            const { firstName, lastName, email, role, merchant } = { ...response[0]?.data?.userById }
            if (role === 'ADMIN' || role === 'CUSTOMER') {
                setMerchant(false)
                reset({ ...defaultValues, firstName, lastName, email })
            } else {
                setMerchant(true)
                reset({
                    ...defaultValues,
                    firstName,
                    lastName,
                    email,
                    companyName: merchant.companyName,
                    companyPanNo: merchant.companyPanNo,
                    gstNo: merchant.gstNo
                })
            }
        }
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
        <Box>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 2 }}>
                                <Controller
                                    id='firstName'
                                    name='firstName'
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            error={errors.firstName ? true : false}
                                            fullWidth
                                            helperText={errors.firstName?.type === 'required' && "This field is required."}
                                            label="Enter first Name"
                                            variant="outlined"
                                            {...field}
                                        />
                                    )}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 2 }}>
                                <Controller
                                    id='lastName'
                                    name='lastName'
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            error={errors.lastName ? true : false}
                                            fullWidth
                                            helperText={errors.lastName?.type === 'required' && "This field is required."}
                                            label="Enter Last Name"
                                            variant="outlined"
                                            {...field}
                                        />
                                    )}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 2 }}>
                                <Controller
                                    id='email'
                                    name='email'
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            error={errors.email ? true : false}
                                            fullWidth
                                            helperText={errors.email ? "Enter a valid Email" : ""}
                                            label="Enter Email"
                                            variant="outlined"
                                            {...field}
                                        />
                                    )}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 2 }}>
                                <Controller
                                    id='password'
                                    name='password'
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            error={errors.password ? true : false}
                                            fullWidth
                                            type='password'
                                            disabled={edit ? true : false}
                                            helperText={errors.password ? "Password must be atleast 8 character." : ""}
                                            label={"Enter Password"}
                                            variant="outlined"
                                            {...field}
                                        />
                                    )}
                                />
                            </Box>
                        </Grid>
                        <Box sx={{ mb: 2, mx: 3 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="checkedB"
                                        color="primary"
                                        disabled={edit ? true : false}
                                        onChange={() => {
                                            if (merchant) {
                                                setMerchant(false)
                                                setValue('companyName', "None")
                                                setValue('companyPanNo', "None")
                                                setValue('gstNo', "None")
                                            } else {
                                                setMerchant(true)
                                                setValue('companyName', "")
                                                setValue('companyPanNo', "")
                                                setValue('gstNo', "")
                                            }
                                        }}
                                    />
                                }
                                label="Is merchant account ?"
                            />
                        </Box>
                    </Grid>
                    <Box sx={{ display: merchant ? 'block' : 'none' }}>
                        <Typography variant="h5" align='center'>Add Merchant Detail</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ mt: 2 }}>
                                    <Controller
                                        id='companyName'
                                        name='companyName'
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                error={errors.companyName ? true : false}
                                                fullWidth
                                                helperText={errors.companyName?.type === 'required' && "This field is required."}
                                                label="Enter Company Name"
                                                variant="outlined"
                                                {...field}
                                            />
                                        )}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ mb: 2, mt: 2 }}>
                                    <Controller
                                        id='companyPanNo'
                                        name='companyPanNo'
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                error={errors.companyPanNo ? true : false}
                                                fullWidth
                                                helperText={errors.companyPanNo?.type === 'required' && "This field is required."}
                                                label="Enter Company Pan No"
                                                variant="outlined"
                                                {...field}
                                            />
                                        )}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ mb: 2 }}>
                                    <Controller
                                        id='gstNo'
                                        name='gstNo'
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                error={errors.gstNo ? true : false}
                                                fullWidth
                                                helperText={errors.gstNo?.type === 'required' && "This field is required."}
                                                label="Enter Gst No"
                                                variant="outlined"
                                                {...field}
                                            />
                                        )}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                    <button type='submit' className='mybtn' disabled={pending}>
                        {pending ? "Processing" : <>{!edit ? 'Create' : 'Update'} User</>}
                    </button>
                </Card >

            </form >
        </Box >
    )
}


export default UserCard