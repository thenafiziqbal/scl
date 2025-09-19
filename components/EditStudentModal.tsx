import React, { useState, useEffect } from 'react';
import { Student, Class, Section } from '../types';

interface EditStudentModalProps {
    student: Student;
    classes: { [id: string]: Class };
    sections: { [id: string]: Section };
    onClose: () => void;
    onSave: (student: Student) => void;
}

const EditStudentModal: React.FC<EditStudentModalProps> = ({ student, classes, sections, onClose, onSave }) => {
    const [formData, setFormData] = useState<Student>(student);

    useEffect(() => {
        setFormData(student);
    }, [student]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'roll' ? parseInt(value) || 0 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    // Light theme for form fields for better readability and consistency
    const fieldClasses = "w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:ring-secondary focus:border-secondary";
    // Options for select dropdown
    const optionClasses = "bg-white text-gray-800";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 font-sans">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 transform transition-all animate-scaleIn">
                <div className="flex justify-between items-center border-b pb-3 mb-5">
                    <h2 className="text-xl font-bold text-primary">ছাত্রের তথ্য এডিট করুন</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-danger text-2xl">&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div className="space-y-1">
                            <label className="font-medium text-gray-700">ছাত্রের নাম</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className={fieldClasses}/>
                        </div>
                        <div className="space-y-1">
                            <label className="font-medium text-gray-700">রোল</label>
                            <input type="number" name="roll" value={formData.roll} onChange={handleChange} required className={fieldClasses}/>
                        </div>
                        <div className="space-y-1">
                            <label className="font-medium text-gray-700">ক্লাস</label>
                            <select name="className" value={formData.className} onChange={handleChange} required className={fieldClasses}>
                                {/* FIX: Add explicit type for `c` to resolve potential property access errors. */}
                                {Object.values(classes).map((c: Class) => <option key={c.id} value={c.name} className={optionClasses}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="font-medium text-gray-700">বিভাগ</label>
                            <select name="section" value={formData.section} onChange={handleChange} required className={fieldClasses}>
                                {/* FIX: Add explicit type for `s` to resolve potential property access errors. */}
                                {Object.values(sections).map((s: Section) => <option key={s.id} value={s.name} className={optionClasses}>{s.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="font-medium text-gray-700">অভিভাবকের নাম</label>
                            <input type="text" name="guardianName" value={formData.guardianName} onChange={handleChange} required className={fieldClasses}/>
                        </div>
                        <div className="space-y-1">
                            <label className="font-medium text-gray-700">যোগাযোগ</label>
                            <input type="text" name="contact" value={formData.contact} onChange={handleChange} required className={fieldClasses}/>
                        </div>
                         <div className="space-y-1 md:col-span-2">
                            <label className="font-medium text-gray-700">অভিভাবকের ইমেইল</label>
                            <input type="email" name="guardianEmail" value={formData.guardianEmail || ''} onChange={handleChange} className={fieldClasses}/>
                        </div>
                        <div className="space-y-1 md:col-span-2">
                            <label className="font-medium text-gray-700">প্রোফাইল ছবির URL</label>
                            <input type="url" name="profilePicUrl" value={formData.profilePicUrl || ''} onChange={handleChange} className={fieldClasses}/>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-5 rounded-lg hover:bg-gray-300 transition">বাতিল</button>
                        <button type="submit" className="bg-secondary text-white font-bold py-2 px-5 rounded-lg hover:bg-accent transition">সেভ করুন</button>
                    </div>
                </form>
            </div>
            <style>{`
                @keyframes scaleIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scaleIn { animation: scaleIn 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default EditStudentModal;