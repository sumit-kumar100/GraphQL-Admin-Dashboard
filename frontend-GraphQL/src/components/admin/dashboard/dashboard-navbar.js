import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { AppBar, Box, IconButton, Toolbar, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'transparent',
  boxShadow: theme.shadows[3]
}));

export const DashboardNavbar = (props) => {
  const { onSidebarOpen, ...other } = props;

  const Router = useRouter()

  const handleLogout = () => {
    Cookies.remove('accessToken')
    Router.replace('/admin/login')
  }

  return (
    <>
      <DashboardNavbarRoot
        sx={{
          left: {
            lg: 280
          },
          width: {
            lg: 'calc(100% - 280px)'
          }
        }}
        {...other}>
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2
          }}
        >
          <IconButton
            onClick={onSidebarOpen}
            sx={{
              display: {
                xs: 'inline-flex',
                lg: 'none'
              }
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="outlined"
            onClick={handleLogout}
            size="small"
          >
            Logout
          </Button>
        </Toolbar>
      </DashboardNavbarRoot>
    </>
  );
};

DashboardNavbar.propTypes = {
  onSidebarOpen: PropTypes.func
};
