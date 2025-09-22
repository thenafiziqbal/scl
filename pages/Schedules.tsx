
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Schedule, Class, Teacher } from '../types';

const Schedules: React.FC = () => {
    const { schedules, classes, teachers, user } = useApp();
    const [selectedClass, setSelectedClass] = useState((Object.values(classes)[0] as Class)?.name || '');

    const days = ["শনিবার", "রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার"];

    const filteredSchedules = useMemo(() => {
        const classSchedules: { [dayIndex: string]: Schedule[] } = {};
        // FIX: Add explicit type for `s` to resolve property access errors.
        Object.values(schedules)
            .filter((s: Schedule) => s.className === selectedClass)
            .forEach((s: Schedule) => {
                if (!classSchedules[s.day]) {
                    classSchedules[s.day] = [];
                }
                classSchedules[s.day].push(s);
            });

        // Sort schedules within each day by start time
        for (const day in classSchedules) {
            classSchedules[day].sort((a: Schedule, b: Schedule) => a.startTime.localeCompare(b.startTime));
        }
        return classSchedules;
    }, [schedules, selectedClass]);
    
    const isAdmin = user?.role === 'admin';

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                    <h2 className="text-xl font-bold text-primary">ক্লাস রুটিন</h2>
                    <div className="flex items-center gap-4">
                        <label className="font-medium">ক্লাস ফিল্টার:</label>
                        <select 
                            value={selectedClass} 
                            onChange={e => setSelectedClass(e.target.value)}
                            className="p-2 border rounded-md"
                        >
                            {/* FIX: Add explicit type for `c` to resolve property access errors. */}
                            {Object.values(classes).map((c: Class) => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                         {isAdmin && <button className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-accent transition">নতুন পিরিয়ড যোগ করুন</button>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {days.map((day, index) => (
                        <div key={day} className="bg-light p-4 rounded-lg">
                            <h3 className="font-bold text-center text-lg text-accent border-b-2 border-secondary pb-2 mb-3">{day}</h3>
                            <div className="space-y-3">
                                {filteredSchedules[index] ? filteredSchedules[index].map((s: Schedule) => (
                                    <div key={s.id} className="bg-white p-3 rounded-md shadow-sm border-l-4 border-secondary">
                                        <p className="font-semibold">{s.subject}</p>
                                        <p className="text-sm text-gray-600">শিক্ষক: {teachers[s.teacherId]?.name || 'N/A'}</p>
                                        <p className="text-sm text-gray-600">সময়: {s.startTime} - {s.endTime}</p>
                                        <p className="text-sm text-gray-600">সেকশন: {s.section}</p>
                                    </div>
                                )) : (
                                     <p className="text-sm text-center text-gray-500 pt-4">কোনো ক্লাস নেই</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Schedules;
