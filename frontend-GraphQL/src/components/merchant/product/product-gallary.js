import React, { useState } from 'react';
import { Button, Box, Grid, Card } from '@mui/material';
import Image from 'next/image';



const ProductGallary = ({ state, actions, dispatch }) => {

    // Handle Image Change
    const imageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            dispatch(actions.addSelectedImage(e.target.files[0]))
        }
    }

    const deleteGallary = () => dispatch(actions.deleteGallary())

    return (
        <Box>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Box>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={imageChange}
                        style={{ display: 'none' }}
                        id="contained-button-file"
                    />
                    <label htmlFor="contained-button-file">
                        <Button variant="contained" color="success" component="span" sx={{ mb: 3 }} >
                            Add {state.selectedImage.length < 1 ? "Image" : "More"} +
                        </Button>
                    </label>
                </Box>
                <Box>
                    <Button
                        variant="contained"
                        color="error"
                        disabled={state.selectedImage.length < 1 && state.selectedVariantImage.length < 1 ? true : false}
                        component="span"
                        onClick={deleteGallary}
                        sx={{ mb: 3 }} >
                        Delete All
                    </Button>
                </Box>
            </Box>
            <Grid container spacing={4}>
                {state.selectedVariantImage && (
                    state.selectedVariantImage.map((image, i) => {
                        return (
                            <Grid item xs={4} key={i}>
                                <Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 1 }}>
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt="Product Priveiw Image"
                                        style={{
                                            width: '100%',
                                            maxHeight:300
                                        }}
                                    />
                                </Card>
                            </Grid>
                        )
                    })
                )}
                {state.selectedImage && (
                    state.selectedImage.map((image, i) => {
                        return (
                            <Grid item xs={4} key={i}>
                                <Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 1 }}>
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt="Product Priveiw Image"
                                        style={{
                                            width: '100%',
                                            maxHeight:300
                                        }}
                                    />
                                </Card>
                            </Grid>
                        )
                    })
                )}
            </Grid>
        </Box>
    )
}


export default ProductGallary;