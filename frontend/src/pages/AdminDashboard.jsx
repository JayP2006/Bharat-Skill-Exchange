import React from 'react';
import { motion } from 'framer-motion';
import AdminPanel from '@/components/Dashboard/AdminPanel';

const AdminDashboard = () => {
    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
        >
            <AdminPanel />
        </motion.div>
    );
};

export default AdminDashboard;