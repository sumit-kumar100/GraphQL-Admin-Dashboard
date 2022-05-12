import Head from 'next/head';
import { Box, Container } from '@mui/material';
import { requireAuthentication } from '../../utils/merchantAuth';
import { MerchantDashboardLayout } from '../../components/merchant/dashboard/dashboard-layout'

const Dashboard = () => {
    return (
        <MerchantDashboardLayout>
            <Head>
                <title>
                    Dashboard | Material Kit
                </title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth={false}>
                </Container>
            </Box>
        </MerchantDashboardLayout>
    )
}

export default Dashboard;

export const getServerSideProps = requireAuthentication((context) => {
    return {
        props: {}
    }
})