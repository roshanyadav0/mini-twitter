import React from 'react'
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import '../Css/NavBar.css'

function NavBar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear authentication token from local storage
        localStorage.removeItem('token');
        navigate('/login');
        navigate(0);
        };
return (
    <div className='nav-bar'>
        <h1>Mini Twitter</h1>
        <Button onClick={()=>navigate('/')}>Home</Button>
        <Button onClick={()=>navigate('/post')}>Post</Button>
        <Button onClick={()=>navigate('/users')}>Users</Button>
        <Button onClick={handleLogout}>LogOut</Button>
    </div>
)
}

export default NavBar