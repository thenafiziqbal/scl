import React from 'react';
import { useApp } from '../context/AppContext';

declare global {
    interface Window {
        jspdf: any;
    }
}

const Schedules: React.FC = () => {
    const { schedules, teachers, user, settings } = useApp();
    const days = ["শনিবার", "রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার"];

    const generateClassicPdf = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const schoolName = settings?.schoolName || 'স্কুলের নাম';
        const title = "সাপ্তাহিক ক্লাস রুটিন";

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(18);
        doc.text(schoolName, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
        doc.setFontSize(14);
        doc.text(title, doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });

        const head = [['সময়', ...days]];
        const allSchedules = Object.values(schedules);
        
        const timeSlots = [...new Set(allSchedules.map(s => `${s.startTime} - ${s.endTime}`))].sort();

        const body = timeSlots.map(slot => {
            const row = [slot];
            for (let i = 0; i < days.length; i++) {
                const scheduleForSlotAndDay = allSchedules.find(s => `${s.startTime} - ${s.endTime}` === slot && parseInt(s.day) === i);
                if (scheduleForSlotAndDay) {
                    const teacherName = teachers[scheduleForSlotAndDay.teacherId]?.name || 'N/A';
                    row.push(`${scheduleForSlotAndDay.subject}\n${teacherName}\n(${scheduleForSlotAndDay.className})`);
                } else {
                    row.push('');
                }
            }
            return row;
        });

        doc.autoTable({
            head: head,
            body: body,
            startY: 40,
            theme: 'grid',
            styles: { halign: 'center', valign: 'middle', font: 'Helvetica' },
            headStyles: { fillColor: [44, 62, 80], textColor: 255 },
        });

        doc.save(`ক্লাস-রুটিন.pdf`);
    };

    return (
        <div className="space-y-8">
            {user?.role === 'admin' && (
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold text-primary mb-4">নতুন ক্লাস শিডিউল করুন</h2>
                    {/* Add Schedule Form would go here */}
                    <p className="text-gray-500">নতুন শিডিউল যোগ করার ফর্ম এখানে যোগ করা হবে।</p>
                </div>
            )}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                    <h2 className="text-xl font-bold text-primary">সাপ্তাহিক ক্লাস রুটিন</h2>
                    <button 
                        onClick={generateClassicPdf}
                        className="bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-800 transition text-sm"
                    >
                        <i className="fas fa-file-pdf mr-2"></i> ক্লাসিক PDF ডাউনলোড
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {days.map((day, index) => (
                        <div key={day} className="bg-light p-4 rounded-lg">
                            <h3 className="font-bold text-center border-b-2 border-secondary pb-2 mb-3 text-lg">{day}</h3>
                            <div className="space-y-3">
                                {Object.values(schedules)
                                    .filter(s => parseInt(s.day, 10) === index)
                                    .sort((a,b) => a.startTime.localeCompare(b.startTime))
                                    .map(schedule => (
                                        <div key={schedule.id} className="bg-white p-3 rounded-md shadow border-l-4 border-secondary relative">
                                            {user?.role === 'admin' && (
                                                <div className="absolute top-2 right-2 space-x-2">
                                                    <button className="text-accent text-sm"><i className="fas fa-edit"></i></button>
                                                    <button className="text-danger text-sm"><i className="fas fa-trash"></i></button>
                                                </div>
                                            )}
                                            <p className="font-bold">{schedule.className} ({schedule.section})</p>
                                            <p>বিষয়: {schedule.subject}</p>
                                            <p>শিক্ষক: {teachers[schedule.teacherId]?.name || 'N/A'}</p>
                                            <p className="text-sm text-gray-600">সময়: {schedule.startTime} - {schedule.endTime}</p>
                                        </div>
                                    ))
                                }
                                {Object.values(schedules).filter(s => parseInt(s.day, 10) === index).length === 0 && (
                                    <p className="text-center text-gray-500 pt-4">কোনো ক্লাস নেই</p>
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