
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { 
    User, Student, Teacher, Librarian, DepartmentHead, Class, Section, Schedule, Attendance, ClassTest, Marks,
    MainExam, ExamRoutine, Room, SeatPlan, InvigilatorRoster, Library, StudentLeave, Notice, 
    FeeInvoice, StudentPayment, Subscription, SchoolSettings, UserRole, Book, IssuedBook
} from '../types';
import { StaffData } from '../components/EditStaffModal';
import {
    mockUsers, mockStudents, mockTeachers, mockLibrarians, mockDepartmentHeads,
    mockClasses, mockSections, mockSchedules, mockAttendance, mockClassTests, mockMarks,
    mockMainExams, mockExamRoutines, mockRooms, mockSeatPlans, mockInvigilatorRosters,
    mockLibrary, mockLeaves, mockNotices, mockFeeInvoices, mockStudentPayments,
    mockSubscription, mockSettings
} from '../services/mockData';

const generateId = (prefix: string) => `${prefix}${Date.now()}${Math.random().toString(36).substr(2, 5)}`;

type TeacherWithUser = Teacher & { uid: string; role: UserRole; password?: string; };
type LibrarianWithUser = Librarian & { uid: string; role: UserRole; password?: string; };
type DepartmentHeadWithUser = DepartmentHead & { uid: string; role: UserRole; password?: string; };

interface AppContextType {
    user: (User & { department?: string }) | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    students: { [id: string]: Student };
    addStudent: (student: Omit<Student, 'id'>) => Promise<void>;
    updateStudent: (id: string, data: Student) => Promise<void>;
    teachers: { [id: string]: TeacherWithUser };
    librarians: { [id: string]: LibrarianWithUser };
    departmentHeads: { [id: string]: DepartmentHeadWithUser };
    createNewUser: (staffData: StaffData) => Promise<void>;
    classes: { [id: string]: Class };
    sections: { [id: string]: Section };
    schedules: { [id: string]: Schedule };
    attendance: Attendance;
    updateAttendance: (date: string, classSectionKey: string, studentId: string, status: 'present' | 'absent' | 'leave') => Promise<void>;
    classTests: { [id: string]: ClassTest };
    marks: Marks;
    mainExams: { [id: string]: MainExam };
    addMainExam: (exam: Omit<MainExam, 'id'>) => Promise<void>;
    examRoutines: { [id: string]: ExamRoutine };
    addExamRoutine: (routine: Omit<ExamRoutine, 'id'>) => Promise<void>;
    rooms: { [id: string]: Room };
    seatPlans: SeatPlan;
    updateSeatPlan: (examId: string, date: string, roomId: string, studentIds: string[]) => Promise<void>;
    invigilatorRosters: InvigilatorRoster;
    updateInvigilatorRoster: (examId: string, date: string, roomId: string, teacherId: string) => Promise<void>;
    library: Library;
    addBook: (book: Omit<Book, 'id' | 'availableQuantity'>) => Promise<void>;
    updateBook: (id: string, data: Book) => Promise<void>;
    deleteBook: (id: string) => Promise<void>;
    issueBook: (issue: Omit<IssuedBook, 'id' | 'status'>) => Promise<void>;
    returnBook: (issueId: string) => Promise<void>;
    leaves: { [id: string]: StudentLeave };
    addLeave: (leave: Omit<StudentLeave, 'id'>) => Promise<void>;
    updateLeave: (id: string, data: StudentLeave) => Promise<void>;
    deleteLeave: (id: string) => Promise<void>;
    notices: { [id: string]: Notice };
    addNotice: (notice: Omit<Notice, 'id'>) => Promise<void>;
    deleteNotice: (id: string) => Promise<void>;
    feeInvoices: { [id: string]: FeeInvoice };
    addFeeInvoice: (invoice: Omit<FeeInvoice, 'id'>) => Promise<void>;
    updateFeeInvoice: (id: string, data: FeeInvoice) => Promise<void>;
    deleteFeeInvoice: (id: string) => Promise<void>;
    studentPayments: { [id: string]: StudentPayment };
    recordStudentPayment: (payment: Omit<StudentPayment, 'id'>) => Promise<void>;
    subscription: Subscription;
    settings: SchoolSettings;
    updateSettings: (data: SchoolSettings) => Promise<void>;
    backupData: () => void;
    restoreData: (data: any) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Auth State
    const [user, setUser] = useState<(User & { department?: string }) | null>(null);
    const [loading, setLoading] = useState(true);
    const [allUsers, setAllUsers] = useState<{ [uid: string]: User & { department?: string } }>(mockUsers);

