import React from 'react';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center text-center h-[60vh]"
        >
            <h1 className="text-8xl font-extrabold text-primary tracking-tighter">404</h1>
            <p className="text-2xl font-semibold mt-4">Page Not Found</p>
            <p className="text-muted-foreground mt-2 max-w-sm">
                Oops! The page you are looking for does not exist. It might have been moved or deleted.
            </p>
            <Button className="mt-8" onClick={() => navigate('/')}>Go Back to Home</Button>
        </motion.div>
    );
};

export default NotFound;