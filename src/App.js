import React, { useEffect, useState } from 'react'
import {SignUp} from './pages/SignUp'
import Login from './pages/Login'
import {MyProfile} from './pages/MyProfile'
import {Home} from './pages/Home'
import {BookJob} from './pages/BookJob'
import {SearchUsers} from './pages/SearchUsers'
import {Routes, Route} from 'react-router-dom'
import Navbar from "./Navbar";

function App() {
  return (
    <>
    {/*<Navbar/>*/}
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/myprofile" element={<MyProfile/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/bookjob" element={<BookJob/>}/>
        <Route path="/searchusers" element={<SearchUsers/>}/>
      </Routes>
    </>
  )
}

export default App