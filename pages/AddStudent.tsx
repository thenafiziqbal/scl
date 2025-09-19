import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Student, Class, Section } from '../types';

const AddStudent: React.FC = () => {
    const { classes, sections, addStudent } = useApp();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<Omit<Student, 'id'>>({
        name: '',
        roll: 0,
        className: Object.values(classes)[0]?.name || '',
        section: Object.values(sections)[0]?.name || '',
        guardianName: '',
        contact: '',
        guardianEmail: '',
        profilePicUrl: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'roll' ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || formData.roll <= 0 || !formData.className || !formData.section || !formData.guardianName) {
            alert('অনুগ্রহ করে সকল আবশ্যকীয় তথ্য পূরণ করুন।');
            return;
        }
        addStudent(formData);
        alert('নতুন ছাত্র সফলভাবে যোগ করা হয়েছে!');
        navigate('/student-list');
    };

    const fieldClasses = "w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:ring-secondary focus:border-secondary";
    const optionClasses = "bg-white text-gray-800";
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-primary mb-6 border-b pb-3">নতুন ছাত্র যোগ করুন</h2>
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
                            {/* FIX: Add explicit type for `c` to resolve property access errors. */}
                            {Object.values(classes).map((c: Class) => <option key={c.id} value={c.name} className={optionClasses}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="font-medium text-gray-700">বিভাগ</label>
                        <select name="section" value={formData.section} onChange={handleChange} required className={fieldClasses}>
                            {/* FIX: Add explicit type for `s` to resolve property access errors. */}
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
                <div className="mt-6 flex justify-end">
                    <button type="submit" className="bg-secondary text-white font-bold py-2 px-8 rounded-lg hover:bg-accent transition">
                        <i className="fas fa-plus mr-2"></i> যোগ করুন
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddStudent;
