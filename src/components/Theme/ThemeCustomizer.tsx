import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { ChromePicker } from 'react-color';
import { useTheme } from '../../contexts/ThemeContext';
import { Save, Eye, Palette } from 'lucide-react';
import ChatbotPreview from './ChatbotPreview';

const validationSchema = Yup.object({
  companyName: Yup.string().required('Company name is required'),
  welcomeMessage: Yup.string().required('Welcome message is required'),
});

const ThemeCustomizer: React.FC = () => {
  const { theme, updateTheme, saveTheme } = useTheme();
  const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const colorFields = [
    { key: 'primaryColor', label: 'Primary Color', description: 'Main brand color' },
    { key: 'secondaryColor', label: 'Secondary Color', description: 'Background accent color' },
    { key: 'backgroundColor', label: 'Background Color', description: 'Chat background' },
    { key: 'textColor', label: 'Text Color', description: 'Main text color' },
    { key: 'botMessageColor', label: 'Bot Message Color', description: 'Bot message background' },
    { key: 'userMessageColor', label: 'User Message Color', description: 'User message background' },
    { key: 'headerColor', label: 'Header Color', description: 'Header background' },
    { key: 'buttonColor', label: 'Button Color', description: 'Action buttons' },
  ];

  const handleSave = async (values: any) => {
    setSaving(true);
    updateTheme(values);
    const success = await saveTheme();
    if (success) {
      alert('Theme saved successfully!');
    } else {
      alert('Failed to save theme. Please try again.');
    }
    setSaving(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Theme Customizer</h1>
        <p className="text-gray-600 mt-2">Customize your chatbot's appearance and branding</p>
      </div>

      <div className="grid lg:grid-cols-1 gap-8">
        {/* Theme Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Palette className="text-purple-600" size={24} />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Customize Theme</h2>
          </div>

          <Formik
            initialValues={theme}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={handleSave}
          >
            {({ values, setFieldValue, errors, touched }) => (
              <Form className="space-y-6">
                {/* Company Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800">Company Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <Field
                      name="companyName"
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue('companyName', e.target.value);
                        updateTheme({ companyName: e.target.value });
                      }}
                    />
                    {errors.companyName && touched.companyName && (
                      <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Welcome Message
                    </label>
                    <Field
                      name="welcomeMessage"
                      as="textarea"
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        setFieldValue('welcomeMessage', e.target.value);
                        updateTheme({ welcomeMessage: e.target.value });
                      }}
                    />
                    {errors.welcomeMessage && touched.welcomeMessage && (
                      <p className="text-red-500 text-sm mt-1">{errors.welcomeMessage}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Logo URL (Optional)
                    </label>
                    <Field
                      name="companyLogo"
                      type="url"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue('companyLogo', e.target.value);
                        updateTheme({ companyLogo: e.target.value });
                      }}
                    />
                  </div>
                </div>

                {/* Color Customization */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800">Color Scheme</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {colorFields.map((field) => (
                      <div key={field.key} className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.label}
                        </label>
                        <p className="text-xs text-gray-500 mb-2">{field.description}</p>
                        <div
                          className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer flex items-center justify-center"
                          style={{ backgroundColor: values[field.key as keyof typeof values] as string }}
                          onClick={() => setActiveColorPicker(activeColorPicker === field.key ? null : field.key)}
                        >
                          <span className="text-white text-sm font-medium mix-blend-difference">
                            {values[field.key as keyof typeof values] as string}
                          </span>
                        </div>
                        
                        {activeColorPicker === field.key && (
                          <div className="absolute z-10 mt-2">
                            <div 
                              className="fixed inset-0"
                              onClick={() => setActiveColorPicker(null)}
                            />
                            <ChromePicker
                              color={values[field.key as keyof typeof values] as string}
                              onChange={(color) => {
                                setFieldValue(field.key, color.hex);
                                updateTheme({ [field.key]: color.hex });
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition duration-200 disabled:opacity-50"
                >
                  <Save size={20} />
                  <span>{saving ? 'Saving...' : 'Save Theme'}</span>
                </button>
              </Form>
            )}
          </Formik>
        </div>

        {/* Live Preview */}
          <ChatbotPreview theme={theme} />
      </div>
    </div>
  );
};

export default ThemeCustomizer;