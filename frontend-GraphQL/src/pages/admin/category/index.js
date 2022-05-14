import Head from 'next/head'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { AdminDashboardLayout } from '../../../components/admin/dashboard/dashboard-layout'
import { toast } from 'react-toastify'
import { useEffect, useState, Fragment } from 'react'
import { requireAuthentication } from '../../../utils/adminAuth'
import { Box, Container, Button } from '@mui/material'
import CategoryCard from '../../../components/admin/category/category-card'
import SubCategoryCard from '../../../components/admin/category/subcategory-card'
import SubListCard from '../../../components/admin/category/sublist-card'
import {
    actions, getData,
    createCategory, updateCategory, deleteCategory,
    createSubCategory, updateSubCategory, deleteSubCategory,
    createSubList, updateSubList, deleteSubList
} from '../../../store/adminStore/category'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'


const Category = () => {

    const state = useSelector(state => state.category)

    const [categoryedit, setCategoryEdit] = useState(null)
    const [subcategoryedit, setSubcategoryEdit] = useState(null)
    const [sublistedit, setSublistEdit] = useState(null)

    const [expanded, setExpanded] = useState(false)

    const dispatch = useDispatch()

    const toggle = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false)
    }

    useEffect(() => {
        if (state?.message) {
            toast.success(state.message)
            dispatch(actions.clearMessage())
        }
    }, [state?.message, dispatch])

    useEffect(() => {
        dispatch(getData())
    });

    return (
        <AdminDashboardLayout>
            <Head>
                <title>
                    Category | Material Kit
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
                                Add Category +
                            </Button>
                        </AccordionSummary>
                        <AccordionDetails>
                            <CategoryCard
                                state={state}
                                edit={categoryedit}
                                createCategory={createCategory}
                                updateCategory={updateCategory}
                                deleteCategory={deleteCategory}
                                dispatch={dispatch}
                                setEdit={setCategoryEdit}
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
                            <Button
                                variant="text"
                                color="primary"
                                component="span"
                            >
                                Add SubCategory +
                            </Button>
                        </AccordionSummary>
                        <AccordionDetails>
                            <SubCategoryCard
                                state={state}
                                edit={subcategoryedit}
                                createSubCategory={createSubCategory}
                                updateSubCategory={updateSubCategory}
                                deleteSubCategory={deleteSubCategory}
                                dispatch={dispatch}
                                setEdit={setSubcategoryEdit}
                            />
                        </AccordionDetails>
                    </Accordion>
                    <Accordion expanded={expanded === 'panel3'} onChange={toggle('panel3')}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel3a-content"
                            id="panel3a-header"
                            sx={{ mt: 2 }}
                        >
                            <Button
                                variant="text"
                                color="primary"
                                component="span"
                            >
                                Add SubList +
                            </Button>
                        </AccordionSummary>
                        <AccordionDetails>
                            <SubListCard
                                state={state}
                                edit={sublistedit}
                                createSubList={createSubList}
                                updateSubList={updateSubList}
                                deleteSubList={deleteSubList}
                                dispatch={dispatch}
                                setEdit={setSublistEdit}
                            />
                        </AccordionDetails>
                    </Accordion>
                </Container>
            </Box>
        </AdminDashboardLayout>

    )
}


export default Category


export const getServerSideProps = requireAuthentication((context) => {
    return {
        props: {}
    }
})