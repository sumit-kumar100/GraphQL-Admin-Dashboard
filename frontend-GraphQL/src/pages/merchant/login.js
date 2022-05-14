import React, { Fragment, useState } from 'react'
import { Box, Typography, TextField, Button, Container } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Checkbox from '@mui/material/Checkbox';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import Cookies from 'js-cookie'


const LOGIN_USER = gql`
    mutation tokenAuth($email: String! , $password: String!){
        tokenAuth(email: $email , password: $password){
            token
            payload
        }
    }
`;

const Login = () => {
    const Router = useRouter()

    const [email, setEmail] = useState('neeraj@gmail.com')

    const [password, setPassword] = useState('Neeraj123#')

    const [pending, setPending] = useState(false)

    const [showPassword, setShowPassword] = useState(false)

    const onSuccess = ({ tokenAuth }) => {
        const { token } = { ...tokenAuth }
        Cookies.set('accessToken', token)
        Router.replace('/merchant/dashboard')
    }

    // Login Mutations
    const [LoginUser] = useMutation(LOGIN_USER, {
        variables: { email, password },
        onError: (error) => console.log(error),
        onCompleted: (data) => onSuccess(data)
    })

    const handleSubmit = async e => {
        if (!pending) {
            setPending(true)
            e?.preventDefault()
            await LoginUser()
            setPending(false)
        }
    }

    return (
        <Fragment>
            <form onSubmit={handleSubmit}>
                <Container>
                    <Box sx={{ marginX: { sm: 0, md: 14 }, display: 'flex', boxShadow: '0px 10px 34px -15px rgb(0 0 0 / 24%)', height: '85vh', mt: 4, borderRadius: 1 }}>
                        <Box sx={{ width: '50%', display: { xs: 'none', md: 'block' } }}>
                            <img
                                style={{ borderRadius: '5px 0px 0px 5px' }}
                                alt="Login Image"
                                src='/login.svg'
                                width='100%'
                                height='100%'
                            />
                        </Box>
                        <Box sx={{ width: { xs: '100%', md: '50%' }, padding: { xs: 2, md: 7 } }}>
                            <Typography variant="h5" sx={{ letterSpacing: 1 }}>MERCHANT</Typography>
                            <TextField
                                sx={{ mb: 3, mt: 3 }}
                                label='Email'
                                placeholder='Enter email'
                                type='email'
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                fullWidth
                                required
                            />
                            <FormControl sx={{ mb: 3 }} variant="outlined" fullWidth>
                                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Password"
                                />
                            </FormControl>
                            <Button type='submit' color='primary' variant="contained" fullWidth>{pending ? "Validating" : "Sign in"}</Button>
                            <FormControlLabel
                                sx={{ mt: 2, color: 'gray' }}
                                control={
                                    <Checkbox
                                        name="checkedB"
                                        color="primary"
                                        required
                                        checked={true}
                                    />
                                }
                                label="Remember Me"
                            />
                            <p
                                onClick={() => Router.replace('/admin/login')}
                                style={{
                                    textAlign: 'right',
                                    color: '#5048E5',
                                    cursor: 'pointer',
                                    marginTop: 20,
                                    fontWeight: 'bold'
                                }}>
                                Sign In as Admin ?
                            </p>
                        </Box>
                    </Box>
                </Container>
            </form>
        </Fragment>
    )
}

export default Login


export async function getServerSideProps(context) {

    const { req, res } = context;

    const accessToken = req.cookies.accessToken;

    if (accessToken) {
        return {
            redirect: {
                destination: '/merchant/dashboard',
                statusCode: 302
            }
        };
    }
    return {
        props: {}
    }
}