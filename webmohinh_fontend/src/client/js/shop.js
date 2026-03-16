import Navbar from './navbar'
import Banner from './banner'
import Home from './home'
import Footer from './footer'

import React, { useEffect, useState } from 'react';

function Shop() {
    useEffect(() => {
        import('../css/home.css');

    }, []);
    return (
        <div className='app-container'>
            <Navbar />
            <br></br>
            <Banner />
            <Home />
            <Footer />
        </div>
    )
}
export default Shop;