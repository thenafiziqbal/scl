
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useApp } from '../context/AppContext';
import Card from '../components/Card';
import { Student } from '../types';

const AdminDashboard: React.FC = () => {
    const { students, teachers, librarians, classes, library, attendance } = useApp();

    const totalStudents = Object.keys(students).length;
    const totalStaff = Object.keys(teachers).length + Object.keys(librarians).length;
    const totalClasses = Object.keys(classes).length;
    const totalBooks = Object.keys(library.books).length;

    const getAttendanceData = () => {
        const today = new Date().toISOString().slice(0, 10);
        const todaysAttendance = attendance[today] || {};
        const classData: { [key: string]: { present: number; total: number } } = {};

        // Calculate total students per class
        const totalStudentsByClass: { [key: string]: number } = {};
        // FIX: Add explicit type for student to resolve property access errors.
        Object.values(students).forEach((student: Student) => {
            const key = `${student.className}___${student.section}`;
            totalStudentsByClass[key] = (totalStudentsByClass[key] || 0) + 1;
        });

        Object.entries(todaysAttendance).forEach(([classSection, studentAttendance]) => {
            const presentCount = Object.values(studentAttendance).filter(att => att.status === 'present').length;
            classData[classSection] = {
                present: presentCount,
                total: totalStudentsByClass[classSection] || Object.keys(studentAttendance).length
            };
        });
        
        return Object.entries(classData).map(([classSection, data]) => ({
            name: classSection.replace('___', ' - '),
            'উপস্থিতির হার (%)': data.total > 0 ? parseFloat(((data.present / data.total) * 100).toFixed(2)) : 0,
        }));
    };

    const attendanceData = getAttendanceData();
    
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card title="মোট ছাত্র" value={totalStudents} icon="fas fa-users" colorClass="bg-blue-500" />
                <Card title="মোট স্টাফ" value={totalStaff} icon="fas fa-chalkboard-user" colorClass="bg-green-500" />
                <Card title="মোট ক্লাস" value={totalClasses} icon="fas fa-layer-group" colorClass="bg-yellow-500" />
                <Card title="লাইব্রেরিতে বই" value={totalBooks} icon="fas fa-book" colorClass="bg-purple-500" />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-primary mb-4">ক্লাসভিত্তিক আজকের উপস্থিতির হার</h2>
                <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <BarChart
                            data={attendanceData}
                            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis unit="%" domain={[0, 100]} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="উপস্থিতির হার (%)" fill="#3498db" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
