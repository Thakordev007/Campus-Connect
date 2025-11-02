import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { 
  Award, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  User,
  BookOpen,
  TrendingUp
} from 'lucide-react';
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner.jsx";
 // ✅ fixed path
import toast from 'react-hot-toast';

const Results = () => {
  const { user, isAdmin, isFaculty, isStudent } = useAuth();
  const [results, setResults] = useState([]);
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingResult, setEditingResult] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = results.filter(result =>
      result.exam_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.student_username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredResults(filtered);
  }, [results, searchTerm]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const resultsResponse = await apiService.getResults();
      setResults(resultsResponse.data.results || []);

      if (isFaculty || isAdmin) {
        const [examsResponse, studentsResponse] = await Promise.all([
          apiService.getExams(),
          apiService.getStudents()
        ]);
        setExams(examsResponse.data.results || []);
        setStudents(studentsResponse.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (resultId) => {
    if (window.confirm('Are you sure you want to delete this result?')) {
      try {
        await apiService.deleteResult(resultId);
        setResults(results.filter(result => result.id !== resultId));
        toast.success('Result deleted successfully');
      } catch (error) {
        console.error('Error deleting result:', error);
        toast.error('Failed to delete result');
      }
    }
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'text-green-600 bg-green-100';
      case 'B+':
      case 'B':
        return 'text-blue-600 bg-blue-100';
      case 'C':
        return 'text-yellow-600 bg-yellow-100';
      case 'F':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const canEdit = (result) => {
    return isAdmin || (isFaculty && result.exam?.faculty === user.id);
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
          <h1 className="page-title">Results</h1>
          <p className="text-gray-600">
            {isStudent ? 'View your exam results ✨' : 'Manage exam results and grades ✨'}
          </p>
        </div>
        {(isAdmin || isFaculty) && (
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition mt-4 sm:mt-0"
          >
            <Plus className="w-5 h-5" />
            Add Result
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search results..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10 w-full max-w-md"
          />
        </div>
      </div>

      {/* Results Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exam
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
                {(isAdmin || isFaculty) && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResults.length > 0 ? (
                filteredResults.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                          <User className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {result.student_name || result.student_username}
                          </div>
                          <div className="text-sm text-gray-500">
                            {result.student_username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">{result.exam_title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {result.marks_obtained} / {result.total_marks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(result.grade)}`}>
                        {result.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {result.percentage}%
                    </td>
                    {(isAdmin || isFaculty) && canEdit(result) && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                          <button
                            onClick={() => { setEditingResult(result); setShowModal(true); }}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(result.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isAdmin || isFaculty ? 6 : 5} className="px-6 py-12 text-center">
                    <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-500">
                      {searchTerm ? 'Try adjusting your search terms' : 'No results have been added yet'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Result Modal */}
      {showModal && (isAdmin || isFaculty) && (
        <ResultModal
          result={editingResult}
          exams={exams}
          students={students}
          onClose={() => {
            setShowModal(false);
            setEditingResult(null);
          }}
          onSave={(resultData) => {
            if (editingResult) {
              setResults(results.map(r => r.id === editingResult.id ? { ...r, ...resultData } : r));
              toast.success('Result updated successfully');
            } else {
              setResults([resultData, ...results]);
              toast.success('Result added successfully');
            }
            setShowModal(false);
            setEditingResult(null);
          }}
        />
      )}
    </div>
  );
};

// Result Modal Component
const ResultModal = ({ result, exams, students, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    exam: result?.exam || '',
    student: result?.student || '',
    marks_obtained: result?.marks_obtained || '',
    total_marks: result?.total_marks || '',
    remarks: result?.remarks || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (result) {
        await apiService.updateResult(result.id, formData);
      } else {
        await apiService.createResult(formData);
      }
      onSave(formData);
    } catch (error) {
      console.error('Error saving result:', error);
      toast.error('Failed to save result');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {result ? 'Edit Result' : 'Add New Result'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam</label>
              <select
                value={formData.exam}
                onChange={(e) => setFormData({ ...formData, exam: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
                required
              >
                <option value="">Select an exam</option>
                {exams.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.title} - {exam.subject}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
              <select
                value={formData.student}
                onChange={(e) => setFormData({ ...formData, student: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
                required
              >
                <option value="">Select a student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.full_name} ({student.username})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marks Obtained</label>
                <input
                  type="number"
                  value={formData.marks_obtained}
                  onChange={(e) => setFormData({ ...formData, marks_obtained: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
                <input
                  type="number"
                  value={formData.total_marks}
                  onChange={(e) => setFormData({ ...formData, total_marks: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Remarks (Optional)</label>
              <textarea
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-md hover:shadow-lg disabled:opacity-50">
                {isSubmitting ? 'Saving...' : (result ? 'Update' : 'Add')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Results;
