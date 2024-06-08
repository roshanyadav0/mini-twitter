import React from 'react'
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

function NavBar() {
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    console.log(token);

    const handleLogout = () => {
        // Clear authentication token from local storage
        localStorage.removeItem('token');
        navigate('/');
        };
return (
    <div>
        <h1>Mini Twitter</h1>
        <Stack spacing={2} direction="row">
            <Button variant="outlined">Text</Button>
            <Button variant="outlined">Contained</Button>
            <Button variant="outlined">Outlined</Button>
        </Stack>
        <button onClick={handleLogout}>LogOut</button>
    </div>
)
}

export default NavBar