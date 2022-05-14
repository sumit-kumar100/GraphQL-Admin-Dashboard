import Head from 'next/head';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useEffect } from 'react';
import CartCard from '../../../components/admin/cart/cart-card'
import { Box, Container, Button } from '@mui/material';
import { requireAuthentication } from '../../../utils/adminAuth';
import { AdminDashboardLayout } from '../../../components/admin/dashboard/dashboard-layout';
import { actions, getCart, getCartInfo, createCart, updateCart, deleteCart } from '../../../store/adminStore/cart'
import CartList from '../../../components/admin/cart/cart-list'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';


const Users = () => {

    const state = useSelector(state => state.cart)

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
        dispatch(getCartInfo())
        dispatch(getCart())
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
                                Add Cart +
                            </Button>
                        </AccordionSummary>
                        <AccordionDetails>
                            <CartCard
                                state={state}
                                actions={actions}
                                edit={edit}
                                setEdit={setEdit}
                                createCart={createCart}
                                updateCart={updateCart}
                                setExpanded={setExpanded}
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
                            <Typography variant="h5">Carts</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <CartList
                                state={state}
                                actions={actions}
                                deleteCart={deleteCart}
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