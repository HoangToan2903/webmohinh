import Navbar from './navbar'
import Banner from './banner'
import Home from './home'
import React, { useEffect, useState } from 'react';

function Shop() {
 useEffect(() => {
        import('../css/home.css');

    }, []);
    return (
        <div>
            <Navbar />
            <Banner />
            <Home />

        </div>
    )
}
export default Shop;