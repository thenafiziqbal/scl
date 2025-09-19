export type UserRole = 'admin' | 'teacher' | 'librarian';

export interface User {
    uid: string;
    email: string;
    name: string;
    role: UserRole;
    password?: string; // For mock authentication
    profilePicUrl?: string;
    subject?: string; // For teachers
    phone?: string; // For staff
}

export interface Student {
    id: string;
    name: string;
    roll: number;
    className: string;
    section: string;
    guardianName: string;
    contact: string;
    profilePicUrl?: string;
}

export interface Teacher {
    id: string;
    name: string;
    subject: string;
    phone: string;
    email: string;
    profilePicUrl?: string;
}

export interface Librarian {
    id: string;
    name: string;
    phone: string;
    email: string;
    profilePicUrl?: string;
}

export interface Schedule {
    id: string;
    day: string; // "0" for Saturday, "1" for Sunday, etc.
    className: string;
    section: string;
    subject: string;
    teacherId: string;
    startTime: string;
    endTime: string;
}

export interface ClassTest {
    id: string;
    examName: string;
    className: string;
    section: string;
    subject: string;
    totalMarks: number;
    createdBy: string; // teacher UID
}

export interface Mark {
    [studentId: string]: {
        marksObtained: number;
    };
}

export interface MarksSheet {
    [examId: string]: Mark;
}

export interface SchoolSettings {
    schoolName: string;
    schoolLogoUrl?: string;
    principalName?: string;
    principalSignatureUrl?: string;
    premiumFeatures: {
        examManagement: boolean;
    };
}

export interface Class {
    id: string;
    name: string;
}

export interface Section {
    id: string;
    name: string;
}

export interface StudentLeave {
    id: string;
    studentId: string;
    reason: string;
    startDate: string;
    endDate: string;
}

export interface AttendanceRecord {
    status: 'present' | 'absent';
}

export interface DailyAttendance {
    [studentId: string]: AttendanceRecord;
}

export interface ClassAttendance {
    [classSection: string]: DailyAttendance;
}

export interface Attendance {
    [date: string]: ClassAttendance;
}

export interface Subscription {
    status: 'Active' | 'Inactive';
    tier: 'None' | 'Monthly' | 'Yearly';
}

export interface Book {
    id: string;
    title: string;
    author: string;
    isbn?: string;
    totalQuantity: number;
    availableQuantity: number;
}

export interface IssuedBook {
    id: string;
    bookId: string;
    studentId: string;
    issueDate: string;
    dueDate: string;
    returnDate: string | null;
    status: 'issued' | 'returned';
}

export interface Library {
    books: { [id: string]: Book };
    issuedBooks: { [id: string]: IssuedBook };
}

export interface MainExam {
    id: string;
    name: string;
    date: string; // Start date
    routine?: { [key: string]: string }; // e.g., { 'c1_subject': 'Math', 'c1_date': '2024-08-01', 'c1_time': '09:00' }
}

export interface Room {
    id: string;
    name: string;
    capacity: number;
}

export interface InvigilatorRoster {
    [examId: string]: {
        [date: string]: {
            [roomId: string]: string; // teacherId
        };
    };
}

export interface Notice {
    id: string;
    title: string;
    content: string;
    date: string; // YYYY-MM-DD
}

export interface FeeInvoice {
    id: string;
    name: string;
    amount: number;
    dueDate: string;
}

export interface StudentPayment {
    id: string;
    studentId: string;
    invoiceId: string;
    amountPaid: number;
    paymentDate: string;
}