// src/components/common/PageLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';

const PageLayout = () => {
  return (
    // Yeh woh classes hain jo aapko apne standard pages par chahiye
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Outlet />
    </div>
  );
};

export default PageLayout;