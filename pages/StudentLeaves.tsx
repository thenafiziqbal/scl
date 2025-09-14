
import React from 'react';
import { useApp } from '../context/AppContext';

const StudentLeaves: React.FC = () => {
    const { leaves, students } = useApp();

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-primary mb-4">ছাত্রের ছুটির তথ্য যোগ করুন</h2>
                {/* Add Leave Form would go here */}
                <p className="text-gray-500">নতুন ছুটির তথ্য যোগ করার ফর্ম এখানে যোগ করা হবে।</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-primary mb-4">ছুটিতে থাকা ছাত্রদের তালিকা</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-light">
                            <tr>
                                <th className="p-4 font-semibold">ছাত্রের নাম</th>
                                <th className="p-4 font-semibold">ক্লাস</th>
                                <th className="p-4 font-semibold">কারণ</th>
                                <th className="p-4 font-semibold">শুরু</th>
                                <th className="p-4 font-semibold">শেষ</th>
                                <th className="p-4 font-semibold">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.values(leaves).map(leave => {
                                const student = students[leave.studentId];
                                return (
                                    <tr key={leave.id} className="border-b">
                                        <td className="p-4">{student?.name || 'N/A'}</td>
                                        <td className="p-4">{student ? `${student.className} (${student.section})` : 'N/A'}</td>
                                        <td className="p-4">{leave.reason}</td>
                                        <td className="p-4">{leave.startDate}</td>
                                        <td className="p-4">{leave.endDate}</td>
                                        <td className="p-4">
                                            <button className="text-danger text-xl hover:text-red-800"><i className="fas fa-trash"></i></button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentLeaves;
