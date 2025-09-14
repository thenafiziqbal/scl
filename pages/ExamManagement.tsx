import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';

const ExamManagement: React.FC = () => {
    const { mainExams, addMainExam, deleteMainExam, rooms, addRoom, deleteRoom, students, classes, teachers, invigilatorRosters, saveInvigilatorRoster } = useApp();
    const [activeTab, setActiveTab] = useState('main-exam');

    // State for Main Exam form
    const [mainExamName, setMainExamName] = useState('');
    const [mainExamDate, setMainExamDate] = useState('');

    // State for Room Management form
    const [roomName, setRoomName] = useState('');
    const [roomCapacity, setRoomCapacity] = useState('');

    // State for Seat Plan generator
    const [seatPlanExam, setSeatPlanExam] = useState('');
    const [seatPlanClass, setSeatPlanClass] = useState('');
    const [seatPlanRooms, setSeatPlanRooms] = useState<string[]>([]);
    
    // State for Invigilator Duty roster
    const [rosterExam, setRosterExam] = useState('');
    const [rosterDate, setRosterDate] = useState('');
    const [currentRoster, setCurrentRoster] = useState<{ [roomId: string]: string }>({});


    const handleAddExam = (e: React.FormEvent) => {
        e.preventDefault();
        if (!mainExamName || !mainExamDate) return alert('অনুগ্রহ করে পরীক্ষার নাম এবং তারিখ দিন।');
        addMainExam({ name: mainExamName, date: mainExamDate });
        setMainExamName('');
        setMainExamDate('');
    };

    const handleAddRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if (!roomName || !roomCapacity) return alert('অনুগ্রহ করে রুমের নাম এবং ধারণক্ষমতা দিন।');
        addRoom({ name: roomName, capacity: parseInt(roomCapacity, 10) });
        setRoomName('');
        setRoomCapacity('');
    };
    
    const handleSaveRoster = () => {
        if (!rosterExam || !rosterDate) return alert('অনুগ্রহ করে পরীক্ষা এবং তারিখ নির্বাচন করুন।');
        saveInvigilatorRoster(rosterExam, rosterDate, currentRoster);
        alert('রোস্টার সেভ করা হয়েছে!');
    };
    
    const handleRosterTeacherChange = (roomId: string, teacherId: string) => {
        setCurrentRoster(prev => ({...prev, [roomId]: teacherId}));
    };

    const tabs = [
        { id: 'main-exam', label: 'মূল পরীক্ষা ও রুটিন' },
        { id: 'room-management', label: 'রুম ম্যানেজমেন্ট' },
        { id: 'seat-plan', label: 'সিট প্ল্যান' },
        { id: 'invigilator-duty', label: 'পরিদর্শক ডিউটি' },
    ];
    
    const seatPlanResult = useMemo(() => {
        if (!seatPlanExam || !seatPlanClass || seatPlanRooms.length === 0) {
            return { html: '<p class="text-center text-gray-500">প্ল্যান তৈরি করতে উপরের ফর্মটি পূরণ করুন।</p>', warning: null };
        }

        const relevantStudents = Object.values(students).filter(s => s.className === classes[seatPlanClass]?.name).sort((a, b) => a.roll - b.roll);
        const selectedRooms = seatPlanRooms.map(id => rooms[id]).sort((a,b) => a.capacity - b.capacity);

        let html = '';
        let studentIndex = 0;
        
        selectedRooms.forEach(room => {
            html += `<div class="bg-white p-4 rounded-lg shadow"><h4 class="font-bold text-lg text-primary border-b pb-2 mb-2">রুম: ${room.name} (ধারণক্ষমতা: ${room.capacity})</h4><table class="w-full text-sm"><thead><tr class="bg-gray-100"><th class="p-2 text-left">রোল</th><th class="p-2 text-left">নাম</th></tr></thead><tbody>`;
            for (let i = 0; i < room.capacity && studentIndex < relevantStudents.length; i++) {
                const student = relevantStudents[studentIndex];
                html += `<tr class="border-b"><td class="p-2">${student.roll}</td><td class="p-2">${student.name}</td></tr>`;
                studentIndex++;
            }
            html += `</tbody></table></div>`;
        });
        
        let warning = null;
        if (studentIndex < relevantStudents.length) {
            warning = `সতর্কতা: ${relevantStudents.length - studentIndex} জন ছাত্রের জন্য সিট বরাদ্দ করা যায়নি। অনুগ্রহ করে আরও রুম যোগ করুন।`;
        }

        return { html: `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">${html}</div>`, warning };
    }, [seatPlanExam, seatPlanClass, seatPlanRooms, students, classes, rooms]);

    const renderMainExamTab = () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-sky-50 p-6 rounded-lg shadow-inner">
                <h3 className="text-lg font-bold text-primary mb-4">নতুন মূল পরীক্ষা তৈরি করুন</h3>
                <form onSubmit={handleAddExam} className="space-y-4">
                     <div>
                        <label className="font-medium text-gray-700">পরীক্ষার নাম</label>
                        <input type="text" value={mainExamName} onChange={e => setMainExamName(e.target.value)} placeholder="e.g., অর্ধবার্ষিকী পরীক্ষা ২০২৫" required className="w-full p-2 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-secondary focus:border-secondary"/>
                    </div>
                    <div>
                        <label className="font-medium text-gray-700">পরীক্ষার শুরুর তারিখ</label>
                        <input type="date" value={mainExamDate} onChange={e => setMainExamDate(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md mt-1 shadow-sm focus:ring-secondary focus:border-secondary"/>
                    </div>
                    <button type="submit" className="bg-secondary text-white font-bold py-2 px-6 rounded-lg hover:bg-accent transition">পরীক্ষা তৈরি করুন</button>
                </form>
            </div>
             <div className="bg-teal-50 p-6 rounded-lg shadow-inner">
                <h3 className="text-lg font-bold text-primary mb-4">সকল মূল পরীক্ষার তালিকা</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {Object.values(mainExams).map(exam => (
                        <div key={exam.id} className="bg-white p-3 rounded-md shadow flex justify-between items-center">
                            <div>
                                <p className="font-bold">{exam.name}</p>
                                <p className="text-sm text-gray-500">তারিখ: {exam.date}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button title="রুটিন তৈরি/এডিট করুন" className="text-accent hover:text-blue-800"><i className="fas fa-calendar-alt"></i></button>
                                <button onClick={() => deleteMainExam(exam.id)} title="মুছে ফেলুন" className="text-danger hover:text-red-800"><i className="fas fa-trash"></i></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderRoomManagementTab = () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-sky-50 p-6 rounded-lg shadow-inner">
                <h3 className="text-lg font-bold text-primary mb-4">নতুন রুম যোগ করুন</h3>
                <form onSubmit={handleAddRoom} className="space-y-4">
                     <div>
                        <label className="font-medium">রুমের নাম/নম্বর</label>
                        <input type="text" value={roomName} onChange={e => setRoomName(e.target.value)} required className="w-full p-2 border rounded-md mt-1"/>
                    </div>
                    <div>
                        <label className="font-medium">ধারণক্ষমতা</label>
                        <input type="number" value={roomCapacity} onChange={e => setRoomCapacity(e.target.value)} required className="w-full p-2 border rounded-md mt-1"/>
                    </div>
                    <button type="submit" className="bg-secondary text-white font-bold py-2 px-6 rounded-lg hover:bg-accent transition">রুম যোগ করুন</button>
                </form>
            </div>
             <div className="bg-teal-50 p-6 rounded-lg shadow-inner">
                <h3 className="text-lg font-bold text-primary mb-4">রুমের তালিকা</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {Object.values(rooms).map(room => (
                        <div key={room.id} className="bg-white p-3 rounded-md shadow flex justify-between items-center">
                            <div>
                                <p className="font-bold">{room.name}</p>
                                <p className="text-sm text-gray-500">ধারণক্ষমতা: {room.capacity} জন</p>
                            </div>
                            <button onClick={() => deleteRoom(room.id)} title="মুছে ফেলুন" className="text-danger hover:text-red-800"><i className="fas fa-trash"></i></button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
    
    const renderSeatPlanTab = () => (
        <div className="space-y-6">
            <div className="bg-sky-50 p-6 rounded-lg shadow-inner">
                <h3 className="text-lg font-bold text-primary mb-4">সিট প্ল্যান তৈরি করুন</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select value={seatPlanExam} onChange={e => setSeatPlanExam(e.target.value)} className="w-full p-2 border rounded-md bg-white">
                        <option value="">পরীক্ষা নির্বাচন করুন</option>
                        {Object.values(mainExams).map(exam => <option key={exam.id} value={exam.id}>{exam.name}</option>)}
                    </select>
                    <select value={seatPlanClass} onChange={e => setSeatPlanClass(e.target.value)} className="w-full p-2 border rounded-md bg-white">
                        <option value="">ক্লাস নির্বাচন করুন</option>
                        {Object.values(classes).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <select multiple value={seatPlanRooms} onChange={e => setSeatPlanRooms(Array.from(e.target.selectedOptions, option => option.value))} className="w-full p-2 border rounded-md bg-white md:col-span-3" style={{ height: '150px' }}>
                        {Object.values(rooms).map(room => <option key={room.id} value={room.id}>{room.name} ({room.capacity})</option>)}
                    </select>
                </div>
                 <p className="text-sm text-gray-500 mt-2">একাধিক রুম নির্বাচন করতে Ctrl/Cmd চেপে ধরুন।</p>
            </div>
            <div className="bg-teal-50 p-6 rounded-lg shadow-inner">
                <h3 className="text-lg font-bold text-primary mb-4">তৈরিকৃত সিট প্ল্যান</h3>
                {seatPlanResult.warning && <p className="text-danger font-bold mb-4">{seatPlanResult.warning}</p>}
                <div dangerouslySetInnerHTML={{ __html: seatPlanResult.html }} />
            </div>
        </div>
    );

    const renderInvigilatorDutyTab = () => (
         <div className="space-y-6">
            <div className="bg-sky-50 p-6 rounded-lg shadow-inner">
                <h3 className="text-lg font-bold text-primary mb-4">পরিদর্শকের ডিউটি রোস্টার তৈরি করুন</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <select value={rosterExam} onChange={e => setRosterExam(e.target.value)} className="w-full p-2 border rounded-md bg-white">
                        <option value="">পরীক্ষা নির্বাচন করুন</option>
                        {Object.values(mainExams).map(exam => <option key={exam.id} value={exam.id}>{exam.name}</option>)}
                    </select>
                    <input type="date" value={rosterDate} onChange={e => setRosterDate(e.target.value)} className="w-full p-2 border rounded-md"/>
                </div>
            </div>
            <div className="bg-teal-50 p-6 rounded-lg shadow-inner">
                <h3 className="text-lg font-bold text-primary mb-4">রুম ও পরিদর্শক নির্বাচন করুন</h3>
                {rosterExam && rosterDate ? (
                     <div className="space-y-4">
                        {Object.values(rooms).map(room => (
                             <div key={room.id} className="grid grid-cols-2 items-center gap-4">
                                <label className="font-medium">রুম: {room.name}</label>
                                <select onChange={e => handleRosterTeacherChange(room.id, e.target.value)} defaultValue={invigilatorRosters[rosterExam]?.[rosterDate]?.[room.id] || ''} className="w-full p-2 border rounded-md bg-white">
                                    <option value="">শিক্ষক নির্বাচন করুন</option>
                                    {Object.values(teachers).map(teacher => <option key={teacher.id} value={teacher.id}>{teacher.name}</option>)}
                                </select>
                            </div>
                        ))}
                        <div className="text-right mt-4">
                           <button onClick={handleSaveRoster} className="bg-secondary text-white font-bold py-2 px-6 rounded-lg hover:bg-accent transition">রোস্টার সেভ করুন</button>
                        </div>
                     </div>
                ) : <p className="text-center text-gray-500">অনুগ্রহ করে পরীক্ষা ও তারিখ নির্বাচন করুন।</p>}
            </div>
        </div>
    );
    
    return (
        <div className="bg-slate-50 p-4 sm:p-6 rounded-xl shadow-lg">
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-2 sm:space-x-6 overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`whitespace-nowrap py-4 px-3 sm:px-4 border-b-2 font-bold text-sm transition-colors ${
                                activeTab === tab.id
                                    ? 'border-secondary text-secondary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="py-6">
                {activeTab === 'main-exam' && renderMainExamTab()}
                {activeTab === 'room-management' && renderRoomManagementTab()}
                {activeTab === 'seat-plan' && renderSeatPlanTab()}
                {activeTab === 'invigilator-duty' && renderInvigilatorDutyTab()}
            </div>
        </div>
    );
};

export default ExamManagement;