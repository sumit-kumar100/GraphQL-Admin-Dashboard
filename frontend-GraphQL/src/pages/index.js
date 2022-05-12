import { Box } from '@mui/material';
import AdminLogin from '../pages/admin/login'

const Dashboard = () => {
  return (
    <Box>
      <AdminLogin />
    </Box>
  )
}

export default Dashboard;


export async function getServerSideProps(context) {
  return {
    redirect: {
      destination: '/admin/dashboard',
      statusCode: 302
    }
  }
}