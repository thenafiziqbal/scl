
import React from 'react';
import { useApp } from '../context/AppContext';

const ClassTests: React.FC = () => {
    const { user, classTests } = useApp();

    if (!user) return null;

    const myTests = Object.values(classTests).filter(test => test.createdBy === user.uid);

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-primary mb-4">নতুন ক্লাস টেস্ট তৈরি করুন</h2>
                {/* Add Class Test Form goes here */}
                <p className="text-gray-500">নতুন ক্লাস টেস্ট তৈরির ফর্ম এখানে যোগ করা হবে।</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-primary mb-4">আমার তৈরিকৃত টেস্ট তালিকা</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-sidebar text-white">
                            <tr>
                                <th className="p-4 font-semibold">নাম</th>
                                <th className="p-4 font-semibold">ক্লাস</th>
                                <th className="p-4 font-semibold">বিষয়</th>
                                <th className="p-4 font-semibold">মোট নম্বর</th>
                                <th className="p-4 font-semibold">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myTests.map(test => (
                                <tr key={test.id} className="border-b">
                                    <td className="p-4 text-gray-800">{test.examName}</td>
                                    <td className="p-4 text-gray-700">{test.className} ({test.section})</td>
                                    <td className="p-4 text-gray-700">{test.subject}</td>
                                    <td className="p-4 text-center text-accent font-semibold">{test.totalMarks}</td>
                                    <td className="p-4">
                                        <div className="flex items-center space-x-2">
                                            <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition">নম্বর দিন</button>
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

export default ClassTests;