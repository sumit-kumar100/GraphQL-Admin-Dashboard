import Head from 'next/head';
import { Box, Container } from '@mui/material';
import { requireAuthentication } from '../../utils/adminAuth';
import { AdminDashboardLayout } from '../../components/admin/dashboard/dashboard-layout';


const Dashboard = () => {
    return (
        <AdminDashboardLayout>
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
        </AdminDashboardLayout>
    )
}

export default Dashboard;


export const getServerSideProps = requireAuthentication((context) => {
    return {
        props: {}
    }
})

