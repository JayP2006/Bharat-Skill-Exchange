import React, { useEffect, useState } from 'react';
import useSkillStore from '@/store/skillStore';
import SkillCard from '@/components/Skills/SkillCard';
import { motion } from 'framer-motion';
import { Loader2, Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

const SkillSearch = () => {
    const { skills, loading, fetchSkills } = useSkillStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isLocating, setIsLocating] = useState(false);

    useEffect(() => {
       
        fetchSkills();
    }, [fetchSkills]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchSkills({ search: searchTerm });
    };
    
    const handleNearbySearch = () => {
        if (!navigator.geolocation) {
            return toast.error("Geolocation is not supported by your browser.");
        }
        setIsLocating(true);
        toast.loading("Fetching your location...");
        navigator.geolocation.getCurrentPosition(
            (position) => {
                toast.dismiss();
                toast.success("Found your location! Searching nearby...");
                setIsLocating(false);
                fetchSkills({ 
                    lat: position.coords.latitude, 
                    lng: position.coords.longitude 
                });
            },
            () => {
                toast.dismiss();
                toast.error("Unable to retrieve your location. Please enable location permissions.");
                setIsLocating(false);
            }
        );
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">Explore Skills</h1>
                <p className="text-lg text-muted-foreground">Find your next learning adventure from our talented Gurus.</p>
            </div>
            
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        placeholder="Search for skills like 'Yoga' or 'React'..." 
                        className="pl-10" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button type="submit" className="w-full sm:w-auto">Search</Button>
                <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={handleNearbySearch} disabled={isLocating}>
                    {isLocating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MapPin className="mr-2 h-4 w-4" />}
                    Search Nearby
                </Button>
            </form>

            {loading ? (
                <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : skills.length === 0 ? (
                <div className="text-center py-16"><h3 className="text-xl font-semibold">No Skills Found</h3><p className="text-muted-foreground mt-2">Try a different search term or check back later.</p></div>
            ) : (
                <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" variants={containerVariants} initial="hidden" animate="visible">
                    {skills.map((skill) => (
                        <motion.div key={skill._id} variants={itemVariants}>
                            <SkillCard skill={skill} />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
};

export default SkillSearch;