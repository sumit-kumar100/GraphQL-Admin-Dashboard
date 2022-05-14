import React, { Fragment } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Grid, Box, TextField, Chip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { PhotoCamera } from '@mui/icons-material'
import { IconButton } from '@mui/material'

const Variant = ({ variants, actions, dispatch }) => {

    // Handle Image Change
    const imageChange = (event, index) => {
        if (event.target.files && event.target.files.length > 0) {
            dispatch(actions.addVariantImage({ index: index, image: event.target.files[0] }))
        }
    }

    // Removing Variant from Redux
    const RemoveVariant = index => dispatch(actions.removeVariant(index))

    // Updating Variant Price in Redux
    const updatePrice = (event, index) => dispatch(actions.updateVariant({ index: index, key: "listPrice", value: event.target.value }))

    // Updating Variant Quantity in Redux
    const updateStock = (event, index) => dispatch(actions.updateVariant({ index: index, key: "quantity", value: event.target.value }))

    return (
        <Fragment>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Image</TableCell>
                            <TableCell align="right">Color</TableCell>
                            <TableCell align="right">Size</TableCell>
                            <TableCell align="center">Price</TableCell>
                            <TableCell align="center">Quantity</TableCell>
                            <TableCell align="right">Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {variants.length ? variants.map((variant, i) => (
                            <TableRow
                                key={i}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: 2
                                    }}>
                                        {variant.images.length ?
                                            <img
                                                src={URL.createObjectURL(variant.images[0])}
                                                alt="variant-thumbnail"
                                                height={60}
                                                width={50}
                                                style={{ borderRadius: 10 }}
                                            />
                                            : <></>}
                                        <Box>
                                            <input
                                                accept="image/*"
                                                id={`icon-button-file-${i}`}
                                                type="file"
                                                onChange={(e) => imageChange(e, i)}
                                                style={{ display: 'none' }}
                                            />
                                            <label htmlFor={`icon-button-file-${i}`}>
                                                <IconButton
                                                    color="primary"
                                                    aria-label="upload picture"
                                                    component="span"
                                                >
                                                    <PhotoCamera />
                                                    <span style={{ marginBottom: 19 }}>
                                                        {variant.images.length < 1 ? "" : "+"}
                                                    </span>
                                                </IconButton>
                                            </label>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell align="center">
                                    <Chip
                                        sx={{
                                            height: 25,
                                            width: 25,
                                            display: 'inline-flex',
                                            borderRadius: 100,
                                            background: variant.color,
                                            border: 1
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <Chip
                                        label={variant.size} 
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <TextField
                                        defaultValue={variant.listPrice}
                                        onChange={(e) => updatePrice(e, i)}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <TextField
                                        defaultValue={variant.quantity}
                                        onChange={(e) => updateStock(e, i)}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <DeleteIcon sx={{ color: '#cf361b', cursor: 'pointer' }} onClick={() => RemoveVariant(i)} />
                                </TableCell>
                            </TableRow>
                        )) : <></>}
                    </TableBody>
                </Table>
            </TableContainer>

        </Fragment>
    )
}


export default Variant