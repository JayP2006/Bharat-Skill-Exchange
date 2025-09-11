import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t mt-auto">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <img src="/logo.svg" alt="Logo" className="h-6 w-6" />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built for Hackathon. © {new Date().getFullYear()} BharatSkill Connect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;