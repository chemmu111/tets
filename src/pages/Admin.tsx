import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { supabase } from '../lib/supabase';
import { Project } from '../types';
import toast from 'react-hot-toast';

interface ProjectForm {
  student_name: string;
  project_title: string;
  tools_technologies: string;
  category: string;
  linkedin_link?: string;
  github_link?: string;
  live_project_link?: string;
  linkedin_profile_picture?: string;
  main_project_image: string;
  project_video?: string;
}

const Admin: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProjectForm>();

  const categories = ['Web Application', 'Automation'];

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ProjectForm) => {
    try {
      const projectData = {
        ...data,
        tools_technologies: data.tools_technologies.split(',').map(tech => tech.trim()),
        likes_count: editingProject?.likes_count || 0,
        comments_count: editingProject?.comments_count || 0,
      };

      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingProject.id);

        if (error) throw error;
        toast.success('Project updated successfully!');
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([projectData]);

        if (error) throw error;
        toast.success('Project created successfully!');
      }

      setShowForm(false);
      setEditingProject(null);
      reset();
      loadProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setValue('student_name', project.student_name);
    setValue('project_title', project.project_title);
    setValue('tools_technologies', project.tools_technologies.join(', '));
    setValue('category', project.category || '');
    setValue('linkedin_link', project.linkedin_link || '');
    setValue('github_link', project.github_link || '');
    setValue('live_project_link', project.live_project_link || '');
    setValue('linkedin_profile_picture', project.linkedin_profile_picture || '');
    setValue('main_project_image', project.main_project_image);
    setValue('project_video', project.project_video || '');
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Project deleted successfully!');
      loadProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProject(null);
    reset();
  };

  return (
    <div className="min-h-screen bg-black dark:bg-black light:bg-white text-white dark:text-white light:text-gray-900 pt-24 pb-12 transition-colors duration-300">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-600 dark:from-purple-400 dark:to-purple-600 light:from-purple-600 light:to-purple-800 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-xl text-gray-400 dark:text-gray-400 light:text-gray-600">
              Manage student projects and portfolio content
            </p>
          </div>
          <motion.button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={20} />
            <span>Add Project</span>
          </motion.button>
        </motion.div>

        {/* Project Form Modal */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-900 dark:bg-gray-900 light:bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/20 dark:border-purple-500/20 light:border-purple-200"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white dark:text-white light:text-gray-900">
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </h2>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-900 transition-colors duration-300"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 dark:text-gray-400 light:text-gray-600 mb-2">
                      Student Name *
                    </label>
                    <input
                      {...register('student_name', { required: 'Student name is required' })}
                      className="w-full px-4 py-3 bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-50 border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200 rounded-lg focus:border-purple-500 dark:focus:border-purple-500 light:focus:border-purple-600 transition-all duration-300 text-white dark:text-white light:text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-gray-500"
                      placeholder="Enter student name"
                    />
                    {errors.student_name && (
                      <p className="text-red-400 text-sm mt-1">{errors.student_name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 dark:text-gray-400 light:text-gray-600 mb-2">
                      Project Title *
                    </label>
                    <input
                      {...register('project_title', { required: 'Project title is required' })}
                      className="w-full px-4 py-3 bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-50 border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200 rounded-lg focus:border-purple-500 dark:focus:border-purple-500 light:focus:border-purple-600 transition-all duration-300 text-white dark:text-white light:text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-gray-500"
                      placeholder="Enter project title"
                    />
                    {errors.project_title && (
                      <p className="text-red-400 text-sm mt-1">{errors.project_title.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 dark:text-gray-400 light:text-gray-600 mb-2">
                    Category *
                  </label>
                  <select
                    {...register('category', { required: 'Category is required' })}
                    className="w-full px-4 py-3 bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-50 border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200 rounded-lg focus:border-purple-500 dark:focus:border-purple-500 light:focus:border-purple-600 transition-all duration-300 text-white dark:text-white light:text-gray-900 appearance-none cursor-pointer"
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-400 text-sm mt-1">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 dark:text-gray-400 light:text-gray-600 mb-2">
                    Tools/Technologies * (comma-separated)
                  </label>
                  <input
                    {...register('tools_technologies', { required: 'Technologies are required' })}
                    className="w-full px-4 py-3 bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-50 border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200 rounded-lg focus:border-purple-500 dark:focus:border-purple-500 light:focus:border-purple-600 transition-all duration-300 text-white dark:text-white light:text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-gray-500"
                    placeholder="React, Node.js, MongoDB, etc."
                  />
                  {errors.tools_technologies && (
                    <p className="text-red-400 text-sm mt-1">{errors.tools_technologies.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 dark:text-gray-400 light:text-gray-600 mb-2">
                      LinkedIn Link
                    </label>
                    <input
                      {...register('linkedin_link')}
                      className="w-full px-4 py-3 bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-50 border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200 rounded-lg focus:border-purple-500 dark:focus:border-purple-500 light:focus:border-purple-600 transition-all duration-300 text-white dark:text-white light:text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-gray-500"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 dark:text-gray-400 light:text-gray-600 mb-2">
                      GitHub Link
                    </label>
                    <input
                      {...register('github_link')}
                      className="w-full px-4 py-3 bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-50 border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200 rounded-lg focus:border-purple-500 dark:focus:border-purple-500 light:focus:border-purple-600 transition-all duration-300 text-white dark:text-white light:text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-gray-500"
                      placeholder="https://github.com/username/repo"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 dark:text-gray-400 light:text-gray-600 mb-2">
                    Live Project Link
                  </label>
                  <input
                    {...register('live_project_link')}
                    className="w-full px-4 py-3 bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-50 border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200 rounded-lg focus:border-purple-500 dark:focus:border-purple-500 light:focus:border-purple-600 transition-all duration-300 text-white dark:text-white light:text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-gray-500"
                    placeholder="https://your-project.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 dark:text-gray-400 light:text-gray-600 mb-2">
                    LinkedIn Profile Picture URL
                  </label>
                  <input
                    {...register('linkedin_profile_picture')}
                    className="w-full px-4 py-3 bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-50 border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200 rounded-lg focus:border-purple-500 dark:focus:border-purple-500 light:focus:border-purple-600 transition-all duration-300 text-white dark:text-white light:text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-gray-500"
                    placeholder="https://example.com/profile.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 dark:text-gray-400 light:text-gray-600 mb-2">
                    Main Project Image URL *
                  </label>
                  <input
                    {...register('main_project_image', { required: 'Project image is required' })}
                    className="w-full px-4 py-3 bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-50 border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200 rounded-lg focus:border-purple-500 dark:focus:border-purple-500 light:focus:border-purple-600 transition-all duration-300 text-white dark:text-white light:text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-gray-500"
                    placeholder="https://example.com/project-image.jpg"
                  />
                  {errors.main_project_image && (
                    <p className="text-red-400 text-sm mt-1">{errors.main_project_image.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 dark:text-gray-400 light:text-gray-600 mb-2">
                    Project Video URL (optional)
                  </label>
                  <input
                    {...register('project_video')}
                    className="w-full px-4 py-3 bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-50 border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200 rounded-lg focus:border-purple-500 dark:focus:border-purple-500 light:focus:border-purple-600 transition-all duration-300 text-white dark:text-white light:text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-gray-500"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>

                <div className="flex space-x-4 pt-6">
                  <motion.button
                    type="submit"
                    className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-300 flex-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Save size={20} />
                    <span>{editingProject ? 'Update Project' : 'Create Project'}</span>
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 border border-gray-600 dark:border-gray-600 light:border-gray-300 text-gray-400 dark:text-gray-400 light:text-gray-600 hover:bg-gray-800 dark:hover:bg-gray-800 light:hover:bg-gray-100 font-semibold rounded-lg transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Projects List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <motion.div
              className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-900/50 dark:bg-gray-900/50 light:bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 dark:border-purple-500/20 light:border-purple-200 hover:border-purple-500/50 dark:hover:border-purple-500/50 light:hover:border-purple-400 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex space-x-4 flex-1">
                    <img
                      src={project.main_project_image}
                      alt={project.project_title}
                      className="w-20 h-20 object-cover rounded-lg border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white dark:text-white light:text-gray-900 mb-2">{project.project_title}</h3>
                      <p className="text-purple-400 dark:text-purple-400 light:text-purple-600 mb-2">by {project.student_name}</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {project.tools_technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-2 py-1 bg-purple-600/20 dark:bg-purple-600/20 light:bg-purple-100 text-purple-300 dark:text-purple-300 light:text-purple-700 rounded text-xs border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">
                        <span>❤️ {project.likes_count}</span>
                        <span>💬 {project.comments_count}</span>
                        <span>📅 {new Date(project.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      onClick={() => handleEdit(project)}
                      className="p-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 rounded-lg transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Edit size={16} />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(project.id)}
                      className="p-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;