import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { DailyAttendance } from '../types';

const Attendance: React.FC = () => {
    const { students, classes, sections, attendance, saveAttendance } = useApp();

    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
    const [attendanceData, setAttendanceData] = useState<DailyAttendance>({});
    const [loading, setLoading] = useState(false);

    const classSectionKey = `${selectedClass}___${selectedSection}`;

    const classOptions = Object.values(classes).map(c => c.name);
    const sectionOptions = Object.values(sections).map(s => s.name);

    useEffect(() => {
        if(classOptions.length > 0) setSelectedClass(classOptions[0]);
        if(sectionOptions.length > 0) setSelectedSection(sectionOptions[0]);
    }, []);

    const studentsInClass = useMemo(() => {
        return Object.values(students)
            .filter(s => s.className === selectedClass && s.section === selectedSection)
            .sort((a, b) => a.roll - b.roll);
    }, [students, selectedClass, selectedSection]);

    useEffect(() => {
        const existingData = attendance[selectedDate]?.[classSectionKey] || {};
        const newAttendanceData: DailyAttendance = {};
        studentsInClass.forEach(student => {
            newAttendanceData[student.id] = {
                status: existingData[student.id]?.status || 'present'
            };
        });
        setAttendanceData(newAttendanceData);
    }, [selectedClass, selectedSection, selectedDate, studentsInClass, attendance]);

    const handleStatusChange = (studentId: string, status: 'present' | 'absent') => {
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: { status }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        saveAttendance(selectedDate, classSectionKey, attendanceData);
        setTimeout(() => { // Simulate API call
            alert('হাজিরা সফলভাবে সেভ করা হয়েছে!');
            setLoading(false);
        }, 300);
    };

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-primary mb-4">ছাত্রের হাজিরা নিন</h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="font-medium">ক্লাস</label>
                        <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="w-full p-2 border rounded-md bg-white mt-1">
                            {classOptions.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="font-medium">বিভাগ</label>
                        <select value={selectedSection} onChange={e => setSelectedSection(e.target.value)} className="w-full p-2 border rounded-md bg-white mt-1">
                             {sectionOptions.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="font-medium">তারিখ</label>
                        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="w-full p-2 border rounded-md mt-1"/>
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-bold text-primary mb-4">ছাত্র তালিকা ({selectedClass} - {selectedSection})</h3>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-3">
                        {studentsInClass.length > 0 ? (
                            studentsInClass.map(student => (
                                <div key={student.id} className="flex justify-between items-center p-3 bg-light rounded-md">
                                    <span>{student.roll}. {student.name}</span>
                                    <div className="flex space-x-4">
                                        <label className="flex items-center space-x-1 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name={`student_${student.id}`} 
                                                value="present" 
                                                checked={attendanceData[student.id]?.status === 'present'}
                                                onChange={() => handleStatusChange(student.id, 'present')}
                                            /> 
                                            <span>উপস্থিত</span>
                                        </label>
                                        <label className="flex items-center space-x-1 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name={`student_${student.id}`} 
                                                value="absent"
                                                checked={attendanceData[student.id]?.status === 'absent'}
                                                onChange={() => handleStatusChange(student.id, 'absent')}
                                            /> 
                                            <span>অনুপস্থিত</span>
                                        </label>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-4">এই ক্লাসে কোনো ছাত্র পাওয়া যায়নি।</p>
                        )}
                    </div>
                    {studentsInClass.length > 0 && (
                        <div className="text-right mt-6">
                            <button type="submit" disabled={loading} className="bg-secondary text-white font-bold py-2 px-6 rounded-lg hover:bg-accent transition disabled:bg-gray-400">
                                {loading ? 'সেভিং...' : 'হাজিরা সেভ করুন'}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Attendance;