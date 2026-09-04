import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { DemoBar } from '../components/DemoBar';
import { CartDrawer } from '../components/CartDrawer';

export const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAF8] text-[#102A24] selection:bg-emerald-200 selection:text-emerald-900">
      <DemoBar />
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};
