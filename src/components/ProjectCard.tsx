import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Linkedin, Heart, MessageCircle, Calendar } from 'lucide-react';
import { Project } from '../types';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface ProjectCardProps {
  project: Project;
  onUpdate?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onUpdate }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(project.likes_count);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const handleLike = async () => {
    try {
      if (liked) {
        await supabase
          .from('likes')
          .delete()
          .eq('project_id', project.id)
          .eq('user_ip', 'demo_user');
        
        setLiked(false);
        setLikesCount(prev => prev - 1);
      } else {
        await supabase
          .from('likes')
          .insert([{ project_id: project.id, user_ip: 'demo_user' }]);
        
        setLiked(true);
        setLikesCount(prev => prev + 1);
      }
      
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error handling like:', error);
      toast.error('Failed to update like');
    }
  };

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('project_id', project.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !userName.trim()) return;

    try {
      const { error } = await supabase
        .from('comments')
        .insert([{
          project_id: project.id,
          user_name: userName,
          comment_text: newComment
        }]);

      if (error) throw error;

      setNewComment('');
      toast.success('Comment added!');
      loadComments();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
    if (!showComments) {
      loadComments();
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        whileHover={{ y: -5 }}
        className="bg-gray-900/50 dark:bg-gray-900/50 light:bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-500/20 dark:border-purple-500/20 light:border-purple-200 hover:border-purple-500/50 dark:hover:border-purple-500/50 light:hover:border-purple-400 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 dark:hover:shadow-purple-500/20 light:hover:shadow-purple-500/10 cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        <div className="relative overflow-hidden">
          <motion.img
            src={project.main_project_image}
            alt={project.project_title}
            className="w-full h-48 object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute top-4 right-4 flex space-x-2">
            {project.github_link && (
              <motion.a
                href={project.github_link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-black/50 rounded-full hover:bg-purple-600 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Github size={16} />
              </motion.a>
            )}
            {project.live_project_link && (
              <motion.a
                href={project.live_project_link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-black/50 rounded-full hover:bg-purple-600 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={16} />
              </motion.a>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            {project.linkedin_profile_picture && (
              <img
                src={project.linkedin_profile_picture}
                alt={project.student_name}
                className="w-10 h-10 rounded-full border-2 border-purple-500/30"
              />
            )}
            <div>
              <h4 className="font-semibold text-white dark:text-white light:text-gray-900">{project.student_name}</h4>
              <div className="flex items-center text-gray-400 dark:text-gray-400 light:text-gray-600 text-sm">
                <Calendar size={12} className="mr-1" />
                {format(new Date(project.created_at), 'MMM dd, yyyy')}
              </div>
            </div>
            {project.linkedin_link && (
              <motion.a
                href={project.linkedin_link}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-blue-400 hover:text-blue-300 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Linkedin size={20} />
              </motion.a>
            )}
          </div>

          <h3 className="text-xl font-bold mb-2 text-white dark:text-white light:text-gray-900 hover:text-purple-400 dark:hover:text-purple-400 light:hover:text-purple-600 transition-colors duration-300">
            {project.project_title}
          </h3>

          <div className="flex flex-wrap gap-2 mb-4">
            {project.tools_technologies.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-600/20 dark:bg-purple-600/20 light:bg-purple-100 text-purple-300 dark:text-purple-300 light:text-purple-700 rounded-full text-xs border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-purple-500/20 dark:border-purple-500/20 light:border-purple-200">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
                className={`flex items-center space-x-1 transition-colors duration-300 ${
                  liked ? 'text-red-400' : 'text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-red-400'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
                <span className="text-sm">{likesCount}</span>
              </motion.button>
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleComments();
                }}
                className="flex items-center space-x-1 text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-purple-400 dark:hover:text-purple-400 light:hover:text-purple-600 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle size={16} />
                <span className="text-sm">{project.comments_count}</span>
              </motion.button>
            </div>
          </div>

          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-purple-500/20 dark:border-purple-500/20 light:border-purple-200"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleComment} className="mb-4">
                <input
                  type="text"
                  placeholder="Your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-2 mb-2 bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-50 border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200 rounded-lg focus:border-purple-500 dark:focus:border-purple-500 light:focus:border-purple-600 transition-all duration-300 text-white dark:text-white light:text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-gray-500 text-sm"
                />
                <textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-50 border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200 rounded-lg focus:border-purple-500 dark:focus:border-purple-500 light:focus:border-purple-600 transition-all duration-300 text-white dark:text-white light:text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-gray-500 text-sm resize-none"
                  rows={2}
                />
                <motion.button
                  type="submit"
                  className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Comment
                </motion.button>
              </form>

              <div className="space-y-3 max-h-40 overflow-y-auto">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-800/30 dark:bg-gray-800/30 light:bg-gray-100/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-purple-400 dark:text-purple-400 light:text-purple-600 text-sm">{comment.user_name}</span>
                      <span className="text-gray-500 dark:text-gray-500 light:text-gray-400 text-xs">
                        {format(new Date(comment.created_at), 'MMM dd, HH:mm')}
                      </span>
                    </div>
                    <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 text-sm">{comment.comment_text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Project Details Modal */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowDetails(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 dark:bg-gray-900 light:bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/20 dark:border-purple-500/20 light:border-purple-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white dark:text-white light:text-gray-900">{project.project_title}</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-900 transition-colors duration-300"
              >
                ✕
              </button>
            </div>
            
            <img
              src={project.main_project_image}
              alt={project.project_title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-purple-400 dark:text-purple-400 light:text-purple-600 mb-2">Student</h3>
                <p className="text-white dark:text-white light:text-gray-900">{project.student_name}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-purple-400 dark:text-purple-400 light:text-purple-600 mb-2">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tools_technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-600/20 dark:bg-purple-600/20 light:bg-purple-100 text-purple-300 dark:text-purple-300 light:text-purple-700 rounded-full text-sm border border-purple-500/30 dark:border-purple-500/30 light:border-purple-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-4 pt-4">
                {project.github_link && (
                  <motion.a
                    href={project.github_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Github size={16} />
                    <span>GitHub</span>
                  </motion.a>
                )}
                {project.live_project_link && (
                  <motion.a
                    href={project.live_project_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 border border-purple-500 text-purple-400 dark:text-purple-400 light:text-purple-600 hover:bg-purple-500 hover:text-white rounded-lg transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ExternalLink size={16} />
                    <span>Live Demo</span>
                  </motion.a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default ProjectCard;