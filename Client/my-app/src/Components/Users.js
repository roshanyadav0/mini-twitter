import React from 'react'
import NavBar from './NavBar'
import UserList from './UserList'
import Footer from './Footer'

function Users() {
return (
    <div>
        <NavBar/>
        <div className='main-div-content'>
            <UserList/>
        </div>
        <Footer/>
    </div>
)
}

export default Users
