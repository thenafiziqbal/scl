import React, { useState, useEffect } from 'react';
import { StudentLeave, Student } from '../types';

interface EditLeaveModalProps {
    leave: StudentLeave;
    students: { [id: string]: Student };
    onClose: () => void;
    onSave: (leave: StudentLeave) => void;
}

const EditLeaveModal: React.FC<EditLeaveModalProps> = ({ leave, students, onClose, onSave }) => {
    const [formData, setFormData] = useState<StudentLeave>(leave);

    useEffect(() => {
        setFormData(leave);
    }, [leave]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const fieldClasses = "w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:ring-secondary focus:border-secondary";
    const optionClasses = "bg-white text-gray-800";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 font-sans">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 transform transition-all animate-scaleIn">
                <div className="flex justify-between items-center border-b pb-3 mb-5">
                    <h2 className="text-xl font-bold text-primary">ছুটির আবেদন এডিট করুন</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-danger text-2xl">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="font-medium text-gray-700">ছাত্র</label>
                        <select name="studentId" value={formData.studentId} onChange={handleChange} required className={fieldClasses}>
                            {/* FIX: Add explicit type for `s` to resolve potential property access errors. */}
                            {Object.values(students).map((s: Student) => <option key={s.id} value={s.id} className={optionClasses}>{s.name} ({s.className})</option>)}
                        </select>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="font-medium text-gray-700">শুরুর তারিখ</label>
                            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className={fieldClasses}/>
                        </div>
                         <div>
                            <label className="font-medium text-gray-700">শেষ তারিখ</label>
                            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required className={fieldClasses}/>
                        </div>
                    </div>
                    <div>
                        <label className="font-medium text-gray-700">কারণ</label>
                        <textarea name="reason" value={formData.reason} onChange={handleChange} required rows={3} className={fieldClasses}></textarea>
                    </div>
                    <div>
                        <label className="font-medium text-gray-700">স্ট্যাটাস</label>
                         <select name="status" value={formData.status} onChange={handleChange} required className={fieldClasses}>
                            <option value="pending" className={optionClasses}>বিবেচনাধীন</option>
                            <option value="approved" className={optionClasses}>অনুমোদিত</option>
                            <option value="rejected" className={optionClasses}>প্রত্যাখ্যাত</option>
                        </select>
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

export default EditLeaveModal;