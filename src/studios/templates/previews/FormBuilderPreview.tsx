import { motion } from 'framer-motion';
import {
  Type,
  Mail,
  Phone,
  Calendar,
  CheckSquare,
  List,
  ToggleLeft,
  Upload,
  Grip,
  Trash2,
  Plus,
} from 'lucide-react';

const FormBuilderPreview = () => {
  const fieldTypes = [
    { icon: Type, label: 'Text' },
    { icon: Mail, label: 'Email' },
    { icon: Phone, label: 'Phone' },
    { icon: Calendar, label: 'Date' },
    { icon: CheckSquare, label: 'Checkbox' },
    { icon: List, label: 'Select' },
    { icon: ToggleLeft, label: 'Toggle' },
    { icon: Upload, label: 'File' },
  ];

  const formFields = [
    { type: 'text', label: 'Full Name', placeholder: 'Enter your name', required: true },
    { type: 'email', label: 'Email Address', placeholder: 'you@example.com', required: true },
    {
      type: 'select',
      label: 'Department',
      placeholder: 'Select department',
      options: ['Engineering', 'Design', 'Marketing'],
    },
    { type: 'date', label: 'Start Date', placeholder: 'Pick a date', required: false },
  ];

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-indigo-50 flex overflow-hidden">
      {/* Field Types Sidebar */}
      <div className="w-44 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-3 border-b border-slate-200">
          <h3 className="text-xs font-semibold text-slate-800">Field Types</h3>
        </div>
        <div className="flex-1 p-2 overflow-auto">
          <div className="grid grid-cols-2 gap-1.5">
            {fieldTypes.map((field, i) => (
              <motion.div
                key={field.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 cursor-grab transition-all"
              >
                <field.icon className="w-4 h-4 text-slate-600" />
                <span className="text-[9px] text-slate-600">{field.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Canvas */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-11 bg-white border-b border-slate-200 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <List className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-800">Contact Form</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-[10px] px-2 py-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 transition-colors">
              Preview
            </button>
            <button className="text-[10px] px-2 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors">
              Publish
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-md mx-auto bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            {/* Form Header */}
            <div className="mb-4 pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800">Contact Us</h2>
              <p className="text-[10px] text-slate-500">
                Fill out the form below and we'll get back to you.
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-3">
              {formFields.map((field, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="group relative p-3 rounded-lg border border-slate-200 hover:border-indigo-300 bg-white transition-all"
                >
                  <div className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Grip className="w-4 h-4 text-slate-400 cursor-grab" />
                  </div>

                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-medium text-slate-700">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-0.5">*</span>}
                    </label>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-3 h-3 text-slate-400 hover:text-red-500" />
                    </button>
                  </div>

                  {field.type === 'select' ? (
                    <div className="h-7 px-2 rounded border border-slate-200 bg-slate-50 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{field.placeholder}</span>
                      <List className="w-3 h-3" />
                    </div>
                  ) : field.type === 'date' ? (
                    <div className="h-7 px-2 rounded border border-slate-200 bg-slate-50 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{field.placeholder}</span>
                      <Calendar className="w-3 h-3" />
                    </div>
                  ) : (
                    <div className="h-7 px-2 rounded border border-slate-200 bg-slate-50 flex items-center text-[10px] text-slate-400">
                      {field.placeholder}
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Add Field Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="w-full py-2 rounded-lg border-2 border-dashed border-slate-200 text-slate-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3 h-3" />
                <span className="text-[10px]">Add Field</span>
              </motion.button>
            </div>

            {/* Submit Button Preview */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="w-full mt-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-medium rounded-lg"
            >
              Submit Form
            </motion.button>
          </div>
        </div>
      </div>

      {/* Properties Panel */}
      <div className="w-40 bg-white border-l border-slate-200 p-3">
        <h3 className="text-xs font-semibold text-slate-800 mb-3">Properties</h3>
        <div className="space-y-3">
          <div>
            <label className="text-[9px] text-slate-500 uppercase">Label</label>
            <div className="h-6 mt-1 px-2 rounded border border-slate-200 bg-slate-50 flex items-center text-[10px]">
              Full Name
            </div>
          </div>
          <div>
            <label className="text-[9px] text-slate-500 uppercase">Placeholder</label>
            <div className="h-6 mt-1 px-2 rounded border border-slate-200 bg-slate-50 flex items-center text-[10px]">
              Enter your name
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border border-indigo-500 bg-indigo-500 flex items-center justify-center">
              <CheckSquare className="w-3 h-3 text-white" />
            </div>
            <span className="text-[10px] text-slate-600">Required</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBuilderPreview;
