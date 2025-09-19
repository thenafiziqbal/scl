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
    login: (email: string, password:string) => Promise<void>;
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
    issueBook: (issue: Omit<IssuedBook, 'id'|'status'>) => Promise<void>;
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
    updateSettings: (newSettings: SchoolSettings) => Promise<void>;
    
    backupData: () => void;
    restoreData: (data: any) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<(User & { department?: string }) | null>(null);
    const [loading, setLoading] = useState(true);

    const [allUsers, setAllUsers] = useState<{ [uid: string]: User }>(mockUsers);
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
        // Mock session management
        try {
            const storedUser = sessionStorage.getItem('school-user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse user from session storage", error);
            sessionStorage.removeItem('school-user');
        } finally {
            setLoading(false);
        }
    }, []);
    

    const login = async (email: string, password: string): Promise<void> => {
        setLoading(true);
        const foundUser = Object.values(allUsers).find(u => u.email === email && u.password === password);
        
        if (foundUser) {
            setUser(foundUser);
            sessionStorage.setItem('school-user', JSON.stringify(foundUser));
            setLoading(false);
        } else {
            setLoading(false);
            throw new Error("Invalid login credentials");
        }
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('school-user');
    };
    
    const addStudent = async (student: Omit<Student, 'id'>) => {
        const id = generateId('stu');
        const newStudent = { id, ...student };
        setStudents(prev => ({ ...prev, [id]: newStudent }));
    };
    
    const updateStudent = async (id: string, studentData: Student) => {
        setStudents(prev => ({ ...prev, [id]: studentData }));
    };

    const createNewUser = async (staffData: StaffData): Promise<void> => {
        const emailExists = Object.values(allUsers).some(u => u.email === staffData.email);
        if (emailExists) {
            throw new Error("User already registered");
        }
        
        const uid = generateId('usr');
        const staffId = generateId('stf');
        const roleMap: {[key: string]: UserRole} = { 'শিক্ষক': 'teacher', 'লাইব্রেরিয়ান': 'librarian', 'বিভাগীয় প্রধান': 'department-head'};
        const userRole = roleMap[staffData.role];

        const newUser: User = {
            uid,
            name: staffData.name,
            email: staffData.email,
            password: staffData.password,
            role: userRole,
            department: userRole === 'department-head' ? staffData.details : undefined
        };
        setAllUsers(prev => ({...prev, [uid]: newUser}));

        const commonStaffData = {
            id: staffId,
            uid,
            role: userRole,
            name: staffData.name,
            email: staffData.email,
            phone: staffData.phone,
            profilePicUrl: staffData.profilePicUrl,
        };

        if(userRole === 'teacher') {
            setTeachers(prev => ({ ...prev, [staffId]: { ...commonStaffData, subject: staffData.details, department: '' } }));
        } else if (userRole === 'librarian') {
            setLibrarians(prev => ({...prev, [staffId]: { ...commonStaffData }}));
        } else if (userRole === 'department-head') {
            setDepartmentHeads(prev => ({...prev, [staffId]: { ...commonStaffData, department: staffData.details }}));
        }
    };
    
    const updateAttendance = async (date: string, classSectionKey: string, studentId: string, status: 'present' | 'absent' | 'leave') => {
        setAttendance(prev => {
            const newAttendance = JSON.parse(JSON.stringify(prev)); // Deep copy
            if (!newAttendance[date]) newAttendance[date] = {};
            if (!newAttendance[date][classSectionKey]) newAttendance[date][classSectionKey] = {};
            newAttendance[date][classSectionKey][studentId] = { status };
            return newAttendance;
        });
    };

    const addMainExam = async (exam: Omit<MainExam, 'id'>) => {
        const id = generateId('exam');
        setMainExams(prev => ({...prev, [id]: {id, ...exam}}));
    };

    const addExamRoutine = async (routine: Omit<ExamRoutine, 'id'>) => {
        const id = generateId('routine');
        setExamRoutines(prev => ({...prev, [id]: {id, ...routine}}));
    };

    const updateSeatPlan = async (examId: string, date: string, roomId: string, studentIds: string[]) => {
        setSeatPlans(prev => {
            const newPlans = JSON.parse(JSON.stringify(prev));
            if(!newPlans[examId]) newPlans[examId] = {};
            if(!newPlans[examId][date]) newPlans[examId][date] = {};
            newPlans[examId][date][roomId] = studentIds;
            return newPlans;
        });
    };

    const updateInvigilatorRoster = async (examId: string, date: string, roomId: string, teacherId: string) => {
        setInvigilatorRosters(prev => {
            const newRosters = JSON.parse(JSON.stringify(prev));
            if(!newRosters[examId]) newRosters[examId] = {};
            if(!newRosters[examId][date]) newRosters[examId][date] = {};
            newRosters[examId][date][roomId] = teacherId;
            return newRosters;
        });
    };

    const addBook = async (book: Omit<Book, 'id' | 'availableQuantity'>) => {
        const id = generateId('book');
        const newBook: Book = { id, ...book, availableQuantity: book.totalQuantity };
        setLibrary(prev => ({ ...prev, books: {...prev.books, [id]: newBook} }));
    };

    const issueBook = async (issue: Omit<IssuedBook, 'id'|'status'>) => {
        const { bookId } = issue;
        const book = library.books[bookId];

        if (book && book.availableQuantity > 0) {
            const id = generateId('issue');
            const newIssue: IssuedBook = { id, ...issue, status: 'issued' };

            setLibrary(prev => {
                const updatedBooks = { ...prev.books };
                updatedBooks[bookId].availableQuantity -= 1;
                return {
                    ...prev,
                    books: updatedBooks,
                    issuedBooks: {...prev.issuedBooks, [id]: newIssue}
                }
            });
            alert('বই সফলভাবে ইস্যু করা হয়েছে!');
        } else {
            alert('এই বইটি বর্তমানে লাইব্রেরিতে নেই।');
        }
    };

    const returnBook = async (issueId: string) => {
        const issue = library.issuedBooks[issueId];
        if (issue) {
            setLibrary(prev => {
                const updatedBooks = { ...prev.books };
                if (updatedBooks[issue.bookId]) {
                     updatedBooks[issue.bookId].availableQuantity += 1;
                }
                const updatedIssues = { ...prev.issuedBooks };
                updatedIssues[issueId] = { ...issue, status: 'returned', returnDate: new Date().toISOString().slice(0,10)};

                return { ...prev, books: updatedBooks, issuedBooks: updatedIssues };
            });
            alert('বইটি সফলভাবে ফেরত নেওয়া হয়েছে।');
        }
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
        });
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
        });
    };

    const recordStudentPayment = async (payment: Omit<StudentPayment, 'id'>) => {
        const id = generateId('pay');
        setStudentPayments(prev => ({...prev, [id]: {id, ...payment}}));
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
        });
    };

    const updateSettings = async (newSettings: SchoolSettings) => {
        setSettings(newSettings);
    };
    
    const backupData = () => {
        const dataToBackup = {
            allUsers, students, teachers, librarians, departmentHeads, classes, sections,
            schedules, attendance, classTests, marks, mainExams, examRoutines, rooms,
            seatPlans, invigilatorRosters, library, leaves, notices, feeInvoices,
            studentPayments, subscription, settings
        };
        const dataStr = JSON.stringify(dataToBackup, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'school_data_backup.json';
        
        let linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };
    
    const restoreData = async (data: any) => {
        // Simple validation
        if (!data.students || !data.allUsers) {
            throw new Error("Invalid backup file format.");
        }
        setAllUsers(data.allUsers);
        setStudents(data.students);
        setTeachers(data.teachers);
        setLibrarians(data.librarians);
        setDepartmentHeads(data.departmentHeads);
        setClasses(data.classes);
        setSections(data.sections);
        setSchedules(data.schedules);
        setAttendance(data.attendance);
        setClassTests(data.classTests);
        setMarks(data.marks);
        setMainExams(data.mainExams);
        setExamRoutines(data.examRoutines);
        setRooms(data.rooms);
        setSeatPlans(data.seatPlans);
        setInvigilatorRosters(data.invigilatorRosters);
        setLibrary(data.library);
        setLeaves(data.leaves);
        setNotices(data.notices);
        setFeeInvoices(data.feeInvoices);
        setStudentPayments(data.studentPayments);
        setSubscription(data.subscription);
        setSettings(data.settings);
    };


    const value: AppContextType = {
        user,
        loading,
        login,
        logout,
        students,
        teachers,
        librarians,
        departmentHeads,
        classes,
        sections,
        schedules,
        attendance,
        classTests,
        marks,
        mainExams,
        examRoutines,
        rooms,
        seatPlans,
        invigilatorRosters,
        library,
        leaves,
        notices,
        feeInvoices,
        studentPayments,
        subscription,
        settings,
        addStudent,
        updateStudent,
        createNewUser,
        updateAttendance,
        addMainExam,
        addExamRoutine,
        updateSeatPlan,
        updateInvigilatorRoster,
        addBook,
        issueBook,
        returnBook,
        addNotice,
        deleteNotice,
        addFeeInvoice,
        updateFeeInvoice,
        deleteFeeInvoice,
        recordStudentPayment,
        addLeave,
        updateLeave,
        deleteLeave,
        updateSettings,
        backupData,
        restoreData,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};