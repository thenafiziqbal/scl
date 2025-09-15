import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const AddStudent: React.FC = () => {
    const { classes, sections, addStudent } = useApp();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        roll: '',
        className: '',
        section: '',
        guardianName: '',
        contact: '',
        profilePicUrl: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const newStudent = {
            ...formData,
            roll: parseInt(formData.roll, 10),
        };
        addStudent(newStudent);
        setTimeout(() => { // Simulate API call
            alert('ছাত্র যোগ করা হয়েছে!');
            setLoading(false);
            navigate('/student-list');
        }, 500);
    };

    const inputWrapperClass = "relative";
    const iconClass = "fas absolute left-3 top-1/2 -translate-y-1/2 text-gray-400";
    const inputClass = "w-full p-3 pl-10 bg-light border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-secondary focus:border-secondary transition-colors";

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-primary mb-6 pb-4 border-b-2 border-light">নতুন ছাত্র যোগ করুন</h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                    {/* ছাত্রের নাম */}
                    <div className="space-y-2">
                        <label htmlFor="name" className="font-semibold text-gray-600">ছাত্রের নাম</label>
                        <div className={inputWrapperClass}>
                            <i className={`${iconClass} fa-user`}></i>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className={inputClass}/>
                        </div>
                    </div>
                    {/* রোল */}
                    <div className="space-y-2">
                        <label htmlFor="roll" className="font-semibold text-gray-600">রোল</label>
                         <div className={inputWrapperClass}>
                            <i className={`${iconClass} fa-hashtag`}></i>
                            <input type="number" id="roll" name="roll" value={formData.roll} onChange={handleChange} required className={inputClass}/>
                        </div>
                    </div>
                    {/* ক্লাস */}
                    <div className="space-y-2">
                        <label htmlFor="className" className="font-semibold text-gray-600">ক্লাস</label>
                        <div className={inputWrapperClass}>
                             <i className={`${iconClass} fa-school`}></i>
                            <select id="className" name="className" value={formData.className} onChange={handleChange} required className={`${inputClass} appearance-none`}>
                                <option value="">নির্বাচন করুন</option>
                                {Object.values(classes).map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                             <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                        </div>
                    </div>
                    {/* বিভাগ */}
                    <div className="space-y-2">
                        <label htmlFor="section" className="font-semibold text-gray-600">বিভাগ</label>
                        <div className={inputWrapperClass}>
                             <i className={`${iconClass} fa-chalkboard`}></i>
                            <select id="section" name="section" value={formData.section} onChange={handleChange} required className={`${inputClass} appearance-none`}>
                                <option value="">নির্বাচন করুন</option>
                                {Object.values(sections).map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                            </select>
                            <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                        </div>
                    </div>
                    {/* অভিভাবকের নাম */}
                    <div className="space-y-2">
                        <label htmlFor="guardianName" className="font-semibold text-gray-600">অভিভাবকের নাম</label>
                        <div className={inputWrapperClass}>
                            <i className={`${iconClass} fa-user-shield`}></i>
                            <input type="text" id="guardianName" name="guardianName" value={formData.guardianName} onChange={handleChange} required className={inputClass}/>
                        </div>
                    </div>
                    {/* যোগাযোগ */}
                    <div className="space-y-2">
                        <label htmlFor="contact" className="font-semibold text-gray-600">যোগাযোগ</label>
                        <div className={inputWrapperClass}>
                            <i className={`${iconClass} fa-phone`}></i>
                            <input type="text" id="contact" name="contact" value={formData.contact} onChange={handleChange} required className={inputClass}/>
                        </div>
                    </div>
                    {/* প্রোফাইল ছবির URL */}
                    <div className="space-y-2 md:col-span-2">
                        <label htmlFor="profilePicUrl" className="font-semibold text-gray-600">প্রোফাইল ছবির URL</label>
                        <div className={inputWrapperClass}>
                             <i className={`${iconClass} fa-image-portrait`}></i>
                            <input type="url" id="profilePicUrl" name="profilePicUrl" value={formData.profilePicUrl} onChange={handleChange} placeholder="https://example.com/image.jpg" className={inputClass}/>
                        </div>
                    </div>
                </div>
                {/* Submit Button */}
                <div className="mt-8 flex justify-end">
                    <button type="submit" disabled={loading} className="bg-secondary text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 w-full md:w-auto">
                        {loading ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i>
                                <span>প্রসেসিং...</span>
                            </>
                        ) : (
                            <>
                                <i className="fas fa-user-plus"></i>
                                <span>ছাত্র যোগ করুন</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddStudent;