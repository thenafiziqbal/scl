import { User, SchoolSettings, Student, Teacher, Librarian, Schedule, ClassTest, MarksSheet, Class, Section, StudentLeave, Attendance, Subscription, Library, MainExam, Room, InvigilatorRoster, Notice, FeeInvoice, StudentPayment } from '../types';

// Single source of truth for all users who can log in.
export const MOCK_USERS: { [uid: string]: User } = {
    'admin1': { uid: 'admin1', email: 'admin@school.com', name: 'অধ্যক্ষ', role: 'admin', password: 'password' },
    'teacher1': { uid: 'teacher1', email: 'teacher@school.com', name: 'মোঃ রফিক হাসান', role: 'teacher', subject: 'গণিত', password: 'password' },
    'teacher2': { uid: 'teacher2', email: 'teacher2@school.com', name: 'শাহনাজ পারভীন', role: 'teacher', subject: 'বাংলা', password: 'password' },
    'librarian1': { uid: 'librarian1', email: 'librarian@school.com', name: 'সেলিনা আক্তার', role: 'librarian', password: 'password' }
};


export const MOCK_SCHOOL_SETTINGS: SchoolSettings = {
    schoolName: 'মডার্ন পাবলিক স্কুল',
    schoolLogoUrl: 'https://i.ibb.co/6yT1WfX/school-logo-placeholder.png',
    principalName: 'ডঃ মোঃ আবুল কালাম',
    principalSignatureUrl: 'https://i.ibb.co/7C1mHk8/signature-placeholder.png',
    premiumFeatures: {
        examManagement: true,
    }
};

export const MOCK_CLASSES: { [id: string]: Class } = {
    'c1': { id: 'c1', name: 'ষষ্ঠ শ্রেণী' },
    'c2': { id: 'c2', name: 'সপ্তম শ্রেণী' },
    'c3': { id: 'c3', name: 'অষ্টম শ্রেণী' },
};

export const MOCK_SECTIONS: { [id: string]: Section } = {
    's1': { id: 's1', name: 'ক শাখা' },
    's2': { id: 's2', name: 'খ শাখা' },
};

export const MOCK_STUDENTS: { [id: string]: Student } = {
    'std1': { id: 'std1', name: 'আরিফ হোসেন', roll: 1, className: 'ষষ্ঠ শ্রেণী', section: 'ক শাখা', guardianName: 'মোঃ শফিক', contact: '01712345678', profilePicUrl: 'https://picsum.photos/seed/std1/200' },
    'std2': { id: 'std2', name: 'ফারিয়া সুলতানা', roll: 2, className: 'ষষ্ঠ শ্রেণী', section: 'ক শাখা', guardianName: 'আহমেদ সুলতান', contact: '01812345678', profilePicUrl: 'https://picsum.photos/seed/std2/200' },
    'std3': { id: 'std3', name: 'ইমরান খান', roll: 1, className: 'সপ্তম শ্রেণী', section: 'খ শাখা', guardianName: 'নাসির খান', contact: '01912345678', profilePicUrl: 'https://picsum.photos/seed/std3/200' },
    'std4': { id: 'std4', name: 'তাসনিয়া রহমান', roll: 3, className: 'ষষ্ঠ শ্রেণী', section: 'ক শাখা', guardianName: 'ওসমান গণি', contact: '01612345678', profilePicUrl: 'https://picsum.photos/seed/std4/200' },
    'std5': { id: 'std5', name: 'সাকিব আল হাসান', roll: 4, className: 'ষষ্ঠ শ্রেণী', section: 'ক শাখা', guardianName: 'মাশরাফি বিন মর্তুজা', contact: '01512345678', profilePicUrl: 'https://picsum.photos/seed/std5/200' },
};

export const MOCK_TEACHERS: { [id: string]: Teacher } = {
    'teacher1': { id: 'teacher1', name: 'মোঃ রফিক হাসান', subject: 'গণিত', phone: '01711111111', email: 'teacher@school.com', profilePicUrl: 'https://picsum.photos/seed/teacher1/200' },
    'teacher2': { id: 'teacher2', name: 'শাহনাজ পারভীন', subject: 'বাংলা', phone: '01822222222', email: 'teacher2@school.com', profilePicUrl: 'https://picsum.photos/seed/teacher2/200' },
};

export const MOCK_LIBRARIANS: { [id: string]: Librarian } = {
    'librarian1': { id: 'librarian1', name: 'সেলিনা আক্তার', phone: '01933333333', email: 'librarian@school.com', profilePicUrl: 'https://picsum.photos/seed/librarian1/200' },
};

export const MOCK_SCHEDULES: { [id: string]: Schedule } = {
    'sch1': { id: 'sch1', day: '1', className: 'ষষ্ঠ শ্রেণী', section: 'ক শাখা', subject: 'গণিত', teacherId: 'teacher1', startTime: '09:00', endTime: '10:00' },
    'sch2': { id: 'sch2', day: '2', className: 'সপ্তম শ্রেণী', section: 'খ শাখা', subject: 'বাংলা', teacherId: 'teacher2', startTime: '10:00', endTime: '11:00' },
};

export const MOCK_CLASS_TESTS: { [id: string]: ClassTest } = {
    'ct1': { id: 'ct1', examName: 'মাসিক পরীক্ষা - ১', className: 'ষষ্ঠ শ্রেণী', section: 'ক শাখা', subject: 'গণিত', totalMarks: 20, createdBy: 'teacher1' },
};

