import { User, Student, Teacher, Librarian, DepartmentHead, Class, Section, Schedule, Attendance, ClassTest, Marks, MainExam, ExamRoutine, Room, SeatPlan, InvigilatorRoster, Library, StudentLeave, Notice, FeeInvoice, StudentPayment, Subscription, SchoolSettings, UserRole } from '../types';

type TeacherWithUser = Teacher & { uid: string; role: UserRole; password?: string; };
type LibrarianWithUser = Librarian & { uid: string; role: UserRole; password?: string; };
type DepartmentHeadWithUser = DepartmentHead & { uid: string; role: UserRole; password?: string; };


export const mockUsers: { [uid: string]: User & {department?: string} } = {
    'user1': { uid: 'user1', name: 'অ্যাডমিন', email: 'admin@school.com', role: 'admin', password: 'password' },
    'user2': { uid: 'user2', name: 'মোঃ রফিক', email: 'teacher@school.com', role: 'teacher', password: 'password' },
    'user3': { uid: 'user3', name: 'শাহানা বেগম', email: 'librarian@school.com', role: 'librarian', password: 'password' },
    'user4': { uid: 'user4', name: 'ডঃ আনোয়ার হোসেন', email: 'head@school.com', role: 'department-head', password: 'password', department: 'বিজ্ঞান বিভাগ'},
    'user5': { uid: 'user5', name: 'Super Admin', email: 'super@admin.com', role: 'super-admin', password: 'password' },
    'user6': { uid: 'user6', name: 'আরিফুল ইসলাম', email: 'teacher2@school.com', role: 'teacher', password: 'password'},
};

export const mockStudents: { [id: string]: Student } = {
    'stu1': { id: 'stu1', name: 'আকাশ আহমেদ', roll: 1, className: 'দশম শ্রেণী', section: 'ক', guardianName: 'নুর আহমেদ', contact: '01712345678', guardianEmail: 'guardian1@email.com', profilePicUrl: 'https://i.pravatar.cc/150?u=stu1' },
    'stu2': { id: 'stu2', name: 'বাতাসি খাতুন', roll: 2, className: 'দশম শ্রেণী', section: 'ক', guardianName: 'আলী খাতুন', contact: '01812345678', guardianEmail: 'guardian2@email.com', profilePicUrl: 'https://i.pravatar.cc/150?u=stu2' },
    'stu3': { id: 'stu3', name: 'মেঘলা চৌধুরী', roll: 1, className: 'নবম শ্রেণী', section: 'খ', guardianName: 'রহমান চৌধুরী', contact: '01912345678', profilePicUrl: 'https://i.pravatar.cc/150?u=stu3' },
    'stu4': { id: 'stu4', name: 'সাগর ইসলাম', roll: 3, className: 'দশম শ্রেণী', section: 'ক', guardianName: 'শফিক ইসলাম', contact: '01612345678', profilePicUrl: 'https://i.pravatar.cc/150?u=stu4' },
};

export const mockTeachers: { [id: string]: TeacherWithUser } = {
    'tech1': { id: 'tech1', uid: 'user2', role: 'teacher', name: 'মোঃ রফিক', subject: 'গণিত', phone: '01777777777', email: 'teacher@school.com', profilePicUrl: 'https://i.pravatar.cc/150?u=tech1', department: 'বিজ্ঞান বিভাগ' },
    'tech2': { id: 'tech2', uid: 'user6', role: 'teacher', name: 'আরিফুল ইসলাম', subject: 'বাংলা', phone: '01888888888', email: 'teacher2@school.com', profilePicUrl: 'https://i.pravatar.cc/150?u=tech2', department: 'কলা বিভাগ' },
};

export const mockLibrarians: { [id: string]: LibrarianWithUser } = {
    'lib1': { id: 'lib1', uid: 'user3', role: 'librarian', name: 'শাহানা বেগম', phone: '01999999999', email: 'librarian@school.com', profilePicUrl: 'https://i.pravatar.cc/150?u=lib1' },
};

export const mockDepartmentHeads: { [id: string]: DepartmentHeadWithUser } = {
    'head1': { id: 'head1', uid: 'user4', role: 'department-head', name: 'ডঃ আনোয়ার হোসেন', department: 'বিজ্ঞান বিভাগ', phone: '01555555555', email: 'head@school.com', profilePicUrl: 'https://i.pravatar.cc/150?u=head1' },
};

export const mockClasses: { [id: string]: Class } = {
    'cls1': { id: 'cls1', name: 'নবম শ্রেণী' },
    'cls2': { id: 'cls2', name: 'দশম শ্রেণী' },
};

