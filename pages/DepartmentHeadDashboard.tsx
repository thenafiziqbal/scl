import React from 'react';
import { useApp } from '../context/AppContext';
import Card from '../components/Card';
import { Schedule, Student, Teacher } from '../types';

const DepartmentHeadDashboard: React.FC = () => {
    const { user, students, teachers, schedules, attendance } = useApp();

    const totalStudentsInDept = Object.keys(students).length;
    const totalTeachersInDept = Object.keys(teachers).length;
    
    const getAttendancePercentage = () => {
        const today = new Date().toISOString().slice(0, 10);
        let totalPresent = 0;
        let totalTracked = 0;

        // FIX: Add explicit type for student to resolve property access errors.
        const departmentStudents = Object.values(students) as Student[];
        if (departmentStudents.length === 0) return 0;
        
        const sections = [...new Set(departmentStudents.map(s => s.section))];
        const className = user?.department || '';

        sections.forEach(section => {
            const classSectionKey = `${className}___${section}`;
            const todaysAttendanceForSection = attendance[today]?.[classSectionKey] || {};
            
            const studentsInSection = departmentStudents.filter(s => s.section === section);
            totalTracked += studentsInSection.length;

            studentsInSection.forEach(student => {
                if (todaysAttendanceForSection[student.id]?.status === 'present') {
                    totalPresent++;
                }
            });
        });
        
        return totalTracked > 0 ? Math.round((totalPresent / totalTracked) * 100) : 0;
    };

    const attendancePercent = getAttendancePercentage();

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-primary">ড্যাশবোর্ড ({user?.department})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card title="বিভাগের মোট ছাত্র" value={totalStudentsInDept} icon="fas fa-users" colorClass="bg-blue-500" />
                <Card title="সংশ্লিষ্ট শিক্ষক" value={totalTeachersInDept} icon="fas fa-chalkboard-user" colorClass="bg-green-500" />
                <Card title="আজকের উপস্থিতি" value={`${attendancePercent}%`} icon="fas fa-user-check" colorClass="bg-yellow-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold text-primary mb-4">শিক্ষকদের তালিকা</h2>
                    <div className="overflow-x-auto max-h-96">
                        <table className="w-full text-left">
                            <thead className="bg-sidebar text-white sticky top-0">
                                <tr>
                                    <th className="p-3 font-semibold">নাম</th>
                                    <th className="p-3 font-semibold">বিষয়</th>
                                    <th className="p-3 font-semibold">ইমেইল</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* FIX: Add explicit type for teacher to resolve property access errors. */}
                                {Object.values(teachers).map((teacher: Teacher) => (
                                    <tr key={teacher.id} className="border-b">
                                        <td className="p-3 font-medium text-accent">{teacher.name}</td>
                                        <td className="p-3 text-gray-700">{teacher.subject}</td>
                                        <td className="p-3 text-gray-700">{teacher.email}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                 <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold text-primary mb-4">আজকের ক্লাসসমূহ</h2>
                     <div className="space-y-3 max-h-96 overflow-y-auto">
                        {/* FIX: Add explicit type for schedule to resolve property access errors. */}
                        {Object.values(schedules).length > 0 ? Object.values(schedules).map((schedule: Schedule) => (
                            <div key={schedule.id} className="bg-light p-3 rounded-lg border-l-4 border-secondary">
                                <p className="font-bold">{schedule.subject} - (সেকশন: {schedule.section})</p>
                                <p className="text-sm">শিক্ষক: {teachers[schedule.teacherId]?.name || 'N/A'}</p>
                                <p className="text-sm">সময়: {schedule.startTime} - {schedule.endTime}</p>
                            </div>
                        )) : (
                            <p className="text-center text-gray-500 pt-8">আজ কোনো ক্লাস নেই।</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepartmentHeadDashboard;
