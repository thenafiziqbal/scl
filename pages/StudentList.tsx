
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Student } from '../types';
import EditStudentModal from '../components/EditStudentModal';
import IDCardModal from '../components/IDCardModal';

const StudentList: React.FC = () => {
    const { students, user, classes, sections, updateStudent, settings } = useApp();
    const navigate = useNavigate();
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [idCardStudent, setIdCardStudent] = useState<Student | null>(null);


    const sortedStudents = Object.values(students).sort((a, b) => {
        if (a.className < b.className) return -1;
        if (a.className > b.className) return 1;
        return a.roll - b.roll;
    });

    const handleSave = (updatedStudent: Student) => {
        if (!updatedStudent.id) return;
        updateStudent(updatedStudent.id, updatedStudent);
        setEditingStudent(null);
        alert('ছাত্রের তথ্য সফলভাবে আপডেট করা হয়েছে!');
    };


    return (
        <>
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-primary mb-4">ছাত্র তালিকা</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-sidebar text-white">
                            <tr>
                                <th className="p-4 font-semibold">ছবি</th>
                                <th className="p-4 font-semibold">নাম</th>
                                <th className="p-4 font-semibold">ক্লাস</th>
                                <th className="p-4 font-semibold">রোল</th>
                                <th className="p-4 font-semibold">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedStudents.map(student => (
                                <tr key={student.id} className="border-b">
                                    <td className="p-4">
                                        <img 
                                            src={student.profilePicUrl || 'https://i.ibb.co/6yT1WfX/school-logo-placeholder.png'} 
                                            alt={student.name} 
                                            className="w-12 h-12 rounded-full object-cover"
                                            onError={(e) => (e.currentTarget.src = 'https://i.ibb.co/6yT1WfX/school-logo-placeholder.png')}
                                        />
                                    </td>
                                    <td className="p-4 font-medium text-accent">{student.name}</td>
                                    <td className="p-4 text-gray-700">{student.className} ({student.section})</td>
                                    <td className="p-4 text-gray-700">{student.roll}</td>
                                    <td className="p-4">
                                        <div className="flex items-center space-x-3">
                                            <button 
                                                onClick={() => navigate(`/student-profile/${student.id}`)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition"
                                                title="প্রোফাইল দেখুন"
                                            >
                                                প্রোফাইল
                                            </button>
                                            <button onClick={() => setIdCardStudent(student)} className="text-green-600 text-xl hover:text-green-800" title="আইডি কার্ড"><i className="fas fa-id-card"></i></button>
                                            {user?.role === 'admin' && (
                                                <>
                                                    <button onClick={() => setEditingStudent(student)} className="text-accent text-xl hover:text-blue-800" title="এডিট করুন"><i className="fas fa-edit"></i></button>
                                                    <button className="text-danger text-xl hover:text-red-800" title="মুছে ফেলুন"><i className="fas fa-trash"></i></button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {editingStudent && (
                <EditStudentModal
                    student={editingStudent}
                    classes={classes}
                    sections={sections}
                    onClose={() => setEditingStudent(null)}
                    onSave={handleSave}
                />
            )}
            {idCardStudent && (
                 <IDCardModal
                    student={idCardStudent}
                    settings={settings}
                    onClose={() => setIdCardStudent(null)}
                />
            )}
        </>
    );
};

export default StudentList;