export const mockSections: { [id: string]: Section } = {
    'sec1': { id: 'sec1', name: 'ক' },
    'sec2': { id: 'sec2', name: 'খ' },
};

export const mockSchedules: { [id: string]: Schedule } = {
    'sch1': { id: 'sch1', day: '1', startTime: '10:00', endTime: '11:00', className: 'দশম শ্রেণী', section: 'ক', subject: 'গণিত', teacherId: 'tech1' },
    'sch2': { id: 'sch2', day: '2', startTime: '11:00', endTime: '12:00', className: 'নবম শ্রেণী', section: 'খ', subject: 'বাংলা', teacherId: 'tech2' },
};

export const mockAttendance: Attendance = {
    [new Date().toISOString().slice(0, 10)]: {
        'দশম শ্রেণী___ক': {
            'stu1': { status: 'present' },
            'stu2': { status: 'absent' },
            'stu4': { status: 'present' },
        }
    }
};

export const mockClassTests: { [id: string]: ClassTest } = {
    'ct1': { id: 'ct1', examName: 'গণিত প্রথম কুইজ', className: 'দশম শ্রেণী', section: 'ক', subject: 'গণিত', totalMarks: 20, createdBy: 'user2' },
};

export const mockMarks: Marks = {
    'ct1': {
        'stu1': { marksObtained: 18, totalMarks: 20 },
        'stu2': { marksObtained: 15, totalMarks: 20 },
    }
};

export const mockMainExams: { [id: string]: MainExam } = {
    'exam1': { id: 'exam1', name: 'বার্ষিক পরীক্ষা', startDate: '2024-12-10', endDate: '2024-12-25' },
};

export const mockExamRoutines: { [id: string]: ExamRoutine } = {
    'er1': { id: 'er1', examId: 'exam1', date: '2024-12-12', day: 'বৃহস্পতিবার', subject: 'বাংলা ১ম পত্র', startTime: '10:00', endTime: '13:00', className: 'সকল' },
};

export const mockRooms: { [id: string]: Room } = {
    'room1': { id: 'room1', name: '১০১', capacity: 30 },
    'room2': { id: 'room2', name: '১০২', capacity: 30 },
};

export const mockSeatPlans: SeatPlan = {};
export const mockInvigilatorRosters: InvigilatorRoster = {};

export const mockLibrary: Library = {
    books: {
        'book1': { id: 'book1', title: 'হাজার বছর ধরে', author: 'জহির রায়হান', totalQuantity: 5, availableQuantity: 3 },
        'book2': { id: 'book2', title: 'আমার বন্ধু রাশেদ', author: 'মুহম্মদ জাফর ইকবাল', totalQuantity: 3, availableQuantity: 3 },
    },
    issuedBooks: {
        'issue1': { id: 'issue1', bookId: 'book1', studentId: 'stu1', issueDate: '2024-07-01', dueDate: '2024-07-15', status: 'issued' },
    }
};

export const mockLeaves: { [id: string]: StudentLeave } = {
    'leave1': { id: 'leave1', studentId: 'stu3', reason: 'অসুস্থতা', startDate: '2024-07-20', endDate: '2024-07-22', status: 'approved' },
};

export const mockNotices: { [id: string]: Notice } = {
    'notice1': { id: 'notice1', title: 'স্কুল বন্ধের নোটিশ', content: 'ঈদের ছুটির জন্য স্কুল আগামী সপ্তাহ বন্ধ থাকবে।', date: '2024-07-15' },
};

export const mockFeeInvoices: { [id: string]: FeeInvoice } = {
    'inv1': { id: 'inv1', name: 'মাসিক বেতন (জুলাই)', amount: 1200, dueDate: '2024-07-10' },
};

export const mockStudentPayments: { [id: string]: StudentPayment } = {
    'pay1': { id: 'pay1', studentId: 'stu1', invoiceId: 'inv1', amountPaid: 1200, paymentDate: '2024-07-05' },
};

export const mockSubscription: Subscription = {
    tier: 'প্রিমিয়াম',
    status: 'Active',
    endDate: '2025-12-31'
};

export const mockSettings: SchoolSettings = {
    schoolName: 'আমার আদর্শ স্কুল',
    schoolLogoUrl: 'https://i.ibb.co/6yT1WfX/school-logo-placeholder.png',
    principalName: 'মোঃ আব্দুল্লাহ',
    principalSignatureUrl: 'https://i.ibb.co/7zJ2S5b/signature-placeholder.png',
    premiumFeatures: {
        examManagement: true,
    }
};
