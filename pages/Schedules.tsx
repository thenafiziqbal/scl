import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { noto_sans_bengali_normal } from '../services/bengaliFont';

declare global {
    interface Window {
        jspdf: any;
    }
}

const Schedules: React.FC = () => {
    const { schedules, teachers, user, settings, classes, sections, addSchedule, deleteSchedule } = useApp();
    const days = ["শনিবার", "রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার"];
    const [formData, setFormData] = useState({
        day: '',
        className: '',
        section: '',
        subject: '',
        teacherId: '',
        startTime: '',
        endTime: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (Object.values(formData).some(val => val === '')) {
            alert('অনুগ্রহ করে সমস্ত তথ্য পূরণ করুন।');
            return;
        }
        addSchedule(formData);
        // Reset form
        setFormData({
            day: '', className: '', section: '', subject: '', teacherId: '', startTime: '', endTime: ''
        });
        alert('নতুন শিডিউল যোগ করা হয়েছে!');
    };
    
    const handleDelete = (id: string) => {
        if (window.confirm('আপনি কি এই শিডিউলটি মুছে ফেলতে চান?')) {
            deleteSchedule(id);
        }
    };

    const generateClassicPdf = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Add Bengali font
        doc.addFileToVFS('NotoSansBengali-Regular.ttf', noto_sans_bengali_normal);
        doc.addFont('NotoSansBengali-Regular.ttf', 'NotoSansBengali', 'normal');
        doc.setFont('NotoSansBengali');

        const schoolName = settings?.schoolName || 'স্কুলের নাম';
        const title = "সাপ্তাহিক ক্লাস রুটিন";
        
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
            styles: { halign: 'center', valign: 'middle', font: 'NotoSansBengali' },
            headStyles: { font: 'NotoSansBengali', fontStyle: 'bold', fillColor: [44, 62, 80], textColor: 255 },
        });

        doc.save(`ক্লাস-রুটিন.pdf`);
    };

    return (
        <div className="space-y-8">
            {user?.role === 'admin' && (
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold text-primary mb-4">নতুন ক্লাস শিডিউল করুন</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                        <div>
                            <label className="font-medium text-gray-700 text-sm">দিন</label>
                            <select name="day" value={formData.day} onChange={handleChange} required className="w-full p-2 border rounded-md mt-1">
                                <option value="">দিন নির্বাচন করুন</option>
                                {days.map((d, i) => <option key={i} value={i}>{d}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="font-medium text-gray-700 text-sm">ক্লাস</label>
                            <select name="className" value={formData.className} onChange={handleChange} required className="w-full p-2 border rounded-md mt-1">
                                <option value="">ক্লাস নির্বাচন করুন</option>
                                {Object.values(classes).map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="font-medium text-gray-700 text-sm">বিভাগ</label>
                            <select name="section" value={formData.section} onChange={handleChange} required className="w-full p-2 border rounded-md mt-1">
                                <option value="">বিভাগ নির্বাচন করুন</option>
                                {Object.values(sections).map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="font-medium text-gray-700 text-sm">বিষয়</label>
                            <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="e.g., গণিত" required className="w-full p-2 border rounded-md mt-1"/>
                        </div>
                        <div>
                            <label className="font-medium text-gray-700 text-sm">শিক্ষক</label>
                            <select name="teacherId" value={formData.teacherId} onChange={handleChange} required className="w-full p-2 border rounded-md mt-1">
                                <option value="">শিক্ষক নির্বাচন করুন</option>
                                {Object.values(teachers).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="font-medium text-gray-700 text-sm">শুরুর সময়</label>
                            <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required className="w-full p-2 border rounded-md mt-1"/>
                        </div>
                        <div>
                            <label className="font-medium text-gray-700 text-sm">শেষের সময়</label>
                            <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required className="w-full p-2 border rounded-md mt-1"/>
                        </div>
                        <div className="lg:col-span-3 text-right">
                             <button type="submit" className="bg-secondary text-white font-bold py-2 px-6 rounded-lg hover:bg-accent transition">
                                <i className="fas fa-plus mr-2"></i>শিডিউল যোগ করুন
                            </button>
                        </div>
                    </form>
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
                                                    <button className="text-accent text-sm hover:text-blue-700"><i className="fas fa-edit"></i></button>
                                                    <button onClick={() => handleDelete(schedule.id)} className="text-danger text-sm hover:text-red-700"><i className="fas fa-trash"></i></button>
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