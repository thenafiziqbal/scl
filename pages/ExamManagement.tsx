import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import AdmitCardModal from '../components/AdmitCardModal';
import { MainExam, Student, ExamRoutine, Class, Section, Room, Teacher } from '../types';
import { exportHtmlToWord } from '../services/wordExporter';

const ExamManagement: React.FC = () => {
    const { 
        mainExams, addMainExam, 
        examRoutines, addExamRoutine,
        rooms, 
        seatPlans, updateSeatPlan,
        invigilatorRosters, updateInvigilatorRoster,
        teachers, students, classes, sections, settings
    } = useApp();

    const [activeTab, setActiveTab] = useState('exams');
    const [admitCardExam, setAdmitCardExam] = useState<MainExam | null>(null);

    // Exams Tab State
    const [examName, setExamName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Routines Tab State
    const [routineExamId, setRoutineExamId] = useState('');
    const [routineDate, setRoutineDate] = useState('');
    const [routineSubject, setRoutineSubject] = useState('');
    const [routineStart, setRoutineStart] = useState('');
    const [routineEnd, setRoutineEnd] = useState('');
    const [routineClass, setRoutineClass] = useState('সকল');

    // Seat Plan Tab State
    const [spExam, setSpExam] = useState('');
    const [spDate, setSpDate] = useState('');
    const [spClass, setSpClass] = useState('');
    const [spSection, setSpSection] = useState('');
    const [spRoom, setSpRoom] = useState('');
    const [spStudents, setSpStudents] = useState<string[]>([]);
    
    // Invigilators Tab State
    const [invExam, setInvExam] = useState('');
    const [invDate, setInvDate] = useState('');

    const handleAddExam = (e: React.FormEvent) => {
        e.preventDefault();
        if (!examName || !startDate || !endDate) return alert('অনুগ্রহ করে সকল তথ্য পূরণ করুন।');
        addMainExam({ name: examName, startDate, endDate });
        setExamName(''); setStartDate(''); setEndDate('');
        alert('নতুন পরীক্ষা সফলভাবে যোগ করা হয়েছে!');
    };
    
    const handleAddRoutine = (e: React.FormEvent) => {
        e.preventDefault();
        if (!routineExamId || !routineDate || !routineSubject || !routineStart || !routineEnd || !routineClass) return alert('অনুগ্রহ করে সকল তথ্য পূরণ করুন।');
        const day = new Date(routineDate).toLocaleDateString('bn-BD', { weekday: 'long' });
        addExamRoutine({ examId: routineExamId, date: routineDate, day, subject: routineSubject, startTime: routineStart, endTime: routineEnd, className: routineClass });
        setRoutineDate(''); setRoutineSubject(''); setRoutineStart(''); setRoutineEnd('');
        alert('রুটিনে নতুন এন্ট্রি যোগ করা হয়েছে!');
    };

    const handleAssignStudents = (e: React.FormEvent) => {
        e.preventDefault();
        if (!spExam || !spDate || !spRoom || spStudents.length === 0) return alert('অনুগ্রহ করে সকল তথ্য পূরণ করুন।');

        const existingStudentsInRoom = seatPlans[spExam]?.[spDate]?.[spRoom] || [];
        const newStudentSet = new Set([...existingStudentsInRoom, ...spStudents]);
        const combinedStudents = Array.from(newStudentSet);

        const roomCapacity = rooms[spRoom]?.capacity || 0;
        if (roomCapacity > 0 && combinedStudents.length > roomCapacity) {
            alert(`এই রুমের ধারণক্ষমতা ${roomCapacity} জন। আপনি মোট ${combinedStudents.length} জন ছাত্র বরাদ্দ করার চেষ্টা করছেন।`);
            return;
        }

        updateSeatPlan(spExam, spDate, spRoom, combinedStudents);
        alert(`${rooms[spRoom].name} কক্ষে ছাত্রদের সিট প্ল্যান আপডেট করা হয়েছে!`);
        setSpStudents([]); // Reset selection after assignment
    };

    const handleAssignInvigilator = (roomId: string, teacherId: string) => {
        if (!invExam || !invDate) return;
        updateInvigilatorRoster(invExam, invDate, roomId, teacherId);
        alert(`ডিউটি আপডেট করা হয়েছে!`);
    };
    
    const handleDownloadRoutine = () => {
        let htmlString = `<div style="text-align: center;"><h1>${settings.schoolName}</h1><h2>সকল পরীক্ষার রুটিন</h2></div><br/>`;
        Object.values(mainExams).forEach((exam: MainExam) => {
            htmlString += `<h3>${exam.name}</h3><table border="1"><thead><tr><th>তারিখ ও দিন</th><th>বিষয়</th><th>ক্লাস</th><th>সময়</th></tr></thead><tbody>`;
            // FIX: Add explicit types for `r`, `a`, `b` to resolve property access errors.
            const routinesForExam = Object.values(examRoutines).filter((r: ExamRoutine) => r.examId === exam.id).sort((a: ExamRoutine, b: ExamRoutine) => new Date(a.date).getTime() - new Date(b.date).getTime());
            routinesForExam.forEach((routine: ExamRoutine) => {
                htmlString += `<tr><td>${routine.date} (${routine.day})</td><td>${routine.subject}</td><td>${routine.className}</td><td>${routine.startTime} - ${routine.endTime}</td></tr>`;
            });
            htmlString += `</tbody></table><br/>`;
        });
        exportHtmlToWord(htmlString, 'Exam_Routines');
    };

    const studentsForPlan = useMemo(() => {
        if (!spClass || !spSection) return [];

        // FIX: Add explicit type for `s` to resolve property access errors.
        const studentsInClass = Object.values(students).filter((s: Student) => s.className === spClass && s.section === spSection);
        
        if (!spExam || !spDate) return studentsInClass;

        const assignedIdsOnDate = new Set<string>();
        const roomsForDate = seatPlans[spExam]?.[spDate];
        if (roomsForDate) {
            Object.values(roomsForDate).forEach(studentList => {
                (studentList as string[]).forEach(id => assignedIdsOnDate.add(id));
            });
        }
        
        return studentsInClass.filter(student => !assignedIdsOnDate.has(student.id));

    }, [students, spClass, spSection, seatPlans, spExam, spDate]);

    useEffect(() => {
        setSpStudents([]);
    }, [spClass, spSection, spExam, spDate]);

    const tabs = [
        { id: 'exams', label: 'পরীক্ষা পরিচালনা' },
        { id: 'routines', label: 'রুটিন' },
        { id: 'seat-plan', label: 'সিট প্ল্যান' },
        { id: 'invigilators', label: 'পরিদর্শক ডিউটি' },
    ];

    const renderExamsTab = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-light p-6 rounded-lg">
                <h3 className="text-lg font-bold text-primary mb-4">নতুন পরীক্ষা যোগ করুন</h3>
                 <form onSubmit={handleAddExam} className="space-y-4">
                    <div>
                        <label className="font-medium text-sm text-accent">পরীক্ষার নাম</label>
                        <input type="text" value={examName} onChange={e => setExamName(e.target.value)} required className="w-full p-2 border rounded-md mt-1" />
                    </div>
                    <div>
                        <label className="font-medium text-sm text-accent">শুরুর তারিখ</label>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required className="w-full p-2 border rounded-md mt-1" />
                    </div>
                    <div>
                        <label className="font-medium text-sm text-accent">শেষ তারিখ</label>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required className="w-full p-2 border rounded-md mt-1" />
                    </div>
                    <button type="submit" className="w-full bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-accent transition">পরীক্ষা যোগ করুন</button>
                </form>
            </div>
            <div className="lg:col-span-2">
                <h3 className="text-lg font-bold text-primary mb-4">সকল পরীক্ষার তালিকা</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-sidebar text-white">
                            <tr>
                                <th className="p-3">পরীক্ষার নাম</th>
                                <th className="p-3">შুরুর তারিখ</th>
                                <th className="p-3">শেষ তারিখ</th>
                                <th className="p-3">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.values(mainExams).map((exam: MainExam) => (
                                <tr key={exam.id} className="border-b">
                                    <td className="p-3 text-accent font-medium">{exam.name}</td>
                                    <td className="p-3 text-gray-700">{exam.startDate}</td>
                                    <td className="p-3 text-gray-700">{exam.endDate}</td>
                                    <td className="p-3">
                                        <button onClick={() => setAdmitCardExam(exam)} className="bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600">প্রবেশপত্র</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderRoutinesTab = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-1 bg-light p-6 rounded-lg">
                <h3 className="text-lg font-bold text-primary mb-4">রুটিনে যোগ করুন</h3>
                 <form onSubmit={handleAddRoutine} className="space-y-3">
                    <select value={routineExamId} onChange={e => setRoutineExamId(e.target.value)} required className="w-full p-2 border rounded-md">
                        <option value="">-- পরীক্ষা নির্বাচন করুন --</option>
                        {/* FIX: Add explicit type for `e` to resolve property access errors. */}
                        {Object.values(mainExams).map((e: MainExam) => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                    <input type="date" value={routineDate} onChange={e => setRoutineDate(e.target.value)} required className="w-full p-2 border rounded-md" />
                    <input type="text" placeholder="বিষয়" value={routineSubject} onChange={e => setRoutineSubject(e.target.value)} required className="w-full p-2 border rounded-md" />
                    <div className="grid grid-cols-2 gap-2">
                        <input type="time" title="শুরুর সময়" value={routineStart} onChange={e => setRoutineStart(e.target.value)} required className="w-full p-2 border rounded-md" />
                        <input type="time" title="শেষ সময়" value={routineEnd} onChange={e => setRoutineEnd(e.target.value)} required className="w-full p-2 border rounded-md" />
                    </div>
                     <select value={routineClass} onChange={e => setRoutineClass(e.target.value)} required className="w-full p-2 border rounded-md">
                        <option value="সকল">সকল ক্লাস</option>
                        {/* FIX: Add explicit type for `c` to resolve property access errors. */}
                        {Object.values(classes).map((c: Class) => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                    <button type="submit" className="w-full bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-accent transition">যোগ করুন</button>
                </form>
            </div>
            <div className="lg:col-span-2">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-primary">পরীক্ষার রুটিন</h3>
                    <button onClick={handleDownloadRoutine} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition text-sm flex items-center gap-2">
                         <i className="fas fa-file-word"></i> রুটিন ডাউনলোড করুন (Word)
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-sidebar text-white">
                            <tr>
                                <th className="p-3">পরীক্ষা</th>
                                <th className="p-3">তারিখ</th>
                                <th className="p-3">বিষয়</th>
                                <th className="p-3">সময়</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* FIX: Add explicit types for `a`, `b` to resolve property access errors. */}
                            {Object.values(examRoutines).sort((a: ExamRoutine, b: ExamRoutine) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((routine: ExamRoutine) => (
                                <tr key={routine.id} className="border-b">
                                    <td className="p-3 text-gray-800">{mainExams[routine.examId]?.name}</td>
                                    <td className="p-3 text-gray-700">{routine.date} ({routine.day})</td>
                                    <td className="p-3 text-accent font-medium">{routine.subject}</td>
                                    <td className="p-3 text-gray-700">{routine.startTime} - {routine.endTime}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderSeatPlanTab = () => {
        const currentPlan = seatPlans[spExam]?.[spDate] || {};
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-light p-6 rounded-lg">
                    <h3 className="text-lg font-bold text-primary mb-4">ছাত্রদের আসন বরাদ্দ করুন</h3>
                    <form onSubmit={handleAssignStudents} className="space-y-3">
                        <select value={spExam} onChange={e => setSpExam(e.target.value)} required className="w-full p-2 border rounded-md">
                            <option value="">-- পরীক্ষা নির্বাচন --</option>
                            {/* FIX: Add explicit type for `e` to resolve property access errors. */}
                            {Object.values(mainExams).map((e: MainExam) => <option key={e.id} value={e.id}>{e.name}</option>)}
                        </select>
                        <input type="date" value={spDate} onChange={e => setSpDate(e.target.value)} required className="w-full p-2 border rounded-md" />
                        <select value={spClass} onChange={e => setSpClass(e.target.value)} required className="w-full p-2 border rounded-md">
                            <option value="">-- ক্লাস নির্বাচন --</option>
                            {/* FIX: Add explicit type for `c` to resolve property access errors. */}
                            {Object.values(classes).map((c: Class) => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                        <select value={spSection} onChange={e => setSpSection(e.target.value)} required className="w-full p-2 border rounded-md">
                            <option value="">-- সেকশন নির্বাচন --</option>
                            {/* FIX: Add explicit type for `s` to resolve property access errors. */}
                            {Object.values(sections).map((s: Section) => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>
                        <select value={spRoom} onChange={e => setSpRoom(e.target.value)} required className="w-full p-2 border rounded-md">
                            <option value="">-- রুম নির্বাচন --</option>
                            {/* FIX: Add explicit type for `r` to resolve property access errors. */}
                            {Object.values(rooms).map((r: Room) => <option key={r.id} value={r.id}>{r.name} (ধারণক্ষমতা: {r.capacity})</option>)}
                        </select>
                        <div>
                            <label className="font-medium text-sm text-accent">ছাত্র নির্বাচন করুন (মাল্টি-সিলেক্ট)</label>
                            <select multiple value={spStudents} onChange={e => setSpStudents(Array.from(e.target.selectedOptions, option => option.value))} required className="w-full h-40 p-2 border rounded-md mt-1">
                                {studentsForPlan.length > 0 ? (
                                    // FIX: Add explicit type for `s` to resolve property access errors.
                                    studentsForPlan.map((s: Student) => <option key={s.id} value={s.id}>{s.name} (রোল: {s.roll})</option>)
                                ) : (
                                    <option disabled>এই ক্লাস/সেকশনের কোনো ছাত্র বাকি নেই</option>
                                )}
                            </select>
                        </div>
                        <button type="submit" className="w-full bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-accent transition">বরাদ্দ করুন</button>
                    </form>
                </div>
                 <div className="lg:col-span-2">
                    <h3 className="text-lg font-bold text-accent mb-4">বর্তমান সিট প্ল্যান (নির্বাচিত তারিখের জন্য)</h3>
                    <div className="space-y-4 bg-white p-4 rounded-lg shadow-inner max-h-[60vh] overflow-y-auto">
                        {Object.keys(currentPlan).length > 0 ? Object.entries(currentPlan).map(([roomId, studentIds]) => (
                            <div key={roomId} className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                                <h4 className="font-bold text-blue-800 border-b border-blue-200 pb-2 mb-2 flex justify-between items-center">
                                    <span>{rooms[roomId]?.name}</span>
                                    <span className="text-sm font-normal bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                                        বরাদ্দ: {(studentIds as string[]).length} / {rooms[roomId]?.capacity || 'N/A'}
                                    </span>
                                </h4>
                                <ul className="list-decimal list-inside mt-2 text-sm columns-1 md:columns-2 space-y-1">
                                    {(studentIds as string[]).map(sId => (
                                        <li key={sId} className="text-gray-700">
                                           {students[sId]?.name} <span className="text-gray-500">(রোল: {students[sId]?.roll})</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )) : (
                            <div className="text-center py-10">
                                <i className="fas fa-search text-4xl text-gray-300 mb-2"></i>
                                <p className="text-gray-500">অনুগ্রহ করে পরীক্ষা ও তারিখ নির্বাচন করে সিট প্ল্যান দেখুন।</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };
    
    const renderInvigilatorsTab = () => {
        const roomsForDuty = seatPlans[invExam]?.[invDate] ? Object.keys(seatPlans[invExam][invDate]) : [];
        const currentRoster = invigilatorRosters[invExam]?.[invDate] || {};
        return (
             <div className="space-y-6">
                 <div className="bg-light p-4 rounded-lg flex flex-wrap gap-4 items-end">
                    <div>
                        <label className="font-medium text-sm text-gray-700">পরীক্ষা</label>
                        <select value={invExam} onChange={e => setInvExam(e.target.value)} className="w-full p-2 border rounded-md bg-white mt-1">
                            <option value="">-- পরীক্ষা নির্বাচন --</option>
                            {/* FIX: Add explicit type for `e` to resolve property access errors. */}
                            {Object.values(mainExams).map((e: MainExam) => <option key={e.id} value={e.id}>{e.name}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="font-medium text-sm text-gray-700">তারিখ</label>
                        <input type="date" value={invDate} onChange={e => setInvDate(e.target.value)} className="w-full p-2 border rounded-md bg-white mt-1" />
                    </div>
                 </div>
                 
                 <h3 className="text-lg font-bold text-primary">পরিদর্শক ডিউটি রোস্টার</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {roomsForDuty.length > 0 ? roomsForDuty.map(roomId => (
                        <div key={roomId} className="bg-light p-4 rounded-lg">
                            <h4 className="font-bold text-accent mb-2">{rooms[roomId]?.name}</h4>
                            <select 
                                value={currentRoster[roomId] || ''}
                                onChange={e => handleAssignInvigilator(roomId, e.target.value)}
                                className="w-full p-2 border rounded-md bg-white"
                            >
                                <option value="">-- পরিদর্শক নির্বাচন করুন --</option>
                                {/* FIX: Add explicit type for `t` to resolve property access errors. */}
                                {Object.values(teachers).map((t: Teacher) => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>
                    )) : <p className="text-gray-500 md:col-span-3">অনুগ্রহ করে পরীক্ষা ও তারিখ নির্বাচন করুন।</p>}
                 </div>
            </div>
        );
    };

    return (
        <>
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-6 overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
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
                    {activeTab === 'exams' && renderExamsTab()}
                    {activeTab === 'routines' && renderRoutinesTab()}
                    {activeTab === 'seat-plan' && renderSeatPlanTab()}
                    {activeTab === 'invigilators' && renderInvigilatorsTab()}
                </div>
            </div>
            {admitCardExam && <AdmitCardModal exam={admitCardExam} onClose={() => setAdmitCardExam(null)} />}
        </>
    );
};

export default ExamManagement;