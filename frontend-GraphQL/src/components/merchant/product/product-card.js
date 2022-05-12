import { Card, TextField, Grid, Box, Typography, Button } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTheme } from '@mui/material/styles'
import Checkbox from '@mui/material/Checkbox'
import * as yup from 'yup'
import { useEffect, useState } from 'react'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import VariantPreview from './variant-preview'
import FormControl from '@mui/material/FormControl'
import ProductGallary from './product-gallary'
import { client } from '../../../utils/apollo-client'
import { GET_PRODUCT_BY_ID } from '../../../GraphQL/Queries/admin/product'

const defaultValues = {
  sublist: "",
  title: "",
  brand: "",
  description: "",
  mrp: "",
  listPrice: "",
  cost: "",
  quantity: "",
  gstIncluded: true
}
const ITEM_HEIGHT = 48

const ITEM_PADDING_TOP = 8

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

const getStyles = (item, selected, theme) => {
  return {
    fontWeight:
      selected.indexOf(item) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  }
}

const ProductCard = ({ state, actions, createProduct, updateProduct, dispatch, edit, setEdit, setExpanded }) => {

  const { colors, sizes, selectedColors, selectedSizes, subListData } = { ...state }

  const [margin, setMargin] = useState(0)
  const [profit, setProfit] = useState(0)

  const theme = useTheme()

  const validateSchema = yup.object().shape({
    sublist: yup.string().required(),
    title: yup.string().required(),
    brand: yup.string().required(),
    description: yup.string().required(),
    mrp: yup.number().required(),
    listPrice: yup.number().required(),
    cost: yup.number().required(),
    quantity: yup.number().required()
  })

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    reset
  } = useForm({
    defaultValues,
    resolver: yupResolver(validateSchema)
  })


  // Calculaing Margin Percentage and Profit 
  const handleChange = (e) => {
    setValue("cost", e?.target.value)
    const profit = parseInt(getValues('listPrice')) - parseInt(getValues('cost'))
    setProfit(profit)
    setMargin(((100 * profit) / (profit + parseInt(getValues('listPrice')))).toFixed(1))
  }

  // Update Color State in Redux
  const onColorSelect = color => dispatch(actions.pushColor(color))

  // Update Size State in Redux
  const onSizeSelect = size => dispatch(actions.pushSize(size))

  const [pending, setPending] = useState(false)

  // Submit Product Data
  const onSubmit = async (rawData) => {
    setPending(true)
    if (edit) {
      await dispatch(updateProduct({ ...rawData, id: edit }))
    } else {
      await dispatch(createProduct(rawData))
    }
    setExpanded('panel2')
    setEdit(null)
    reset({ ...defaultValues })
    dispatch(actions.clearState())
    setPending(false)
  }

  // fetching data for update
  const fetchDetail = async (id) => {
    const response = await client.refetchQueries({ include: [{ query: GET_PRODUCT_BY_ID, variables: { id } }] })
    if (response) {
      const { sublist, title, brand, description, mrp, listPrice, cost, colors, sizes, quantity, gstIncluded, images, variants } = { ...response[0].data.productById }
      dispatch(actions.handleColors(colors))
      dispatch(actions.handleSizes(sizes))
      images.edges.forEach((item) => {
        const url = 'data:image/jpeg;base64,' + item?.node?.image?.data.slice(2, -1)
        fetch(url)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], "File name", { type: "image/jpeg" })
            dispatch(actions.addSelectedImage(file))
          })
      })

      variants.edges.forEach((item, i) => {
        const { color, images, listPrice, quantity, size } = { ...item.node }
        const variants_data = { color, listPrice, quantity, size, images: [] }
        dispatch(actions.handleVariant(variants_data))

        images.edges.forEach((image) => {
          const url = 'data:image/jpeg;base64,' + image?.node?.image?.data.slice(2, -1)
          fetch(url)
            .then(res => res.blob())
            .then(blob => {
              const file = new File([blob], "File name", { type: "image/jpeg" })
              dispatch(actions.addVariantImage({ index: i, image: file }))
            })
        })
      })
      reset({
        ...defaultValues,
        sublist: sublist.id,
        title,
        brand,
        description,
        mrp,
        listPrice,
        cost,
        quantity,
        gstIncluded
      })
    }
  }


  useEffect(() => {
    if (edit) {
      setExpanded('panel1')
      dispatch(actions.clearState())
      fetchDetail(edit)
    }
  }, [edit])


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={9}>
          <Card
            sx={{
              display: 'flex',
              flexDirection: 'column',
              p: 2
            }}
          >
            <Typography
              sx={{ m: 1, mb: 2 }}
              variant="h5"
            >
              Product
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Controller
                id='sublist'
                name='sublist'
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Select Product Variety</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      label="Select Product Variety"
                      {...field}
                    >
                      {
                        subListData?.map((item, i) => {
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
                    error={errors.title ? true : false}
                    fullWidth
                    helperText={errors.title?.type === 'required' && "This field is required."}
                    label="Enter Title"
                    variant="outlined"
                    {...field}
                  />
                )}
              />
            </Box>
            <Box sx={{ mb: 4 }}>
              <Controller
                id='brand'
                name='brand'
                control={control}
                render={({ field }) => (
                  <TextField
                    error={errors.brand ? true : false}
                    fullWidth
                    helperText={errors.brand?.type === 'required' && "This field is required."}
                    label="Enter Brand"
                    variant="outlined"
                    {...field}
                  />
                )}
              />
            </Box>
            <Box>
              <Controller
                id='description'
                name='description'
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    id="outlined-multiline-static"
                    error={errors.description ? true : false}
                    label="Enter Description"
                    helperText={errors.description?.type === 'required' && "This field is required."}
                    multiline
                    rows={5}
                    {...field}
                  />
                )}
              />
            </Box>
          </Card>
          <Card
            sx={{
              display: 'flex',
              flexDirection: 'column',
              mt: 2,
              p: 2
            }}
          >
            <Typography
              sx={{ m: 1, mb: 2 }}
              variant="h5"
            >
              Pricing
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 4 }}>
                  <Controller
                    id='mrp'
                    name='mrp'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        type="number"
                        error={errors.mrp ? true : false}
                        InputProps={{ inputProps: { min: 0 } }}
                        label="Enter MRP"
                        helperText={errors.mrp?.type === 'required' && "This field is required."}
                        variant="outlined"
                        {...field}
                      />
                    )}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 4 }}>
                  <Controller
                    id='listPrice'
                    name='listPrice'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        type="number"
                        error={errors.listPrice ? true : false}
                        InputProps={{ inputProps: { min: 0 } }}
                        label="Enter List Price"
                        helperText={errors.listPrice?.type === 'required' && "This field is required."}
                        variant="outlined"
                        {...field}
                      />
                    )}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 4 }}>
                  <Controller
                    id='cost'
                    name='cost'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        type="number"
                        error={errors.cost ? true : false}
                        label="Cost Per Item"
                        InputProps={{ inputProps: { min: 0 } }}
                        helperText={errors.cost?.type === 'required' && "This field is required."}
                        variant="outlined"
                        onChange={e => {
                          onChange(e)
                          handleChange(e)
                        }}
                        value={value}
                      />
                    )}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-around' }}>
                  <Box>
                    <span style={{ color: 'gray' }}>Margin(%)</span>
                    <br />
                    {margin}%
                  </Box>
                  <Box>
                    <span style={{ color: 'gray' }}>Profit(₹)</span>
                    <br />
                    ₹{profit}
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
                  <Controller
                    id='gstIncluded'
                    name='gstIncluded'
                    control={control}
                    render={({ field }) => (
                      <Checkbox defaultChecked={true} {...field} color="success" />
                    )}
                  />
                  <Box>
                    Charge tax on this product
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Card>
          <Card
            sx={{
              mt: 2,
              p: 2
            }}
          >
            <Typography
              sx={{ m: 1, mb: 2 }}
              variant="h5"
            >
              Product Gallary
            </Typography>
            <ProductGallary
              state={state}
              actions={actions}
              dispatch={dispatch}
            />
          </Card>
          <Card
            sx={{
              display: 'flex',
              flexDirection: 'column',
              mt: 2,
              p: 2
            }}
          >
            <Typography
              sx={{ m: 1, mb: 2 }}
              variant="h5"
            >
              Stocks
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 4 }}>
                  <Controller
                    id='quantity'
                    name='quantity'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        type="number"
                        InputProps={{ inputProps: { min: 0 } }}
                        error={errors.quantity ? true : false}
                        label="Enter Quantity"
                        helperText={errors.quantity?.type === 'required' && "This field is required."}
                        variant="outlined"
                        {...field}
                      />
                    )}
                  />
                </Box>
              </Grid>
            </Grid>
          </Card>
          <Box sx={{ mt: 2, p: 2, background: 'white' }}>
            <Typography
              sx={{ m: 1, mb: 2 }}
              variant="h5"
            >
              Variants
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4} sx={{ display: 'grid', placeItems: 'center' }}>
                Colors
              </Grid>
              <Grid item xs={12} md={7}>
                <FormControl fullWidth>
                  <InputLabel id="select-color">Select Colors</InputLabel>
                  <Select
                    labelId="select-color-multiple-chip-label"
                    id="select-color-multiple-chip"
                    multiple
                    value={selectedColors}
                    onChange={(e, data) => onColorSelect(data.props.value)}
                    input={<OutlinedInput id="select-multiple-chip-size" label="Select Colors" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value, i) => (
                          <Chip
                            key={i}
                            label={''}
                            sx={{
                              height: 25,
                              width: 25,
                              display: 'inline-flex',
                              borderRadius: 100,
                              background: value,
                              border: 1
                            }}
                          />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {colors?.map((color, i) => (
                      <MenuItem
                        key={i}
                        value={color}
                        sx={{
                          height: 20,
                          margin: 1,
                          width: 10,
                          display: 'inline-flex',
                          borderRadius: 100,
                          background: color,
                          border: 1
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = color}
                        style={getStyles(color, selectedColors, theme)}
                      >
                        {/* {color} */}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4} sx={{ display: 'grid', placeItems: 'center' }}>
                Sizes
              </Grid>
              <Grid item xs={12} md={7}>
                <FormControl fullWidth>
                  <InputLabel id="select-size">Select Sizes</InputLabel>
                  <Select
                    labelId="select-size-multiple-chip-label"
                    id="select-size-multiple-chip"
                    multiple
                    value={selectedSizes}
                    onChange={(e, data) => onSizeSelect(data.props.value)}
                    input={<OutlinedInput id="select-multiple-chip-size" label="Select Sizes" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value, i) => (
                          <Chip key={i} label={value} />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {sizes?.map((size, i) => (
                      <MenuItem
                        key={i}
                        value={size}
                        style={getStyles(size, selectedSizes, theme)}
                      >
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          <Grid />
        </Grid>
        <Grid item xs={12} md={3}>

        </Grid>
      </Grid >
      <Box sx={{ background: "white", p: 2, mt: 2 }}>
        <Typography
          sx={{ mb: 2, my: 4, textAlign: 'center', color: '#302f2e' }}
          variant="h5"
        >
          Variant Preview
        </Typography>
        <VariantPreview
          variants={state?.variants}
          actions={actions}
          dispatch={dispatch}
        />
      </Box>
      <button type='submit' className='mybtn' disabled={pending}>
        {pending ? "Processing" : <>{!edit ? 'Create' : 'Update'} Product</>}
      </button>
    </form >
  )
}


export default ProductCard