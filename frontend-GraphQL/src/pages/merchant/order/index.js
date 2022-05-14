import Head from 'next/head';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MerchantDashboardLayout } from '../../../components/merchant/dashboard/dashboard-layout'
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useEffect } from 'react';
import { Box, Container } from '@mui/material';
import OrderList from '../../../components/merchant/order/order-list';
import { requireAuthentication } from '../../../utils/merchantAuth';
import { actions, getOrder, updateOrder, deleteOrder } from '../../../store/merchantStore/order';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    outline: 0,
    transform: 'translate(-50%, -50%)',
    width: '70%',
    height: 500,
    overflow: "scroll",
    bgcolor: 'background.paper',
};

const Orders = () => {

    const state = useSelector(state => state.merchantOrders)

    const [edit, setEdit] = useState(null)

    const [expanded, setExpanded] = useState('panel1')

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
        dispatch(getOrder())
    });

    return (
        <MerchantDashboardLayout>
            <Head>
                <title>
                    Orders | Material Kit
                </title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 3
                }}>
                <Container maxWidth={false}>
                    <Accordion expanded={expanded === 'panel1'} onChange={toggle('panel1')}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            sx={{ mt: 2 }}
                        >
                            <Typography variant="h5">Customer Orders</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <OrderList
                                state={state}
                                actions={actions}
                                dispatch={dispatch}
                                setEdit={setEdit}
                                updateOrder={updateOrder}
                                deleteOrder={deleteOrder}
                            />
                        </AccordionDetails>
                    </Accordion>
                </Container>
            </Box>
        </MerchantDashboardLayout>
    )
}

export default Orders


export const getServerSideProps = requireAuthentication((context) => {
    return {
        props: {}
    }
})