export const MOCK_MARKS: MarksSheet = {
    'ct1': {
        'std1': { marksObtained: 18 },
        'std2': { marksObtained: 15 }
    }
};

export const MOCK_LEAVES: { [id: string]: StudentLeave } = {
    'leave1': { id: 'leave1', studentId: 'std2', reason: 'অসুস্থতা', startDate: '2024-07-20', endDate: '2024-07-22' }
};

const today = new Date().toISOString().slice(0, 10);
export const MOCK_ATTENDANCE: Attendance = {
    [today]: {
        'ষষ্ঠ শ্রেণী___ক শাখা': {
            'std1': { status: 'present' },
            'std2': { status: 'absent' },
            'std4': { status: 'present' },
            'std5': { status: 'present' },
        },
        'সপ্তম শ্রেণী___খ শাখা': {
            'std3': { status: 'present' }
        }
    }
};

export const MOCK_SUBSCRIPTION: Subscription = {
    status: 'Active',
    tier: 'Yearly'
};

export const MOCK_LIBRARY: Library = {
    books: {
        'book1': { id: 'book1', title: 'আমার বাংলা বই', author: 'NCTB', totalQuantity: 10, availableQuantity: 8, isbn: '978-984-814-0' },
        'book2': { id: 'book2', title: 'গণিত সপ্তম শ্রেণি', author: 'NCTB', totalQuantity: 15, availableQuantity: 15, isbn: '978-984-814-1' },
    },
    issuedBooks: {
        'issue1': { id: 'issue1', bookId: 'book1', studentId: 'std1', issueDate: '2024-07-15', dueDate: '2024-07-30', returnDate: null, status: 'issued' },
    }
};

export const MOCK_MAIN_EXAMS: { [id: string]: MainExam } = {
    'exam1': {
        id: 'exam1',
        name: 'অর্ধবার্ষিকী পরীক্ষা ২০২৪',
        date: '2024-08-01',
        routine: {
            'c1_subject': 'গণিত', 'c1_date': '2024-08-01', 'c1_time': '09:00',
            'c2_subject': 'বাংলা', 'c2_date': '2024-08-01', 'c2_time': '09:00',
        }
    },
    'exam2': { id: 'exam2', name: 'বার্ষিক পরীক্ষা ২০২৪', date: '2024-12-10' }
};

export const MOCK_ROOMS: { [id: string]: Room } = {
    'room1': { id: 'room1', name: 'রুম ১০১', capacity: 20 },
    'room2': { id: 'room2', name: 'রুম ১০২', capacity: 25 },
    'room3': { id: 'room3', name: 'হল রুম', capacity: 50 },
};

export const MOCK_INVIGILATOR_ROSTERS: InvigilatorRoster = {
    'exam1': {
        '2024-08-01': {
            'room1': 'teacher1',
            'room2': 'teacher2',
        },
         '2024-12-15': { // A future date for testing
            'room1': 'teacher1'
        }
    }
};

export const MOCK_NOTICES: { [id: string]: Notice } = {
    'notice1': { id: 'notice1', title: 'বার্ষিক ক্রীড়া প্রতিযোগিতা', content: 'আগামী শুক্রবার, ২০শে আগস্ট, ২০২৪ তারিখে স্কুলের বার্ষিক ক্রীড়া প্রতিযোগিতা অনুষ্ঠিত হবে। সকল ছাত্রছাত্রীকে মাঠে উপস্থিত থাকার জন্য অনুরোধ করা হচ্ছে।', date: '2024-08-15' },
    'notice2': { id: 'notice2', title: 'অর্ধবার্ষিকী পরীক্ষার ফলাফল', content: 'অর্ধবার্ষিকী পরীক্ষার ফলাফল আগামী সপ্তাহে প্রকাশ করা হবে। শিক্ষার্থীরা স্কুল ওয়েবসাইট থেকে তাদের ফলাফল দেখতে পারবে।', date: '2024-08-12' },
    'notice3': { id: 'notice3', title: 'অভিভাবক সভা', content: 'সকল শ্রেণীর ছাত্রছাত্রীদের অভিভাবকদের নিয়ে একটি সভা আগামী ২৫শে আগস্ট, ২০২৪ তারিখে সকাল ১০টায় স্কুল অডিটোরিয়ামে অনুষ্ঠিত হবে।', date: '2024-08-10' },
};


export const MOCK_FEE_INVOICES: { [id: string]: FeeInvoice } = {
    'inv1': { id: 'inv1', name: 'মাসিক বেতন - জুলাই', amount: 1200, dueDate: '2024-07-10' },
    'inv2': { id: 'inv2', name: 'অর্ধবার্ষিকী পরীক্ষার ফি', amount: 800, dueDate: '2024-07-20' },
    'inv3': { id: 'inv3', name: 'মাসিক বেতন - আগস্ট', amount: 1200, dueDate: '2024-08-10' },
};

export const MOCK_STUDENT_PAYMENTS: { [id: string]: StudentPayment } = {
    'payment1': { id: 'payment1', studentId: 'std1', invoiceId: 'inv1', amountPaid: 1200, paymentDate: '2024-07-08' },
    'payment2': { id: 'payment2', studentId: 'std1', invoiceId: 'inv2', amountPaid: 800, paymentDate: '2024-07-15' },
    'payment3': { id: 'payment3', studentId: 'std2', invoiceId: 'inv1', amountPaid: 1200, paymentDate: '2024-07-10' },
};