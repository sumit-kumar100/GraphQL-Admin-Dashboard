import { Card, TextField, Grid, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import MuiPhoneNumber from 'material-ui-phone-number';
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useEffect, useState } from 'react'
import { client } from '../../../utils/apollo-client'
import { GET_ADDRESS_BY_ID } from '../../../GraphQL/Queries/admin/address'

const defaultValues = {
    userId: "",
    houseNo: "",
    colony: "",
    landmark: "",
    pinCode: "",
    city: "",
    state: "",
    phoneNo: "",
    alternateNo: ""
}

const AddressCard = ({ state, edit, setEdit, createAddress, updateAddress, dispatch, setExpanded }) => {

    const validateSchema = yup.object().shape({
        userId: yup.string().required(),
        houseNo: yup.string().required(),
        colony: yup.string().required(),
        landmark: yup.string().required(),
        pinCode: yup.string().required(),
        city: yup.string().required(),
        state: yup.string().required(),
        phoneNo: yup.string().required(),
        alternateNo: yup.string().required()
    })

    const [pending, setPending] = useState(false)

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
            await dispatch(updateAddress({ ...data, id: edit }))
        } else {
            await dispatch(createAddress(data))
        }
        setExpanded('panel2')
        setEdit(null)
        reset({ ...defaultValues })
        setPending(false)
    }

    const fetchDetail = async (id) => {
        const response = await client.refetchQueries({ include: [{ query: GET_ADDRESS_BY_ID, variables: { id } }] })
        if (response) {
            const { userId, houseNo, colony, landmark, pinCode, city, state, phoneNumber, alternateNumber } = { ...response[0].data.addressById }
            reset({
                ...defaultValues,
                userId,
                houseNo,
                colony,
                landmark,
                pinCode,
                city,
                state,
                phoneNo: phoneNumber,
                alternateNo: alternateNumber
            })
        }
    }

    useEffect(() => {
        if (edit) {
            reset({ ...defaultValues })
            setExpanded('panel1')
            fetchDetail(edit)
        }
    }, [edit])


    return (
        <Box>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 2 }}>
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
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 2 }}>
                                <Controller
                                    id='houseNo'
                                    name='houseNo'
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            error={errors.houseNo ? true : false}
                                            fullWidth
                                            helperText={errors.houseNo?.type === 'required' && "This field is required."}
                                            label="Enter House No"
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
                                    id='colony'
                                    name='colony'
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            error={errors.colony ? true : false}
                                            fullWidth
                                            helperText={errors.colony?.type === 'required' && "This field is required."}
                                            label="Enter Colony"
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
                                    id='landmark'
                                    name='landmark'
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            error={errors.landmark ? true : false}
                                            fullWidth
                                            helperText={errors.landmark?.type === 'required' && "This field is required."}
                                            label="Enter landmark"
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
                                    id='pinCode'
                                    name='pinCode'
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            error={errors.pinCode ? true : false}
                                            fullWidth
                                            type="number"
                                            helperText={errors.pinCode?.type === 'required' && "This field is required."}
                                            label="Enter PIN"
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
                                    id='city'
                                    name='city'
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            error={errors.city ? true : false}
                                            fullWidth
                                            helperText={errors.city?.type === 'required' && "This field is required."}
                                            label="Enter City"
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
                                    id='state'
                                    name='state'
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            error={errors.state ? true : false}
                                            fullWidth
                                            helperText={errors.state?.type === 'required' && "This field is required."}
                                            label="Enter State"
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
                                    id='phoneNo'
                                    name='phoneNo'
                                    control={control}
                                    render={({ field }) => (
                                        <MuiPhoneNumber
                                            defaultCountry="in"
                                            error={errors.phoneNo ? true : false}
                                            helperText={errors.phoneNo?.type === 'required' && "This field is required."}
                                            fullWidth
                                            label="Enter phone no."
                                            variant='outlined'
                                            {...field}
                                        />
                                    )}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ mb: 2 }}>
                                <Controller
                                    id='alternateNo'
                                    name='alternateNo'
                                    control={control}
                                    render={({ field }) => (
                                        <MuiPhoneNumber
                                            defaultCountry="in"
                                            error={errors.alternateNo ? true : false}
                                            helperText={errors.alternateNo?.type === 'required' && "This field is required."}
                                            fullWidth
                                            label="Enter alternate no."
                                            variant='outlined'
                                            {...field}
                                        />
                                    )}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                    <button type='submit' className='mybtn' disabled={pending}>
                        {pending ? "Processing" : <>{!edit ? 'Create' : 'Update'} Address</>}
                    </button>
                </Card >

            </form >
        </Box >
    )
}


export default AddressCard