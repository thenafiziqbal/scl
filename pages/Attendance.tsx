
import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Student, Class, Section } from '../types';

const Attendance: React.FC = () => {
    const { students, classes, sections, attendance, updateAttendance, user } = useApp();

    const availableClasses = useMemo(() => {
        if (user?.role === 'department-head' && user.department) {
            // FIX: Add explicit type for `c` to resolve property access errors.
            return Object.fromEntries(Object.entries(classes).filter(([, c]: [string, Class]) => c.name === user.department));
        }
        return classes;
    }, [classes, user]);

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
    const [selectedClass, setSelectedClass] = useState((Object.values(availableClasses)[0] as Class)?.name || '');
    const [selectedSection, setSelectedSection] = useState((Object.values(sections)[0] as Section)?.name || '');

    useEffect(() => {
        // FIX: Add explicit type for `c` to resolve property access errors.
        if (!Object.values(availableClasses).some((c: Class) => c.name === selectedClass)) {
            setSelectedClass((Object.values(availableClasses)[0] as Class)?.name || '');
        }
    }, [availableClasses, selectedClass]);

    const studentsInClass = useMemo(() => {
        // FIX: Add explicit types to resolve property access and sort errors.
        return Object.values(students)
            .filter((s: Student) => s.className === selectedClass && s.section === selectedSection)
            .sort((a: Student, b: Student) => a.roll - b.roll);
    }, [students, selectedClass, selectedSection]);
    
    const classSectionKey = `${selectedClass}___${selectedSection}`;
    const todaysAttendance = attendance[selectedDate]?.[classSectionKey] || {};

    const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'leave') => {
        updateAttendance(selectedDate, classSectionKey, studentId, status);
    };

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-primary mb-4">ছাত্রের হাজিরা</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-light rounded-lg">
                    <div>
                        <label className="font-medium text-sm">তারিখ</label>
                        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="w-full p-2 border rounded-md mt-1" />
                    </div>
                    <div>
                        <label className="font-medium text-sm">ক্লাস</label>
                        <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="w-full p-2 border rounded-md mt-1">
                             {/* FIX: Add explicit type for `c` to resolve property access errors. */}
                             {Object.values(availableClasses).map((c: Class) => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="font-medium text-sm">বিভাগ</label>
                        <select value={selectedSection} onChange={e => setSelectedSection(e.target.value)} className="w-full p-2 border rounded-md mt-1">
                            {/* FIX: Add explicit type for `s` to resolve property access errors. */}
                            {Object.values(sections).map((s: Section) => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-sidebar text-white">
                            <tr>
                                <th className="p-4 font-semibold">রোল</th>
                                <th className="p-4 font-semibold">নাম</th>
                                <th className="p-4 font-semibold text-center">স্ট্যাটাস</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentsInClass.map((student: Student) => (
                                <tr key={student.id} className="border-b">
                                    <td className="p-4 text-gray-700">{student.roll}</td>
                                    <td className="p-4 font-medium text-accent">{student.name}</td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center items-center space-x-3">
                                            <button
                                                onClick={() => handleStatusChange(student.id, 'present')}
                                                title="উপস্থিত"
                                                className={`w-10 h-10 flex items-center justify-center rounded-full transition-transform transform hover:scale-110 ${
                                                    todaysAttendance[student.id]?.status === 'present'
                                                    ? 'bg-success text-white shadow-md'
                                                    : 'bg-gray-200 text-gray-600 hover:bg-green-100'
                                                }`}
                                                aria-pressed={todaysAttendance[student.id]?.status === 'present'}
                                            >
                                                <i className="fas fa-check"></i>
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(student.id, 'absent')}
                                                title="অনুপস্থিত"
                                                className={`w-10 h-10 flex items-center justify-center rounded-full transition-transform transform hover:scale-110 ${
                                                    todaysAttendance[student.id]?.status === 'absent'
                                                    ? 'bg-danger text-white shadow-md'
                                                    : 'bg-gray-200 text-gray-600 hover:bg-red-100'
                                                }`}
                                                aria-pressed={todaysAttendance[student.id]?.status === 'absent'}
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(student.id, 'leave')}
                                                title="ছুটি"
                                                className={`w-10 h-10 flex items-center justify-center rounded-full transition-transform transform hover:scale-110 ${
                                                    todaysAttendance[student.id]?.status === 'leave'
                                                    ? 'bg-yellow-500 text-white shadow-md'
                                                    : 'bg-gray-200 text-gray-600 hover:bg-yellow-100'
                                                }`}
                                                aria-pressed={todaysAttendance[student.id]?.status === 'leave'}
                                            >
                                                <i className="fas fa-calendar-day"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                             {studentsInClass.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="text-center p-8 text-gray-500">
                                        এই ক্লাস ও বিভাগে কোনো ছাত্র পাওয়া যায়নি।
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
