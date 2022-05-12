import React, { Fragment } from 'react';
import { Box } from '@mui/material';
import DataTable from 'react-data-table-component';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';


const ProductList = ({ state, dispatch, deleteProduct, setEdit }) => {

    const { productData } = { ...state }

    const handleDelete = id => dispatch(deleteProduct(id))

    const handleEdit = id => setEdit(id)

    const columns = [
        {
            name: 'Title',
            selector: row => row?.node?.title
        },
        {
            name: 'List Price',
            selector: row => row?.node?.listPrice
        },
        {
            name: 'Cost',
            selector: row => row?.node?.cost
        },
        {
            name: 'Qty',
            selector: row => row?.node?.quantity
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
    ];

    return (
        <Box>
            <DataTable
                columns={columns}
                data={productData}
                highlightOnHover
                pagination
                paginationPerPage={10}
                paginationComponentOptions={{
                    noRowsPerPage: true
                }}
            />
        </Box>
    );
}

export default ProductList;