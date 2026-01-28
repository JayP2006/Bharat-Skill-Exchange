import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Plus, X } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { skillService } from '../services/skillService';

const CreateSkillPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'Beginner',
    duration: '',
    topics: [],
    requirements: '',
  });
  const [newTopic, setNewTopic] = useState('');

  const categories = [
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

  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addTopic = () => {
    if (newTopic.trim() && !formData.topics.includes(newTopic.trim())) {
      setFormData({ ...formData, topics: [...formData.topics, newTopic.trim()] });
      setNewTopic('');
    }
  };

  const removeTopic = (topic) => {
    setFormData({
      ...formData,
      topics: formData.topics.filter((t) => t !== topic),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await skillService.createSkill(formData);
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create skill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="section-padding">
        <div className="container-app max-w-2xl">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="card-elevated p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
              Create a New Skill
            </h1>
            <p className="text-muted-foreground mb-8">
              Share your expertise with the community
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Skill Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Introduction to Web Development"
                  className="w-full input-styled px-4 py-3"
                  required
                />
              </div>

              {/* Category & Level */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full input-styled px-4 py-3"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Difficulty Level *
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full input-styled px-4 py-3"
                    required
                  >
                    {levels.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Session Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 1 hour, 2 hours"
                  className="w-full input-styled px-4 py-3"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe what learners will gain from this skill..."
                  rows={5}
                  className="w-full input-styled px-4 py-3"
                  required
                />
              </div>

              {/* Topics */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Topics Covered
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTopic())}
                    placeholder="Add a topic"
                    className="flex-1 input-styled px-4 py-2"
                  />
                  <button
                    type="button"
                    onClick={addTopic}
                    className="px-4 py-2 rounded-lg bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {formData.topics.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.topics.map((topic, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                      >
                        {topic}
                        <button
                          type="button"
                          onClick={() => removeTopic(topic)}
                          className="hover:text-destructive transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Prerequisites
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  placeholder="Any prior knowledge or tools required..."
                  rows={3}
                  className="w-full input-styled px-4 py-3"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-gradient py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Skill'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateSkillPage;
