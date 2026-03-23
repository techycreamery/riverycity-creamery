import React from 'react';
import Header from './Header';
import HomeSalesSections from './HomeSalesSections';
import Footer from './Footer';

function HomePage({ openCart, cartCount = 0 }) {
  return (
    <>
      <Header openCart={openCart} cartCount={cartCount} />
      <HomeSalesSections />
      <Footer />
    </>
  );
}

export default HomePage;
