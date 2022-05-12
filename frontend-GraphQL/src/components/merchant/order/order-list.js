import React, { Fragment, useState } from 'react';
import { Box, Chip, Modal, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import DataTable from 'react-data-table-component';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const chipstyle = {
    height: 15,
    width: 15,
    display: 'inline-flex',
    borderRadius: 100,
    border: 1
}


const OrderList = ({ state, dispatch, deleteOrder, updateOrder }) => {

    const handleDelete = id => dispatch(deleteOrder(id))

    const [id, setId] = useState("")

    const [show, setShow] = useState(false)

    const [value, setValue] = useState("")

    const showModal = row => {
        setValue(row?.node?.orderStatus)
        setId(row?.node?.id)
        setShow(!show)
    }

    const updateStatus = e => {
        dispatch(updateOrder({ id, orderStatus: e.target.value }))
        setShow(!show)
    }

    const columns = [
        {
            name: 'Order ID',
            selector: row => row?.node?.id,
            maxWidth: '50px'
        },
        {
            name: 'User ID',
            selector: row => row?.node?.userId,
            maxWidth: '50px'
        },
        {
            name: 'Product ID',
            selector: row => row?.node?.product?.id,
            maxWidth: '50px'
        },
        {
            name: 'ordered qty',
            selector: row => row?.node?.quantity,
            maxWidth: '50px'
        },
        {
            name: 'Detail',
            selector: row => {
                const variant = JSON.parse(row?.node?.variant)
                return (
                    <Box>
                        {Object.keys(variant).length === 1 ?
                            <Chip sx={{ fontSize: 10, mx: 1 }} label={`₹ ${variant?.listPrice}`} />
                            :
                            <Fragment>
                                <Chip sx={{ ...chipstyle, background: variant?.color }} />
                                <Chip sx={{ fontSize: 10, mx: 1 }} label={`₹ ${variant?.listPrice} , ${variant?.size}`} />
                            </Fragment>}
                    </Box>
                )
            }
        },
        {
            name: 'Status',
            selector: row => row?.node?.orderStatus
        },
        {
            name: "Order Status",
            cell: row => {
                return (
                    <Fragment>
                        <ModeEditIcon
                            onClick={() => showModal(row)}
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

    const ExpandedComponent = ({ data }) => {
        const { id, userId, address, product, variant, quantity, orderStatus } = { ...data?.node }
        const renderVariant = product?.variants?.edges.map(variant => {
            return (
                {
                    "color": variant?.node?.color,
                    "size": variant?.node?.size,
                    "list Price": variant?.node?.listPrice,
                    "quantity": variant?.node?.quantity
                }
            )
        })
        const renderData = {
            "orderId": id,
            "userId": userId,
            "address": {
                "id": address?.id,
                "city": address?.city,
                "state": address?.state,
                "house No.": address?.houseNo,
                "colony": address?.colony,
                "landmark": address?.landmark,
                "pincode": address?.pinCode,
                "phone No.": address?.phoneNumber,
                "alternate No.": address?.alternateNumber
            },
            "Ordered Quantity": quantity,
            "Selected Variant": JSON.parse(variant),
            "orderStatus": orderStatus,
            "product Detail": {
                "title": product?.title,
                "brand": product?.brand,
                "description": product?.description,
                "mrp": product?.mrp,
                "list-price": product?.listPrice,
                "cost": product?.cost,
                "quantity": product?.quantity,
                "gstIncluded": product?.gstIncluded,
                "colors": product?.colors,
                "sizes": product?.sizes,
                "variant": renderVariant,
                "status": product?.status
            }
        }
        return <pre>{JSON.stringify(renderData, null, 3)}</pre>;
    };

    return (
        <Box>
            <Modal
                open={show}
                onClose={() => setShow(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Order Status</InputLabel>
                        <Select
                            label="Order Status"
                            value={value}
                            onChange={updateStatus}
                        >
                            <MenuItem value={'PENDING'}>PENDING</MenuItem>
                            <MenuItem value={'PLACED'}>PLACED</MenuItem>
                            <MenuItem value={'CANCELLED'}>CANCELLED</MenuItem>
                            <MenuItem value={'COMPLETED'}>COMPLETED</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Modal>
            <DataTable
                columns={columns}
                data={state.orderData}
                highlightOnHover
                pagination
                paginationPerPage={10}
                expandableRows
                expandableRowsComponent={ExpandedComponent}
                paginationComponentOptions={{
                    noRowsPerPage: true
                }}
            />
        </Box>
    );
}

export default OrderList;