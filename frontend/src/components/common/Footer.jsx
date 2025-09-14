import React, { useState } from 'react';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    if (!email) return;
    // Add your subscription logic here
    alert(`Subscribed with ${email}`);
    setEmail('');
  };

  return (
    <footer className="border-t bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/10 py-10 text-muted-foreground">
      <div className="container flex flex-col gap-10 md:flex-row md:justify-between md:items-start">
        {/* Logo and Description */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <img src="/logo1.png" alt="Logo" className="h-8 w-8" />
          <p className="text-center md:text-left text-sm leading-relaxed">
            Built for Hackathon. © {new Date().getFullYear()} ShikshaMudra Connect. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-2">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
              <Button
                key={idx}
                variant="ghost"
                size="icon"
                className="hover:bg-gradient-to-br hover:from-primary/30 hover:to-secondary/30 hover:scale-110 transition-transform duration-300"
              >
                <Icon className="h-5 w-5" />
              </Button>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-4 items-center md:items-start">
          <h3 className="font-semibold text-base mb-2">Quick Links</h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <a
                href="/about"
                className="hover:text-primary hover:translate-x-1 transition-all duration-300"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="hover:text-primary hover:translate-x-1 transition-all duration-300"
              >
                Contact
              </a>
            </li>
            <li>
              <a
                href="/terms"
                className="hover:text-primary hover:translate-x-1 transition-all duration-300"
              >
                Terms & Conditions
              </a>
            </li>
            <li>
              <a
                href="/privacy"
                className="hover:text-primary hover:translate-x-1 transition-all duration-300"
              >
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col gap-3 items-center md:items-start">
          <h3 className="font-semibold text-base">Subscribe to Newsletter</h3>
          <div className="flex w-full max-w-sm gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-muted-foreground/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-300"
            />
            <Button
              onClick={handleSubscribe}
              className="bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-transform duration-300"
            >
              Subscribe
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-10 border-t border-muted-foreground/20 pt-4 text-center text-xs text-muted-foreground">
        Made with ❤️ by ShikshaMudra Connect Team
      </div>
    </footer>
  );
};

export default Footer;
