import Head from 'next/head';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MerchantDashboardLayout } from '../../../components/merchant/dashboard/dashboard-layout'
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useEffect, Fragment } from 'react';
import { Box, Container, Button } from '@mui/material';
import ProductCard from '../../../components/merchant/product/product-card';
import ProductList from '../../../components/merchant/product/prodcut-list'
import { requireAuthentication } from '../../../utils/merchantAuth';
import { actions, getProduct, getSubList, createProduct, updateProduct, deleteProduct } from '../../../store/merchantStore/products';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';


const Products = () => {

  const state = useSelector(state => state.merchantProducts)

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
    dispatch(getProduct())
    dispatch(getSubList())
  });

  return (
    <MerchantDashboardLayout>
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
                Add Products +
              </Button>
            </AccordionSummary>
            <AccordionDetails>
              {
                expanded == 'panel1' ?
                  <>
                    <ProductCard
                      state={state}
                      actions={actions}
                      edit={edit}
                      setEdit={setEdit}
                      setExpanded={setExpanded}
                      createProduct={createProduct}
                      updateProduct={updateProduct}
                      dispatch={dispatch}
                    />
                  </>
                  : (<></>)
              }
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel2'} onChange={toggle('panel2')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
              sx={{ mt: 2 }}
            >
              <Typography variant="h5">Products</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ProductList
                state={state}
                actions={actions}
                deleteProduct={deleteProduct}
                dispatch={dispatch}
                setEdit={setEdit}
              />
            </AccordionDetails>
          </Accordion>
        </Container>
      </Box>
    </MerchantDashboardLayout>
  )
}

export default Products


export const getServerSideProps = requireAuthentication((context) => {
  return {
    props: {}
  }
})