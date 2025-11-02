import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Download,
  Search,
  User,
  Calendar,
  File,
  BookOpen
} from 'lucide-react';
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner.jsx";

import toast from 'react-hot-toast';

const StudyMaterials = () => {
  const { user, isAdmin, isFaculty } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMaterials, setFilteredMaterials] = useState([]);

  useEffect(() => {
    fetchMaterials();
  }, []);

  useEffect(() => {
    const filtered = materials.filter(material =>
      material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (material.subject && material.subject.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredMaterials(filtered);
  }, [materials, searchTerm]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMaterials();
      setMaterials(response.data.results || []);
    } catch (error) {
      console.error('Error fetching materials:', error);
      toast.error('Failed to load study materials');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (materialId) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        await apiService.deleteMaterial(materialId);
        setMaterials(materials.filter(material => material.id !== materialId));
        toast.success('Material deleted successfully');
      } catch (error) {
        console.error('Error deleting material:', error);
        toast.error('Failed to delete material');
      }
    }
  };

  const handleDownload = (material) => {
    // Create a temporary link to download the file
    const link = document.createElement('a');
    link.href = material.file;
    link.download = material.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getMaterialTypeColor = (type) => {
    switch (type) {
      case 'lecture_notes':
        return 'text-blue-600 bg-blue-100';
      case 'assignment':
        return 'text-green-600 bg-green-100';
      case 'reference':
        return 'text-purple-600 bg-purple-100';
      case 'syllabus':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const canEdit = (material) => {
    return isAdmin || (isFaculty && material.uploaded_by === user.id);
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" className="py-20" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="page-title">Study Materials</h1>
          <p className="text-gray-600">Access and manage educational resources ✨</p>
        </div>
        {(isAdmin || isFaculty) && (
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition mt-4 sm:mt-0"
          >
            <Plus className="w-5 h-5" />
            Upload Material
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10 w-full max-w-md"
          />
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.length > 0 ? (
          filteredMaterials.map((material) => (
            <div key={material.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <FileText className="w-8 h-8 text-primary-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{material.title}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMaterialTypeColor(material.material_type)}`}>
                      {material.material_type.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
                {canEdit(material) && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => { setEditingMaterial(material); setShowModal(true); }}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(material.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-3">{material.description}</p>
              
              <div className="space-y-2 mb-4">
                {material.subject && (
                  <div className="flex items-center text-sm text-gray-500">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {material.subject}
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-500">
                  <User className="w-4 h-4 mr-2" />
                  {material.uploaded_by_name || material.uploaded_by_username}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(material.created_at)}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <File className="w-4 h-4 mr-2" />
                  {material.file_size} KB
                </div>
              </div>

              <button
                onClick={() => handleDownload(material)}
                className="w-full btn-secondary flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No materials found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'No study materials have been uploaded yet'}
            </p>
          </div>
        )}
      </div>

      {/* Material Modal */}
      {showModal && (
        <MaterialModal
          material={editingMaterial}
          onClose={() => {
            setShowModal(false);
            setEditingMaterial(null);
          }}
          onSave={(materialData) => {
            if (editingMaterial) {
              // Update existing material
              setMaterials(materials.map(m => m.id === editingMaterial.id ? { ...m, ...materialData } : m));
              toast.success('Material updated successfully');
            } else {
              // Add new material
              setMaterials([materialData, ...materials]);
              toast.success('Material uploaded successfully');
            }
            setShowModal(false);
            setEditingMaterial(null);
          }}
        />
      )}
    </div>
  );
};

// Material Modal Component
const MaterialModal = ({ material, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: material?.title || '',
    description: material?.description || '',
    material_type: material?.material_type || 'other',
    subject: material?.subject || '',
    file: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('material_type', formData.material_type);
      formDataToSend.append('subject', formData.subject);
      
      if (formData.file) {
        formDataToSend.append('file', formData.file);
      }

      if (material) {
        // Update existing material
        await apiService.updateMaterial(material.id, formDataToSend);
      } else {
        // Create new material
        await apiService.createMaterial(formDataToSend);
      }
      onSave(formData);
    } catch (error) {
      console.error('Error saving material:', error);
      toast.error('Failed to save material');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {material ? 'Edit Material' : 'Upload New Material'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Material Type</label>
              <select
                value={formData.material_type}
                onChange={(e) => setFormData({ ...formData, material_type: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
                required
              >
                <option value="lecture_notes">Lecture Notes</option>
                <option value="assignment">Assignment</option>
                <option value="reference">Reference Material</option>
                <option value="syllabus">Syllabus</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="e.g., Mathematics, Physics"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
                accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
                required={!material}
              />
              {material && (
                <p className="text-sm text-gray-500 mt-1">Current file: {material.title}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : (material ? 'Update' : 'Upload')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudyMaterials;
