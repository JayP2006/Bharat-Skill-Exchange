import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import Layout from '../components/layout/Layout.jsx';
import SkillCard from '../components/skills/SkillItem.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import ErrorMessage from '../components/ui/ErrorMessage.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { skillService } from '../services/skillService.js';

const SkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'All',
    'Technology',
    'Design',
    'Business',
    'Marketing',
    'Music',
    'Language',
    'Fitness',
    'Cooking',
    'Other',
  ];

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedLevel && selectedLevel !== 'All') params.level = selectedLevel;
      
      const response = await skillService.getAllSkills(params);
      setSkills(response.skills || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch skills');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [selectedCategory, selectedLevel]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchSkills();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedLevel('');
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedLevel;

  return (
    <Layout>
      <div className="section-padding">
        <div className="container-app">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Explore <span className="gradient-text">Skills</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Discover skills from talented instructors in our community
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skills..."
                className="w-full input-styled pl-12 pr-4 py-3"
              />
            </form>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 rounded-lg bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-colors md:hidden"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>

            <div className="hidden md:flex items-center gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-styled px-4 py-3 min-w-[150px]"
              >
                <option value="">Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat === 'All' ? '' : cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="input-styled px-4 py-3 min-w-[150px]"
              >
                <option value="">Level</option>
                {levels.map((level) => (
                  <option key={level} value={level === 'All' ? '' : level}>
                    {level}
                  </option>
                ))}
              </select>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="md:hidden mb-6 p-4 bg-card rounded-xl border border-border space-y-4 animate-slide-up">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full input-styled px-4 py-3"
              >
                <option value="">All Categories</option>
                {categories.filter(c => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full input-styled px-4 py-3"
              >
                <option value="">All Levels</option>
                {levels.filter(l => l !== 'All').map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear All Filters
                </button>
              )}
            </div>
          )}

          {/* Content */}
          {loading ? (
            <LoadingSpinner text="Loading skills..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchSkills} />
          ) : skills.length === 0 ? (
            <EmptyState
              title="No skills found"
              description={hasActiveFilters ? 'Try adjusting your filters' : 'Be the first to share a skill!'}
              action={
                hasActiveFilters ? (
                  <button
                    onClick={clearFilters}
                    className="btn-gradient px-6 py-2 rounded-lg font-medium"
                  >
                    Clear Filters
                  </button>
                ) : (
                  <Link
                    to="/dashboard/skills/create"
                    className="btn-gradient px-6 py-2 rounded-lg font-medium"
                  >
                    Share a Skill
                  </Link>
                )
              }
            />
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                {skills.length} skill{skills.length !== 1 ? 's' : ''} found
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills.map((skill) => (
                  <SkillCard key={skill._id} skill={skill} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SkillsPage;
