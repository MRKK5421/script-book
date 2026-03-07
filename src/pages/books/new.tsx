import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooks } from '../../contexts/books-context';

const themes = [
  { id: 'classic', name: 'Classic Paper', color: 'bg-amber-50' },
  { id: 'vintage', name: 'Vintage Parchment', color: 'bg-yellow-50' },
  { id: 'dark', name: 'Dark Writer', color: 'bg-gray-800' },
  { id: 'minimalist', name: 'Minimalist', color: 'bg-white' }
];

export default function CreateBookPage() {
  const navigate = useNavigate();
  const { createBook } = useBooks();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    theme: 'classic',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    title: '',
    password: ''
  });
  const [isCreating, setIsCreating] = useState(false);

  const validateForm = () => {
    const newErrors = {
      title: '',
      password: ''
    };

    if (!formData.title.trim()) {
      newErrors.title = 'Book title is required';
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.password = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsCreating(true);
      await createBook(
        formData.title,
        formData.description || undefined,
        formData.theme,
        formData.password || undefined
      );
      navigate(`/books/${Date.now()}`);
    } catch (error) {
      console.error('Failed to create book:', error);
      setIsCreating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="min-h-screen bg-amber-50/120 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 bg-amber-700">
            <h2 className="text-2xl font-bold text-white">Create New Book</h2>
            <p className="mt-1 text-blue-100">Start your next script writing project</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
            {/* Book Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Book Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your book title..."
                required
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                placeholder="Optional: Describe your book..."
              />
            </div>

            {/* Cover Theme Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Cover Theme</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {themes.map((theme) => (
                  <label key={theme.id} className="relative">
                    <input
                      type="radio"
                      name="theme"
                      value={theme.id}
                      checked={formData.theme === theme.id}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`cursor-pointer rounded-lg border-2 p-4 text-center transition-all ${
                      formData.theme === theme.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}>
                      <div className={`w-8 h-8 rounded-md mx-auto mb-2 ${theme.color}`}></div>
                      <p className="text-sm font-medium text-gray-900">{theme.name}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Optional Password Lock */}
            <div className="border-t pt-6">
              <div className="flex items-center mb-4">
                <input
                  id="password-lock"
                  name="password-lock"
                  type="checkbox"
                  checked={!!formData.password}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setFormData(prev => ({
                      ...prev,
                      password: isChecked ? (prev.password || '') : '',
                      confirmPassword: isChecked ? (prev.confirmPassword || '') : ''
                    }));
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="password-lock" className="ml-2 text-sm text-gray-700">
                  Password protect this book
                </label>
              </div>

              {formData.password && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm ${
                        errors.password ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter password..."
                      required={!!formData.password}
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm ${
                        errors.password ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Confirm password..."
                      required={!!formData.password}
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isCreating ? 'Creating...' : 'Create Book Now'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
