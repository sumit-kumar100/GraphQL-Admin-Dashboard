import React, { Fragment } from 'react';
import { Box } from '@mui/material';
import DataTable from 'react-data-table-component';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';


const UserList = ({ state, dispatch, deleteUser, setEdit }) => {

    const { userData } = { ...state }

    const handleDelete = id => dispatch(deleteUser(id))

    const handleEdit = id => setEdit(id)

    const columns = [
        {
            name: 'first name',
            selector: row => row?.firstName
        },
        {
            name: 'last name',
            selector: row => row?.lastName
        },
        {
            name: 'email',
            selector: row => row?.email
        },
        {
            name: 'role',
            selector: row => row?.role
        },
        {
            name: "Edit",
            cell: row => {
                return (
                    <Fragment>
                        {
                            row?.role !== 'ADMIN' ?
                                <>
                                    <ModeEditIcon
                                        onClick={() => handleEdit(row?.id)}
                                        color="primary"
                                        sx={{ me: 2, cursor: 'pointer' }}
                                    />
                                    <DeleteForeverTwoToneIcon
                                        onClick={() => handleDelete(row?.id)}
                                        color="error"
                                        sx={{ mx: 2, cursor: 'pointer' }}
                                    />
                                </>
                                : <></>
                        }

                    </Fragment>
                )
            }
        }
    ];

    return (
        <Box>
            <DataTable
                columns={columns}
                data={userData}
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