
import React from 'react';
import { useApp } from '../context/AppContext';

const TeacherDashboard: React.FC = () => {
    const { user, schedules } = useApp();
    const days = ["শনিবার", "রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার"];
    const dayMap = [1, 2, 3, 4, 5, 6, 0]; // JS Day -> App Day (Sat=0, Sun=1) mapping
    const todayIndex = dayMap[new Date().getDay()];

    if (!user) return null;

    const mySchedules = Object.values(schedules).filter(s => s.teacherId === user.uid);
    const todaysClasses = mySchedules.filter(s => parseInt(s.day, 10) === todayIndex).sort((a, b) => a.startTime.localeCompare(b.startTime));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold text-primary mb-4">আজকের ক্লাস</h2>
                    {todaysClasses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {todaysClasses.map(s => (
                                <div key={s.id} className="bg-light p-4 rounded-lg border-l-4 border-secondary">
                                    <h4 className="font-bold text-lg">{s.className} ({s.section})</h4>
                                    <p><strong>বিষয়:</strong> {s.subject}</p>
                                    <p><strong>সময়:</strong> {s.startTime} - {s.endTime}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>আজ আপনার কোনো ক্লাস নেই।</p>
                    )}
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold text-primary mb-4">আমার সাপ্তাহিক রুটিন</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {days.map((day, index) => (
                            <div key={day} className="bg-light p-4 rounded-lg">
                                <h3 className="font-bold text-center border-b-2 border-secondary pb-2 mb-2">{day}</h3>
                                <div className="space-y-2">
                                    {mySchedules.filter(s => parseInt(s.day, 10) === index).sort((a,b) => a.startTime.localeCompare(b.startTime)).map(s => (
                                        <div key={s.id} className="bg-white p-3 rounded shadow-sm text-sm">
                                            <p className="font-semibold">{s.className} ({s.section})</p>
                                            <p>বিষয়: {s.subject}</p>
                                            <p>সময়: {s.startTime} - {s.endTime}</p>
                                        </div>
                                    ))}
                                    {mySchedules.filter(s => parseInt(s.day, 10) === index).length === 0 && <p className="text-xs text-center text-gray-500">কোনো ক্লাস নেই</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
                 <h2 className="text-xl font-bold text-primary mb-4">আসন্ন ডিউটি</h2>
                 {/* This section can be implemented if invigilator data is available */}
                 <p className="text-gray-500">আপনার কোনো আসন্ন ডিউটি নেই।</p>
            </div>
        </div>
    );
};

export default TeacherDashboard;
