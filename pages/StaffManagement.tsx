
import React from 'react';
import { useApp } from '../context/AppContext';

const StaffManagement: React.FC = () => {
    const { teachers, librarians } = useApp();

    const allStaff = [
        ...Object.values(teachers).map(t => ({ ...t, role: 'শিক্ষক', details: t.subject })),
        ...Object.values(librarians).map(l => ({ ...l, role: 'লাইব্রেরিয়ান', details: 'লাইব্রেরি পরিচালনা' }))
    ];

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-primary mb-4">নতুন স্টাফ যোগ করুন</h2>
                {/* Add Staff Form would go here */}
                <p className="text-gray-500">নতুন স্টাফ যোগ করার ফর্ম এখানে যোগ করা হবে।</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-primary mb-4">স্টাফদের তালিকা</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-light">
                            <tr>
                                <th className="p-4 font-semibold">ছবি</th>
                                <th className="p-4 font-semibold">নাম</th>
                                <th className="p-4 font-semibold">পদ</th>
                                <th className="p-4 font-semibold">বিষয়/দায়িত্ব</th>
                                <th className="p-4 font-semibold">ইমেইল</th>
                                <th className="p-4 font-semibold">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allStaff.map(staff => (
                                <tr key={staff.id} className="border-b">
                                    <td className="p-4">
                                        <img 
                                            src={staff.profilePicUrl || 'https://i.ibb.co/6yT1WfX/school-logo-placeholder.png'} 
                                            alt={staff.name} 
                                            className="w-12 h-12 rounded-full object-cover"
                                            onError={(e) => (e.currentTarget.src = 'https://i.ibb.co/6yT1WfX/school-logo-placeholder.png')}
                                        />
                                    </td>
                                    <td className="p-4 font-medium">{staff.name}</td>
                                    <td className="p-4">{staff.role}</td>
                                    <td className="p-4">{staff.details}</td>
                                    <td className="p-4">{staff.email}</td>
                                    <td className="p-4">
                                        <div className="flex items-center space-x-2">
                                            <button className="text-accent text-xl hover:text-blue-800"><i className="fas fa-edit"></i></button>
                                            <button className="text-danger text-xl hover:text-red-800"><i className="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StaffManagement;
