import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import axios from 'axios';

interface FAQ {
  _id?: string;
  question: string;
  answer: string;
}

const FAQManager: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [newFaq, setNewFaq] = useState<FAQ>({ question: '', answer: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/faqs');
      setFaqs(response.data);
    } catch (error) {
      console.error('Failed to fetch FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newFaq.question.trim() || !newFaq.answer.trim()) return;
    
    try {
      const response = await axios.post('http://localhost:5000/api/faqs', newFaq);
      setFaqs([...faqs, response.data]);
      setNewFaq({ question: '', answer: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to add FAQ:', error);
    }
  };

  const handleEdit = async (id: string, updatedFaq: FAQ) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/faqs/${id}`, updatedFaq);
      setFaqs(faqs.map(faq => faq._id === id ? response.data : faq));
      setIsEditing(null);
    } catch (error) {
      console.error('Failed to update FAQ:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/faqs/${id}`);
      setFaqs(faqs.filter(faq => faq._id !== id));
    } catch (error) {
      console.error('Failed to delete FAQ:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">FAQ Management</h1>
          <p className="text-gray-600 mt-2">Manage your chatbot's knowledge base</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          <Plus size={20} />
          <span>Add FAQ</span>
        </button>
      </div>

      {/* Add FAQ Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Add New FAQ</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question
              </label>
              <input
                type="text"
                value={newFaq.question}
                onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter the question"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Answer
              </label>
              <textarea
                value={newFaq.answer}
                onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter the answer"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleAdd}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
              >
                <Save size={16} />
                <span>Save FAQ</span>
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ List */}
      <div className="space-y-4">
        {faqs.map((faq) => (
          <FAQCard
            key={faq._id}
            faq={faq}
            isEditing={isEditing === faq._id}
            onEdit={() => setIsEditing(faq._id || null)}
            onSave={(updatedFaq) => handleEdit(faq._id!, updatedFaq)}
            onCancel={() => setIsEditing(null)}
            onDelete={() => handleDelete(faq._id!)}
          />
        ))}
      </div>

      {faqs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No FAQs found. Add your first FAQ to get started!</p>
        </div>
      )}
    </div>
  );
};

interface FAQCardProps {
  faq: FAQ;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (faq: FAQ) => void;
  onCancel: () => void;
  onDelete: () => void;
}

const FAQCard: React.FC<FAQCardProps> = ({
  faq,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}) => {
  const [editedFaq, setEditedFaq] = useState<FAQ>(faq);

  const handleSave = () => {
    onSave(editedFaq);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question
            </label>
            <input
              type="text"
              value={editedFaq.question}
              onChange={(e) => setEditedFaq({ ...editedFaq, question: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Answer
            </label>
            <textarea
              value={editedFaq.answer}
              onChange={(e) => setEditedFaq({ ...editedFaq, answer: e.target.value })}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
            >
              <Save size={16} />
              <span>Save</span>
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-800">{faq.question}</h3>
            <div className="flex space-x-2">
              <button
                onClick={onEdit}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={onDelete}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition duration-200"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          <p className="text-gray-600">{faq.answer}</p>
        </div>
      )}
    </div>
  );
};

export default FAQManager;