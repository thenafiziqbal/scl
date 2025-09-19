import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudentLeave, Student } from '../types';
import EditLeaveModal from '../components/EditLeaveModal';

const StudentLeaves: React.FC = () => {
    const { leaves, students, addLeave, updateLeave, deleteLeave } = useApp();
    
    // State for adding a new leave
    const [studentId, setStudentId] = useState('');
    const [reason, setReason] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // State for editing a leave
    const [editingLeave, setEditingLeave] = useState<StudentLeave | null>(null);

    const handleAddLeave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!studentId || !reason || !startDate || !endDate) {
            alert('অনুগ্রহ করে সকল তথ্য পূরণ করুন।');
            return;
        }
        addLeave({ studentId, reason, startDate, endDate, status: 'pending' });
        // Reset form
        setStudentId('');
        setReason('');
        setStartDate('');
        setEndDate('');
        alert('ছুটির আবেদন সফলভাবে যোগ করা হয়েছে।');
    };

    const handleUpdateStatus = (leave: StudentLeave, status: 'approved' | 'rejected') => {
        updateLeave(leave.id, { ...leave, status });
    };

    const handleDelete = (id: string) => {
        if (window.confirm('আপনি কি এই ছুটির আবেদনটি মুছে ফেলতে চান?')) {
            deleteLeave(id);
        }
    };
    
    const handleSaveEdit = (updatedLeave: StudentLeave) => {
        updateLeave(updatedLeave.id, updatedLeave);
        setEditingLeave(null);
        alert('ছুটির তথ্য সফলভাবে আপডেট করা হয়েছে!');
    };
    
    const getStatusBadge = (status: 'pending' | 'approved' | 'rejected') => {
        switch (status) {
            case 'approved':
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-200 text-green-800">অনুমোদিত</span>;
            case 'rejected':
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-200 text-red-800">প্রত্যাখ্যাত</span>;
            default:
                return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-200 text-yellow-800">বিবেচনাধীন</span>;
        }
    };
    
    const fieldClasses = "w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:ring-secondary focus:border-secondary";

    return (
        <>
            <div className="space-y-8">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold text-primary mb-4">ছাত্রের ছুটির আবেদন করুন</h2>
                    <form onSubmit={handleAddLeave}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                            <div>
                                <label className="font-medium text-sm">ছাত্র</label>
                                <select value={studentId} onChange={e => setStudentId(e.target.value)} required className={fieldClasses}>
                                    <option value="">-- ছাত্র নির্বাচন করুন --</option>
                                    {Object.values(students).map((s: Student) => <option key={s.id} value={s.id}>{s.name} ({s.className})</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="font-medium text-sm">শুরুর তারিখ</label>
                                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required className={fieldClasses}/>
                            </div>
                            <div>
                                <label className="font-medium text-sm">শেষ তারিখ</label>
                                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required className={fieldClasses}/>
                            </div>
                            <div className="md:col-span-2 lg:col-span-3">
                                <label className="font-medium text-sm">কারণ</label>
                                <input type="text" value={reason} onChange={e => setReason(e.target.value)} required placeholder="ছুটির কারণ লিখুন..." className={fieldClasses}/>
                            </div>
                            <div className="lg:col-span-1">
                                <button type="submit" className="w-full bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-accent transition">আবেদন করুন</button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold text-primary mb-4">ছুটির আবেদন তালিকা</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-sidebar text-white">
                                <tr>
                                    <th className="p-4 font-semibold">ছাত্রের নাম</th>
                                    <th className="p-4 font-semibold">ক্লাস</th>
                                    <th className="p-4 font-semibold">কারণ</th>
                                    <th className="p-4 font-semibold">সময়কাল</th>
                                    <th className="p-4 font-semibold text-center">স্ট্যাটাস</th>
                                    <th className="p-4 font-semibold text-center">অ্যাকশন</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.values(leaves).map((leave: StudentLeave) => {
                                    const student = students[leave.studentId];
                                    return (
                                        <tr key={leave.id} className="border-b">
                                            <td className="p-4 text-accent font-medium">{student?.name || 'N/A'}</td>
                                            <td className="p-4 text-gray-700">{student ? `${student.className} (${student.section})` : 'N/A'}</td>
                                            <td className="p-4 text-gray-700">{leave.reason}</td>
                                            <td className="p-4 text-gray-700">{leave.startDate} থেকে {leave.endDate}</td>
                                            <td className="p-4 text-center">{getStatusBadge(leave.status)}</td>
                                            <td className="p-4 text-center">
                                                <div className="flex justify-center items-center space-x-2">
                                                    {leave.status === 'pending' && (
                                                        <>
                                                            <button onClick={() => handleUpdateStatus(leave, 'approved')} className="text-success hover:text-green-700 text-lg" title="অনুমোদন করুন"><i className="fas fa-check-circle"></i></button>
                                                            <button onClick={() => handleUpdateStatus(leave, 'rejected')} className="text-yellow-600 hover:text-yellow-800 text-lg" title="প্রত্যাখ্যান করুন"><i className="fas fa-times-circle"></i></button>
                                                        </>
                                                    )}
                                                    <button onClick={() => setEditingLeave(leave)} className="text-amber-600 hover:text-amber-800 text-lg" title="এডিট করুন"><i className="fas fa-edit"></i></button>
                                                    <button onClick={() => handleDelete(leave.id)} className="text-danger hover:text-red-700 text-lg" title="মুছে ফেলুন"><i className="fas fa-trash"></i></button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {editingLeave && (
                <EditLeaveModal
                    leave={editingLeave}
                    students={students}
                    onClose={() => setEditingLeave(null)}
                    onSave={handleSaveEdit}
                />
            )}
        </>
    );
};

export default StudentLeaves;