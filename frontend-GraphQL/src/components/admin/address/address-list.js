import React, { Fragment } from 'react';
import { Box } from '@mui/material';
import DataTable from 'react-data-table-component';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';


const AddressList = ({ state, dispatch, deleteAddress, setEdit }) => {

    const handleDelete = id => dispatch(deleteAddress(id))

    const handleEdit = id => setEdit(id)

    const columns = [
        {
            name: 'userID',
            selector: row => row?.node?.userId
        },
        {
            name: 'state',
            selector: row => row?.node?.state
        },
        {
            name: 'city',
            selector: row => row?.node?.city
        },
        {
            name: 'phone',
            selector: row => row?.node?.phoneNumber
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
                data={state.addressData}
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

export default AddressList;