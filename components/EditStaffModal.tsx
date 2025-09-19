import React, { useState, useEffect } from 'react';
import { Teacher, Librarian } from '../types';

// A unified type for the modal's data, combining properties from both staff types
export type StaffData = (Teacher | Librarian) & { role: 'শিক্ষক' | 'লাইব্রেরিয়ান', details: string };

interface EditStaffModalProps {
    staff: StaffData;
    onClose: () => void;
    onSave: (staff: StaffData) => void;
    isAdding?: boolean;
}

const EditStaffModal: React.FC<EditStaffModalProps> = ({ staff, onClose, onSave, isAdding = false }) => {
    const [formData, setFormData] = useState<StaffData>(staff);

    useEffect(() => {
        setFormData(staff);
    }, [staff]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value } as StaffData));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const fieldClasses = "w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:ring-secondary focus:border-secondary";
    const optionClasses = "bg-white text-gray-800";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 font-sans">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 transform transition-all animate-scaleIn">
                <div className="flex justify-between items-center border-b pb-3 mb-5">
                    <h2 className="text-xl font-bold text-primary">{isAdding ? 'নতুন স্টাফ যোগ করুন' : 'স্টাফের তথ্য এডিট করুন'}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-danger text-2xl">&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div className="space-y-1">
                            <label className="font-medium text-gray-700">নাম</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className={fieldClasses}/>
                        </div>
                        <div className="space-y-1">
                            <label className="font-medium text-gray-700">পদ</label>
                            <select name="role" value={formData.role} onChange={handleChange} required className={fieldClasses}>
                                <option value="শিক্ষক" className={optionClasses}>শিক্ষক</option>
                                <option value="লাইব্রেরিয়ান" className={optionClasses}>লাইব্রেরিয়ান</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="font-medium text-gray-700">{formData.role === 'শিক্ষক' ? 'বিষয়' : 'দায়িত্ব'}</label>
                            <input type="text" name="details" value={formData.details} onChange={handleChange} required className={fieldClasses}/>
                        </div>
                        <div className="space-y-1">
                            <label className="font-medium text-gray-700">ইমেইল</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required className={fieldClasses}/>
                        </div>
                         <div className="space-y-1">
                            <label className="font-medium text-gray-700">ফোন</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className={fieldClasses}/>
                        </div>
                        <div className="space-y-1">
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

export default EditStaffModal;