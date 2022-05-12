import React, { Fragment } from 'react';
import { Box } from '@mui/material';
import DataTable from 'react-data-table-component';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';


const UserList = ({ state, dispatch, deleteCart, setEdit }) => {

    const handleDelete = id => dispatch(deleteCart(id))

    const handleEdit = id => setEdit(id)

    const columns = [
        {
            name: 'CartID',
            selector: row => row?.node?.id
        },
        {
            name: 'UserID',
            selector: row => row?.node?.userId
        },
        {
            name: 'Product In Cart',
            selector: row => row?.node?.products?.edges.length
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
                data={state.cartData}
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

export default UserList;