    // Data State
    const [students, setStudents] = useState<{ [id: string]: Student }>(mockStudents);
    const [teachers, setTeachers] = useState<{ [id: string]: TeacherWithUser }>(mockTeachers);
    const [librarians, setLibrarians] = useState<{ [id: string]: LibrarianWithUser }>(mockLibrarians);
    const [departmentHeads, setDepartmentHeads] = useState<{ [id: string]: DepartmentHeadWithUser }>(mockDepartmentHeads);
    const [classes, setClasses] = useState<{ [id: string]: Class }>(mockClasses);
    const [sections, setSections] = useState<{ [id: string]: Section }>(mockSections);
    const [schedules, setSchedules] = useState<{ [id: string]: Schedule }>(mockSchedules);
    const [attendance, setAttendance] = useState<Attendance>(mockAttendance);
    const [classTests, setClassTests] = useState<{ [id: string]: ClassTest }>(mockClassTests);
    const [marks, setMarks] = useState<Marks>(mockMarks);
    const [mainExams, setMainExams] = useState<{ [id: string]: MainExam }>(mockMainExams);
    const [examRoutines, setExamRoutines] = useState<{ [id: string]: ExamRoutine }>(mockExamRoutines);
    const [rooms, setRooms] = useState<{ [id: string]: Room }>(mockRooms);
    const [seatPlans, setSeatPlans] = useState<SeatPlan>(mockSeatPlans);
    const [invigilatorRosters, setInvigilatorRosters] = useState<InvigilatorRoster>(mockInvigilatorRosters);
    const [library, setLibrary] = useState<Library>(mockLibrary);
    const [leaves, setLeaves] = useState<{ [id: string]: StudentLeave }>(mockLeaves);
    const [notices, setNotices] = useState<{ [id: string]: Notice }>(mockNotices);
    const [feeInvoices, setFeeInvoices] = useState<{ [id: string]: FeeInvoice }>(mockFeeInvoices);
    const [studentPayments, setStudentPayments] = useState<{ [id: string]: StudentPayment }>(mockStudentPayments);
    const [subscription, setSubscription] = useState<Subscription>(mockSubscription);
    const [settings, setSettings] = useState<SchoolSettings>(mockSettings);

    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const foundUser = Object.values(allUsers).find(u => u.email === email && u.password === password);
        if (foundUser) {
            setUser(foundUser);
            sessionStorage.setItem('user', JSON.stringify(foundUser));
        } else {
            throw new Error('Invalid login credentials');
        }
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('user');
    };

    const addStudent = async (studentData: Omit<Student, 'id'>) => {
        const id = generateId('stu');
        setStudents(prev => ({ ...prev, [id]: { id, ...studentData } }));
    };
    
    const updateStudent = async (id: string, data: Student) => {
        setStudents(prev => ({ ...prev, [id]: data }));
    };

    const createNewUser = async (staffData: StaffData) => {
        if (Object.values(allUsers).some(u => u.email === staffData.email)) {
            throw new Error("User already registered with this email.");
        }
        const uid = generateId('user');
        const newUser: User = { uid, name: staffData.name, email: staffData.email, role: staffData.role === 'শিক্ষক' ? 'teacher' : staffData.role === 'লাইব্রেরিয়ান' ? 'librarian' : 'department-head', password: staffData.password };
        setAllUsers(prev => ({...prev, [uid]: newUser}));

        const id = generateId('staff');
        if (staffData.role === 'শিক্ষক') {
            const newTeacher: TeacherWithUser = {id, uid, role: 'teacher', name: staffData.name, email: staffData.email, phone: staffData.phone, subject: staffData.details, department: ''};
            setTeachers(prev => ({...prev, [id]: newTeacher}));
        }
        // ... similar logic for librarian and department head
    };

    const updateAttendance = async (date: string, classSectionKey: string, studentId: string, status: 'present' | 'absent' | 'leave') => {
        setAttendance(prev => {
            const newAttendance = { ...prev };
            if (!newAttendance[date]) newAttendance[date] = {};
            if (!newAttendance[date][classSectionKey]) newAttendance[date][classSectionKey] = {};
            newAttendance[date][classSectionKey][studentId] = { status };
            return newAttendance;
        });
    };
    
    const addMainExam = async (exam: Omit<MainExam, 'id'>) => {
        const id = generateId('exam');
        setMainExams(prev => ({...prev, [id]: { id, ...exam }}));
    };

    const addExamRoutine = async (routine: Omit<ExamRoutine, 'id'>) => {
        const id = generateId('er');
        setExamRoutines(prev => ({...prev, [id]: { id, ...routine }}));
    };

    const updateSeatPlan = async (examId: string, date: string, roomId: string, studentIds: string[]) => {
        setSeatPlans(prev => {
            const newPlans = {...prev};
            if(!newPlans[examId]) newPlans[examId] = {};
            if(!newPlans[examId][date]) newPlans[examId][date] = {};
            newPlans[examId][date][roomId] = studentIds;
            return newPlans;
        });
    };

    const updateInvigilatorRoster = async (examId: string, date: string, roomId: string, teacherId: string) => {
        setInvigilatorRosters(prev => {
            const newRosters = {...prev};
            if(!newRosters[examId]) newRosters[examId] = {};
            if(!newRosters[examId][date]) newRosters[examId][date] = {};
            newRosters[examId][date][roomId] = teacherId;
            return newRosters;
        });
    };
    
    const addBook = async (book: Omit<Book, 'id' | 'availableQuantity'>) => {
        const id = generateId('book');
        setLibrary(prev => ({
            ...prev,
            books: {...prev.books, [id]: {id, ...book, availableQuantity: book.totalQuantity}}
        }));
    };

    const updateBook = async (id: string, data: Book) => {
        const oldBook = library.books[id];
        const quantityDiff = data.totalQuantity - oldBook.totalQuantity;
        data.availableQuantity = oldBook.availableQuantity + quantityDiff;
        if(data.availableQuantity < 0) data.availableQuantity = 0;

        setLibrary(prev => ({...prev, books: {...prev.books, [id]: data}}));
    };
    
    const deleteBook = async (id: string) => {
        setLibrary(prev => {
            const newBooks = {...prev.books};
            delete newBooks[id];
            return {...prev, books: newBooks};
        })
    };

    const issueBook = async (issue: Omit<IssuedBook, 'id' | 'status'>) => {
        const book = library.books[issue.bookId];
        if (book.availableQuantity <= 0) {
            alert("This book is not available.");
            return;
        }
        const id = generateId('issue');
        setLibrary(prev => {
            const newBooks = {...prev.books};
            newBooks[issue.bookId].availableQuantity -= 1;
            const newIssuedBooks = {...prev.issuedBooks, [id]: {id, ...issue, status: 'issued'}};
            return { books: newBooks, issuedBooks: newIssuedBooks };
        });
    };
    
    const returnBook = async (issueId: string) => {
        const issue = library.issuedBooks[issueId];
        if (!issue) return;
        setLibrary(prev => {
            const newBooks = {...prev.books};
            if(newBooks[issue.bookId]) {
                 newBooks[issue.bookId].availableQuantity += 1;
            }
            const newIssuedBooks = {...prev.issuedBooks};
            newIssuedBooks[issueId] = {...issue, status: 'returned', returnDate: new Date().toISOString().slice(0,10)};
            return { books: newBooks, issuedBooks: newIssuedBooks };
        });
    };

    const addLeave = async (leave: Omit<StudentLeave, 'id'>) => {
        const id = generateId('leave');
        setLeaves(prev => ({...prev, [id]: {id, ...leave}}));
    };

    const updateLeave = async (id: string, data: StudentLeave) => {
        setLeaves(prev => ({...prev, [id]: data}));
    };
    
    const deleteLeave = async (id: string) => {
        setLeaves(prev => {
            const newLeaves = {...prev};
            delete newLeaves[id];
            return newLeaves;
        })
    };
    
    const addNotice = async (notice: Omit<Notice, 'id'>) => {
        const id = generateId('notice');
        setNotices(prev => ({...prev, [id]: {id, ...notice}}));
    };
    
    const deleteNotice = async (id: string) => {
        setNotices(prev => {
            const newNotices = {...prev};
            delete newNotices[id];
            return newNotices;
        })
    };

    const addFeeInvoice = async (invoice: Omit<FeeInvoice, 'id'>) => {
        const id = generateId('inv');
        setFeeInvoices(prev => ({...prev, [id]: {id, ...invoice}}));
    };

    const updateFeeInvoice = async (id: string, data: FeeInvoice) => {
        setFeeInvoices(prev => ({...prev, [id]: data}));
    };
    
    const deleteFeeInvoice = async (id: string) => {
        setFeeInvoices(prev => {
            const newInvoices = {...prev};
            delete newInvoices[id];
            return newInvoices;
        })
    };
    
    const recordStudentPayment = async (payment: Omit<StudentPayment, 'id'>) => {
        const id = generateId('pay');
        setStudentPayments(prev => ({...prev, [id]: {id, ...payment}}));
    };

    const updateSettings = async (data: SchoolSettings) => {
        setSettings(data);
    };

    const backupData = () => {
        const data = {
            students, teachers, librarians, departmentHeads, classes, sections, schedules,
            attendance, classTests, marks, mainExams, examRoutines, rooms, seatPlans,
            invigilatorRosters, library, leaves, notices, feeInvoices, studentPayments,
            subscription, settings, allUsers
        };
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = `school_backup_${new Date().toISOString().slice(0,10)}.json`;
        link.click();
    };

    const restoreData = async (data: any) => {
        setStudents(data.students || {});
        setTeachers(data.teachers || {});
        setLibrarians(data.librarians || {});
        setDepartmentHeads(data.departmentHeads || {});
        setClasses(data.classes || {});
        setSections(data.sections || {});
        setSchedules(data.schedules || {});
        setAttendance(data.attendance || {});
        setClassTests(data.classTests || {});
        setMarks(data.marks || {});
        setMainExams(data.mainExams || {});
        setExamRoutines(data.examRoutines || {});
        setRooms(data.rooms || {});
        setSeatPlans(data.seatPlans || {});
        setInvigilatorRosters(data.invigilatorRosters || {});
        setLibrary(data.library || { books: {}, issuedBooks: {} });
        setLeaves(data.leaves || {});
        setNotices(data.notices || {});
        setFeeInvoices(data.feeInvoices || {});
        setStudentPayments(data.studentPayments || {});
        setSubscription(data.subscription || mockSubscription);
        setSettings(data.settings || mockSettings);
        setAllUsers(data.allUsers || mockUsers);
    };


    const value = {
        user, loading, login, logout, students, addStudent, updateStudent, teachers,
        librarians, departmentHeads, createNewUser, classes, sections, schedules,
        attendance, updateAttendance, classTests, marks, mainExams, addMainExam,
        examRoutines, addExamRoutine, rooms, seatPlans, updateSeatPlan, invigilatorRosters,
        updateInvigilatorRoster, library, addBook, updateBook, deleteBook, issueBook, returnBook,
        leaves, addLeave, updateLeave, deleteLeave, notices, addNotice, deleteNotice,
        feeInvoices, addFeeInvoice, updateFeeInvoice, deleteFeeInvoice, studentPayments, recordStudentPayment,
        subscription, settings, updateSettings, backupData, restoreData
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within a AppProvider');
    }
    return context;
};
