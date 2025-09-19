// types.ts

export type UserRole = 'admin' | 'teacher' | 'librarian' | 'department-head' | 'super-admin';

export interface User {
    uid: string;
    name: string;
    email: string;
    role: UserRole;
    password?: string;
    department?: string; // For department-head
    schoolId?: string; // For multi-tenant
}

export interface Student {
    id: string;
    name: string;
    roll: number;
    className: string;
    section: string;
    guardianName: string;
    contact: string;
    guardianEmail?: string;
    profilePicUrl?: string;
}

export interface Teacher {
    id: string;
    name: string;
    subject: string;
    phone: string;
    email: string;
    profilePicUrl?: string;
    department: string;
}

export interface Librarian {
    id: string;
    name: string;
    phone: string;
    email: string;
    profilePicUrl?: string;
}

export interface DepartmentHead {
    id: string;
    name: string;
    phone: string;
    email: string;
    profilePicUrl?: string;
    department: string;
}

export interface Class {
    id: string;
    name: string;
}

export interface Section {
    id: string;
    name: string;
}

export interface Schedule {
    id: string;
    day: string; // "1" for Sunday, "2" for Monday...
    startTime: string;
    endTime: string;
    className: string;
    section: string;
    subject: string;
    teacherId: string;
}

export interface Attendance {
    [date: string]: {
        [classSectionKey: string]: { // e.g., "Class Six___A"
            [studentId: string]: { status: 'present' | 'absent' | 'leave' };
        };
    };
}

export interface ClassTest {
    id: string;
    examName: string;
    className: string;
    section: string;
    subject: string;
    totalMarks: number;
    createdBy: string; // teacherId
}

export interface Marks {
    [classTestId: string]: {
        [studentId: string]: { marksObtained: number, totalMarks: number };
    };
}

export interface MainExam {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
}

export interface ExamRoutine {
    id: string;
    examId: string;
    date: string;
    day: string;
    subject: string;
    startTime: string;
    endTime: string;
    className: string;
}

export interface Room {
    id: string;
    name: string;
    capacity: number;
}

export interface SeatPlan {
    [examId: string]: {
        [date: string]: {
            [roomId: string]: string[]; // studentIds
        };
    };
}

export interface InvigilatorRoster {
    [examId: string]: {
        [date: string]: {
            [roomId:string]: string; // teacherId
        };
    };
}

export interface Book {
    id: string;
    title: string;
    author: string;
    totalQuantity: number;
    availableQuantity: number;
}

export interface IssuedBook {
    id: string;
    bookId: string;
    studentId: string;
    issueDate: string;
    dueDate: string;
    status: 'issued' | 'returned';
    returnDate?: string;
}

export interface Library {
    books: { [bookId: string]: Book };
    issuedBooks: { [issueId: string]: IssuedBook };
}

export interface StudentLeave {
    id: string;
    studentId: string;
    reason: string;
    startDate: string;
    endDate: string;
    status: 'pending' | 'approved' | 'rejected';
}

export interface Notice {
    id: string;
    title: string;
    content: string;
    date: string;
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

export interface Subscription {
    tier: string;
    status: 'Active' | 'Inactive';
    endDate: string;
}

export interface SchoolSettings {
    schoolName: string;
    schoolLogoUrl: string;
    principalName: string;
    principalSignatureUrl: string;
    premiumFeatures: {
        examManagement: boolean;
    };
}

// For multi-tenant version
export interface School {
    id: string;
    name: string;
    principalName: string;
    principalEmail: string;
    status: 'active' | 'inactive';
}