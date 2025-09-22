
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import IDCardModal from '../components/IDCardModal';
import { exportHtmlToWord } from '../services/wordExporter';
import { IssuedBook, StudentPayment, Student, FeeInvoice } from '../types';

const StudentProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { students, classTests, marks, library, settings, feeInvoices, studentPayments, attendance } = useApp();
    const [idCardStudent, setIdCardStudent] = useState<Student | null>(null);

    if (!id) return <p>ছাত্রের ID পাওয়া যায়নি।</p>;
    const student = students[id];

    if (!student) return <p>ছাত্র খুঁজে পাওয়া যায়নি।</p>;
    
    const studentMarks = Object.entries(marks)
        .map(([examId, examMarks]) => {
            if (examMarks[id]) {
                const examDetails = classTests[examId];
                if (examDetails) {
                    return { ...examDetails, ...examMarks[id] };
                }
            }
            return null;
        })
        .filter(Boolean);
        
    // FIX: Add explicit type for `issue` to resolve property access errors.
    const studentIssuedBooks = Object.values(library.issuedBooks)
        .filter((issue: IssuedBook) => issue.studentId === id)
        .map((issue: IssuedBook) => ({ ...issue, bookTitle: library.books[issue.bookId]?.title || 'Unknown Book' }));

    const studentFeeHistory = Object.values(feeInvoices).map((invoice: FeeInvoice) => {
        // FIX: Add explicit type for `p` to resolve property access errors.
        const payment = Object.values(studentPayments).find((p: StudentPayment) => p.studentId === id && p.invoiceId === invoice.id);
        return {
            ...invoice,
            status: payment ? 'Paid' : 'Unpaid',
            paymentDate: payment?.paymentDate,
        };
    });
        
    const getGrade = (percentage: number) => {
        if (percentage >= 80) return 'A+';
        if (percentage >= 70) return 'A';
        if (percentage >= 60) return 'A-';
        if (percentage >= 50) return 'B';
        if (percentage >= 40) return 'C';
        if (percentage >= 33) return 'D';
        return 'F';
    };

    const calculateAttendance = () => {
        const classSectionKey = `${student.className}___${student.section}`;
        let totalDays = 0;
        let presentDays = 0;

        for (const date in attendance) {
            if (attendance[date][classSectionKey]) {
                totalDays++;
                if (attendance[date][classSectionKey][student.id]?.status === 'present') {
                    presentDays++;
                }
            }
        }
        if (totalDays === 0) return { percentage: 0, text: "N/A" };
        const percentage = Math.round((presentDays / totalDays) * 100);
        return { percentage, text: `${percentage}% (${presentDays}/${totalDays} দিন)` };
    };

    const attendanceData = calculateAttendance();
    
    const generateTranscriptWord = () => {
        let marksHtml = `
            <table border="1">
                <thead>
                    <tr>
                        <th>পরীক্ষার নাম</th>
                        <th>বিষয়</th>
                        <th>মোট নম্বর</th>
                        <th>প্রাপ্ত নম্বর</th>
                        <th>শতাংশ</th>
                        <th>গ্রেড</th>
                    </tr>
                </thead>
                <tbody>
        `;
        studentMarks.forEach(mark => {
            if (mark) {
                const percentage = (mark.marksObtained / mark.totalMarks) * 100;
                marksHtml += `
                    <tr>
                        <td>${mark.examName}</td>
                        <td>${mark.subject}</td>
                        <td style="text-align: center;">${mark.totalMarks}</td>
                        <td style="text-align: center;">${mark.marksObtained}</td>
                        <td style="text-align: center;">${percentage.toFixed(2)}%</td>
                        <td style="text-align: center;">${getGrade(percentage)}</td>
                    </tr>
                `;
            }
        });
        marksHtml += `</tbody></table>`;
        
        const signatureHtml = `
            <div style="float: right; text-align: center; margin-top: 60px;">
                <p>_________________________</p>
                <p>${settings.principalName || ''}</p>
                <p><strong>অধ্যক্ষ</strong></p>
            </div>
        `;

        const htmlString = `
            <div>
                <div style="text-align: center;">
                    <h1>${settings.schoolName}</h1>
                    <h2>একাডেমিক ট্রান্সক্রিপ্ট</h2>
                </div>
                <br/>
                <p><strong>ছাত্রের নাম:</strong> ${student.name}</p>
                <p><strong>ক্লাস:</strong> ${student.className} (${student.section})</p>
                <p><strong>রোল:</strong> ${student.roll}</p>
                <p><strong>উপস্থিতির হার:</strong> ${attendanceData.text}</p>
                <br/>
                ${marksHtml}
                <br/>
                ${signatureHtml}
            </div>
        `;

        exportHtmlToWord(htmlString, `${student.name}_ট্রান্সক্রিপ্ট`);
    };


    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row items-center gap-6">
                <img 
                    src={student.profilePicUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random&color=fff&size=128`}
                    alt={student.name} 
                    className="w-32 h-32 rounded-full object-cover border-4 border-secondary"
                    onError={(e) => {
                        const fallbackSrc = 'https://placehold.co/128x128/CCCCCC/FFFFFF?text=Photo';
                        if (e.currentTarget.src !== fallbackSrc) {
                            e.currentTarget.src = fallbackSrc;
                        }
                    }}
                />
                <div className="text-center md:text-left flex-grow">
                    <h2 className="text-3xl font-bold text-primary">{student.name}</h2>
                    <p className="text-gray-600"><strong>ক্লাস:</strong> {student.className} ({student.section})</p>
                    <p className="text-gray-600"><strong>রোল:</strong> {student.roll}</p>
                    <p className="text-gray-600"><strong>অভিভাবকের নাম:</strong> {student.guardianName}</p>
                    <p className="text-gray-600"><strong>যোগাযোগ:</strong> {student.contact}</p>
                    {student.guardianEmail && <p className="text-gray-600"><strong>অভিভাবকের ইমেইল:</strong> {student.guardianEmail}</p>}
                    <div className="mt-2 pt-2 border-t">
                        <p className="text-gray-600 font-semibold"><strong>উপস্থিতির হার:</strong> <span className="text-green-600 font-bold">{attendanceData.text}</span></p>
                    </div>
                </div>
                 <div className="md:ml-auto flex flex-col sm:flex-row gap-2 self-center md:self-start">
                    <button onClick={() => setIdCardStudent(student)} className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition flex items-center gap-2">
                        <i className="fas fa-id-card"></i> আইডি কার্ড
                    </button>
                    <button onClick={generateTranscriptWord} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                        <i className="fas fa-file-word"></i> ট্রান্সক্রিপ্ট (Word)
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold text-primary mb-4">ক্লাস টেস্টের ফলাফল</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-sidebar text-white">
                                <tr>
                                    <th className="p-3 text-left">পরীক্ষার নাম</th>
                                    <th className="p-3 text-left">বিষয়</th>
                                    <th className="p-3 text-center">প্রাপ্ত নম্বর</th>
                                    <th className="p-3 text-center">মোট নম্বর</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentMarks.map(mark => (
                                    mark && <tr key={mark.id} className="border-b">
                                        <td className="p-3 text-gray-800">{mark.examName}</td>
                                        <td className="p-3 text-gray-700">{mark.subject}</td>
                                        <td className="p-3 text-center text-accent font-semibold">{mark.marksObtained}</td>
                                        <td className="p-3 text-center text-gray-700">{mark.totalMarks}</td>
                                    </tr>
                                ))}
                                {studentMarks.length === 0 && <tr><td colSpan={4} className="p-3 text-center text-gray-500">কোনো ফলাফল পাওয়া যায়নি।</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold text-primary mb-4">লাইব্রেরি থেকে গৃহীত বই</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                             <thead className="bg-sidebar text-white">
                                <tr>
                                    <th className="p-3 text-left">বইয়ের নাম</th>
                                    <th className="p-3 text-left">ইস্যুর তারিখ</th>
                                    <th className="p-3 text-left">ফেরতের তারিখ</th>
                                    <th className="p-3 text-center">স্ট্যাটাস</th>
                                </tr>
                            </thead>
                            <tbody>
                               {studentIssuedBooks.map(issue => (
                                   <tr key={issue.id} className="border-b">
                                       <td className="p-3 text-gray-800">{issue.bookTitle}</td>
                                       <td className="p-3 text-gray-700">{issue.issueDate}</td>
                                       <td className="p-3 text-gray-700">{issue.dueDate}</td>
                                       <td className="p-3 text-center">
                                           <span className={`px-2 py-1 text-xs font-semibold rounded-full ${issue.status === 'issued' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>
                                               {issue.status === 'issued' ? 'ইস্যুকৃত' : 'ফেরত হয়েছে'}
                                           </span>
                                       </td>
                                   </tr>
                               ))}
                               {studentIssuedBooks.length === 0 && <tr><td colSpan={4} className="p-3 text-center text-gray-500">কোনো বই ইস্যু করা হয়নি।</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-primary mb-4">ফি প্রদানের ইতিহাস</h3>
                 <div className="overflow-x-auto">
                    <table className="w-full">
                         <thead className="bg-sidebar text-white">
                            <tr>
                                <th className="p-3 text-left">ফি-এর বিবরণ</th>
                                <th className="p-3 text-right">পরিমাণ (৳)</th>
                                <th className="p-3 text-center">স্ট্যাটাস</th>
                                <th className="p-3 text-center">পেমেন্টের তারিখ</th>
                            </tr>
                        </thead>
                        <tbody>
                           {studentFeeHistory.map(item => (
                               <tr key={item.id} className="border-b">
                                   <td className="p-3 text-gray-800">{item.name}</td>
                                   <td className="p-3 text-gray-700 text-right">{item.amount.toFixed(2)}</td>
                                   <td className="p-3 text-center">
                                       <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.status === 'Paid' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                           {item.status === 'Paid' ? 'পরিশোধিত' : 'অপরিশোধিত'}
                                       </span>
                                   </td>
                                   <td className="p-3 text-center text-gray-600">{item.paymentDate || '---'}</td>
                               </tr>
                           ))}
                           {studentFeeHistory.length === 0 && <tr><td colSpan={4} className="p-3 text-center text-gray-500">কোনো ফি-এর তথ্য পাওয়া যায়নি।</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {idCardStudent && (
                 <IDCardModal
                    student={idCardStudent}
                    settings={settings}
                    onClose={() => setIdCardStudent(null)}
                />
            )}
        </div>
    );
};

export default StudentProfile;
