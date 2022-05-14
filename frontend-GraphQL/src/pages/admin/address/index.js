import Head from 'next/head';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useEffect } from 'react';
import { Box, Container, Button } from '@mui/material';
import AddressCard from '../../../components/admin/address/address-card'
import AddressList from '../../../components/admin/address/address-list'
import { requireAuthentication } from '../../../utils/adminAuth';
import { AdminDashboardLayout } from '../../../components/admin/dashboard/dashboard-layout';
import { actions, getUsers, getAddress, createAddress, updateAddress, deleteAddress } from '../../../store/adminStore/address'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';


const Users = () => {

    const state = useSelector(state => state.address)

    const [edit, setEdit] = useState(null)

    const [expanded, setExpanded] = useState('panel2')

    const dispatch = useDispatch()

    const toggle = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    useEffect(() => {
        if (state?.message) {
            toast.success(state.message)
            dispatch(actions.clearMessage())
        }
    }, [state?.message, dispatch])

    useEffect(() => {
        dispatch(getUsers())
        dispatch(getAddress())
    });

    return (
        <AdminDashboardLayout>
            <Head>
                <title>
                    Products | Material Kit
                </title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 3
                }}
            >
                <Container maxWidth={false}>
                    <Accordion expanded={expanded === 'panel1'} onChange={toggle('panel1')}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Button
                                variant="text"
                                color="primary"
                                component="span"
                            >
                                Add Address +
                            </Button>
                        </AccordionSummary>
                        <AccordionDetails>
                            <AddressCard
                                state={state}
                                actions={actions}
                                edit={edit}
                                setEdit={setEdit}
                                setExpanded={setExpanded}
                                createAddress={createAddress}
                                updateAddress={updateAddress}
                                dispatch={dispatch}
                            />
                        </AccordionDetails>
                    </Accordion>
                    <Accordion expanded={expanded === 'panel2'} onChange={toggle('panel2')}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2a-content"
                            id="panel2a-header"
                            sx={{ mt: 2 }}
                        >
                            <Typography variant="h5">Addresses</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <AddressList
                                state={state}
                                actions={actions}
                                deleteAddress={deleteAddress}
                                dispatch={dispatch}
                                setEdit={setEdit}
                            />
                        </AccordionDetails>
                    </Accordion>
                </Container>
            </Box>
        </AdminDashboardLayout>
    )
}


export default Users;


export const getServerSideProps = requireAuthentication((context) => {
    return {
        props: {}
    }
})