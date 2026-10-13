import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';
import '../pages/home.css';
import '../styles/global.css';

const MainLayout = () => {


  return (
    <div className="layout">
      <div className= "navbar-hide-on-top">
        <Navbar />
      </div>
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout; 