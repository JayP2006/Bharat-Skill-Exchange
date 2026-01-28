import React, { useState, useEffect } from 'react';
import { Search, Calendar, Video } from 'lucide-react';
import Layout from '../components/layout/Layout';
import SessionCard from '../components/sessions/SessionCard'; 
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import EmptyState from '../components/ui/EmptyState';
import { sessionService } from '../services/sessionService';
import api from '../config/api'; // API call ke liye
import { useToast } from "@/components/ui/use-toast"; // Shadcn toast for feedback

const WorkshopsPage = () => {
  const [items, setItems] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); 
  const { toast } = useToast();
console.log("items", items);
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await sessionService.getSessions(filter);
      setItems(response.sessions || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.response?.data?.message || 'Failed to fetch sessions');
      setItems([]); 
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Manual Completion Handler
  const handleCompleteSession = async (sessionId) => {
    try {
      // Backend controller 'completeSession' ko call karein
      const response = await api.put(`/sessions/${sessionId}/complete`);
      
      if (response.data.success) {
        toast({
          title: "Session Completed! 🎉",
          description: "Credits have been added to your wallet.",
        });
        fetchData(); // List ko refresh karein
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Could not complete session",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  return (
    <Layout>
      <div className="section-padding">
        <div className="container-app">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              <span className="gradient-text">
                {filter === 'upcoming' ? 'Upcoming Sessions' : 'All Sessions'}
              </span>
            </h1>
            <p className="text-muted-foreground mt-2">
              {filter === 'upcoming' 
                ? 'Your scheduled 1-on-1 learning sessions' 
                : 'View all your session requests and history'}
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex items-center gap-2">
              {['all', 'upcoming', 'online'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    filter === f
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {f === 'upcoming' ? 'Upcoming' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading sessions..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchData} />
          ) : items.length === 0 ? (
            <EmptyState
              icon={Video}
              title="No sessions found"
              description="Database mein koi session record nahi mila."
            />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <SessionCard 
                  key={item._id} 
                  session={item} 
                  onComplete={handleCompleteSession} // 🔥 Prop pass karein
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default WorkshopsPage;