
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

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-primary mb-6">নতুন ছাত্র যোগ করুন</h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="font-medium">ছাত্রের নাম</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded-md"/>
                    </div>
                    <div className="space-y-2">
                        <label className="font-medium">রোল</label>
                        <input type="number" name="roll" value={formData.roll} onChange={handleChange} required className="w-full p-2 border rounded-md"/>
                    </div>
                    <div className="space-y-2">
                        <label className="font-medium">ক্লাস</label>
                        <select name="className" value={formData.className} onChange={handleChange} required className="w-full p-2 border rounded-md bg-white">
                            <option value="">নির্বাচন করুন</option>
                            {Object.values(classes).map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="font-medium">বিভাগ</label>
                        <select name="section" value={formData.section} onChange={handleChange} required className="w-full p-2 border rounded-md bg-white">
                            <option value="">নির্বাচন করুন</option>
                            {Object.values(sections).map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="font-medium">অভিভাবকের নাম</label>
                        <input type="text" name="guardianName" value={formData.guardianName} onChange={handleChange} required className="w-full p-2 border rounded-md"/>
                    </div>
                    <div className="space-y-2">
                        <label className="font-medium">যোগাযোগ</label>
                        <input type="text" name="contact" value={formData.contact} onChange={handleChange} required className="w-full p-2 border rounded-md"/>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="font-medium">প্রোফাইল ছবির URL</label>
                        <input type="url" name="profilePicUrl" value={formData.profilePicUrl} onChange={handleChange} placeholder="https://example.com/image.jpg" className="w-full p-2 border rounded-md"/>
                    </div>
                </div>
                <div className="mt-8 text-right">
                    <button type="submit" disabled={loading} className="bg-secondary text-white font-bold py-2 px-6 rounded-lg hover:bg-accent transition disabled:bg-gray-400">
                        {loading ? 'প্রসেসিং...' : 'ছাত্র যোগ করুন'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddStudent;
