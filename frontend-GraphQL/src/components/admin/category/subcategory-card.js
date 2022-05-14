import { Card, TextField, Grid, Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useEffect, Fragment } from 'react'
import { client } from '../../../utils/apollo-client'
import DataTable from 'react-data-table-component'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone'
import { GET_SUBCATEGORY_BY_ID } from '../../../GraphQL/Queries/admin/category'

const defaultValues = {
    category: "",
    title: ""
}

const SubCategoryCard = ({ state, edit, setEdit, deleteSubCategory, createSubCategory, updateSubCategory, dispatch }) => {

    const validateSchema = yup.object().shape({
        title: yup.string().required(),
    })

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        defaultValues,
        resolver: yupResolver(validateSchema)
    })

    const onSubmit = async (data) => {
        if (edit) {
            await dispatch(updateSubCategory({ id: edit, category: data?.category, title: data?.title }))
        } else {
            await dispatch(createSubCategory(data))
        }
        setEdit(null)
        reset({ ...defaultValues })
    }

    const fetchDetail = async (id) => {
        const response = await client.refetchQueries({ include: [{ query: GET_SUBCATEGORY_BY_ID, variables: { id } }] })
        if (response) {
            const { title, category } = { ...response[0].data.subcategoryById }
            reset({ ...defaultValues, title, category: category.id })
        }
    }

    const handleDelete = id => dispatch(deleteSubCategory(id))

    const handleEdit = id => setEdit(id)

    const columns = [
        {
            name: 'ID',
            selector: row => row?.node?.id
        },
        {
            name: 'Title',
            selector: row => row?.node?.title
        },
        {
            name: "Edit",
            cell: row => {
                return (
                    <Fragment>
                        <ModeEditIcon
                            onClick={() => handleEdit(row?.node?.id)}
                            color="primary"
                            sx={{ me: 2, cursor: 'pointer' }}
                        />
                        <DeleteForeverTwoToneIcon
                            onClick={() => handleDelete(row?.node?.id)}
                            color="error"
                            sx={{ mx: 2, cursor: 'pointer' }}
                        />
                    </Fragment>
                )
            }
        }
    ]



    useEffect(() => {
        if (edit) {
            fetchDetail(edit)
        }
        // eslint-disable-next-line
    }, [edit])


    return (
        <Box>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={9}>
                            <Box sx={{ mb: 4 }}>
                                <Controller
                                    id='category'
                                    name='category'
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Select Category</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                label="Select Category"
                                                {...field}
                                            >
                                                {
                                                    state?.categoryData?.map((item, i) => {
                                                        return (
                                                            <MenuItem key={i} value={`${item?.node?.id}`}>{item?.node?.title}</MenuItem>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                            </Box>
                            <Box sx={{ mb: 4 }}>
                                <Controller
                                    id='title'
                                    name='title'
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            error={errors.title}
                                            fullWidth
                                            helperText={errors.title?.type === 'required' && "This field is required."}
                                            label="Enter Title"
                                            variant="outlined"
                                            {...field}
                                        />
                                    )}
                                />
                            </Box>
                        </Grid>
                    </Grid >
                    <button type='submit' className='mybtn'>
                        {!edit ? 'Create' : 'Update'} SubCategory
                    </button>
                </Card >
            </form >
            <Box>
                <Typography
                    sx={{ my: 3, display: 'block', textAlign: 'center' }}
                    variant="h5"
                >
                    SubCategories
                </Typography>
                <DataTable
                    columns={columns}
                    data={state.subCategoryData}
                    highlightOnHover
                    pagination
                    paginationPerPage={10}
                    paginationComponentOptions={{
                        noRowsPerPage: true
                    }}
                />
            </Box>
        </Box>
    )
}


export default SubCategoryCard