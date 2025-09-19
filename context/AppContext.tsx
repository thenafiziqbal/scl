import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, SchoolSettings, Student, Teacher, Librarian, Schedule, ClassTest, MarksSheet, Class, Section, StudentLeave, Attendance, Subscription, Library, MainExam, Room, InvigilatorRoster, Notice, DailyAttendance, FeeInvoice, StudentPayment } from '../types';
import { MOCK_USERS, MOCK_SCHOOL_SETTINGS, MOCK_STUDENTS, MOCK_TEACHERS, MOCK_LIBRARIANS, MOCK_SCHEDULES, MOCK_CLASS_TESTS, MOCK_MARKS, MOCK_CLASSES, MOCK_SECTIONS, MOCK_LEAVES, MOCK_ATTENDANCE, MOCK_SUBSCRIPTION, MOCK_LIBRARY, MOCK_MAIN_EXAMS, MOCK_ROOMS, MOCK_INVIGILATOR_ROSTERS, MOCK_NOTICES, MOCK_FEE_INVOICES, MOCK_STUDENT_PAYMENTS } from '../services/mockData';

interface AppContextType {
    user: User | null;
    login: (email: string, password: string) => boolean;
    logout: () => void;
    settings: SchoolSettings;
    students: { [id: string]: Student };
    teachers: { [id: string]: Teacher };
    librarians: { [id: string]: Librarian };
    schedules: { [id: string]: Schedule };
    classTests: { [id: string]: ClassTest };
    marks: MarksSheet;
    classes: { [id: string]: Class };
    sections: { [id: string]: Section };
    leaves: { [id: string]: StudentLeave };
    attendance: Attendance;
    subscription: Subscription;
    library: Library;
    mainExams: { [id: string]: MainExam };
    rooms: { [id: string]: Room };
    invigilatorRosters: InvigilatorRoster;
    notices: { [id: string]: Notice };
    feeInvoices: { [id: string]: FeeInvoice };
    studentPayments: { [id: string]: StudentPayment };
    addStudent: (student: Omit<Student, 'id'>) => void;
    updateStudent: (studentId: string, updatedData: Partial<Student>) => void;
    addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
    updateTeacher: (teacherId: string, updatedData: Partial<Teacher>) => void;
    addLibrarian: (librarian: Omit<Librarian, 'id'>) => void;
    updateLibrarian: (librarianId: string, updatedData: Partial<Librarian>) => void;
    addMainExam: (exam: Omit<MainExam, 'id'>) => void;
    deleteMainExam: (id: string) => void;
    addRoom: (room: Omit<Room, 'id'>) => void;
    deleteRoom: (id: string) => void;
    saveInvigilatorRoster: (examId: string, date: string, roster: { [roomId: string]: string }) => void;
    addSchedule: (schedule: Omit<Schedule, 'id'>) => void;
    deleteSchedule: (id: string) => void;
    addNotice: (notice: Omit<Notice, 'id'>) => void;
    deleteNotice: (id: string) => void;
    saveAttendance: (date: string, classSection: string, dailyAttendance: DailyAttendance) => void;
    addFeeInvoice: (invoice: Omit<FeeInvoice, 'id'>) => void;
    updateFeeInvoice: (invoiceId: string, updatedData: Partial<FeeInvoice>) => void;
    deleteFeeInvoice: (id: string) => void;
    recordStudentPayment: (payment: Omit<StudentPayment, 'id'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [settings, setSettings] = useState<SchoolSettings>(MOCK_SCHOOL_SETTINGS);
    const [students, setStudents] = useState<{ [id: string]: Student }>(MOCK_STUDENTS);
    const [teachers, setTeachers] = useState<{ [id: string]: Teacher }>(MOCK_TEACHERS);
    const [librarians, setLibrarians] = useState<{ [id: string]: Librarian }>(MOCK_LIBRARIANS);
    const [schedules, setSchedules] = useState<{ [id: string]: Schedule }>(MOCK_SCHEDULES);
    const [classTests, setClassTests] = useState<{ [id: string]: ClassTest }>(MOCK_CLASS_TESTS);
    const [marks, setMarks] = useState<MarksSheet>(MOCK_MARKS);
    const [classes, setClasses] = useState<{ [id: string]: Class }>(MOCK_CLASSES);
    const [sections, setSections] = useState<{ [id: string]: Section }>(MOCK_SECTIONS);
    const [leaves, setLeaves] = useState<{ [id: string]: StudentLeave }>(MOCK_LEAVES);
    const [attendance, setAttendance] = useState<Attendance>(MOCK_ATTENDANCE);
    const [subscription, setSubscription] = useState<Subscription>(MOCK_SUBSCRIPTION);
    const [library, setLibrary] = useState<Library>(MOCK_LIBRARY);
    const [mainExams, setMainExams] = useState<{ [id: string]: MainExam }>(MOCK_MAIN_EXAMS);
    const [rooms, setRooms] = useState<{ [id: string]: Room }>(MOCK_ROOMS);
    const [invigilatorRosters, setInvigilatorRosters] = useState<InvigilatorRoster>(MOCK_INVIGILATOR_ROSTERS);
    const [notices, setNotices] = useState<{ [id: string]: Notice }>(MOCK_NOTICES);
    const [feeInvoices, setFeeInvoices] = useState<{ [id: string]: FeeInvoice }>(MOCK_FEE_INVOICES);
    const [studentPayments, setStudentPayments] = useState<{ [id: string]: StudentPayment }>(MOCK_STUDENT_PAYMENTS);

    const login = (email: string, password: string): boolean => {
        const foundUser = Object.values(MOCK_USERS).find(u => u.email === email && u.password === password);
        if (foundUser) {
            const { password: _, ...userWithoutPassword } = foundUser;
            
            let fullUserProfile: User = { ...userWithoutPassword };

            if (userWithoutPassword.role === 'teacher' && MOCK_TEACHERS[userWithoutPassword.uid]) {
                const teacherProfile = MOCK_TEACHERS[userWithoutPassword.uid];
                fullUserProfile = { ...fullUserProfile, ...teacherProfile };
            } else if (userWithoutPassword.role === 'librarian' && MOCK_LIBRARIANS[userWithoutPassword.uid]) {
                const librarianProfile = MOCK_LIBRARIANS[userWithoutPassword.uid];
                fullUserProfile = { ...fullUserProfile, ...librarianProfile };
            }
            setUser(fullUserProfile);
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
    };
    
    const addStudent = (studentData: Omit<Student, 'id'>) => {
        const newId = `student${Object.keys(students).length + 1}`;
        const newStudent: Student = { id: newId, ...studentData };
        setStudents(prev => ({ ...prev, [newId]: newStudent }));
    };

    const updateStudent = (studentId: string, updatedData: Partial<Student>) => {
        setStudents(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], ...updatedData }
        }));
    };

    const addTeacher = (teacherData: Omit<Teacher, 'id'>) => {
        const newId = `teacher${Date.now()}`;
        const newTeacher: Teacher = { id: newId, ...teacherData };
        setTeachers(prev => ({ ...prev, [newId]: newTeacher }));
    };

    const updateTeacher = (teacherId: string, updatedData: Partial<Teacher>) => {
        setTeachers(prev => ({
            ...prev,
            [teacherId]: { ...prev[teacherId], ...updatedData }
        }));
    };

    const addLibrarian = (librarianData: Omit<Librarian, 'id'>) => {
        const newId = `librarian${Date.now()}`;
        const newLibrarian: Librarian = { id: newId, ...librarianData };
        setLibrarians(prev => ({ ...prev, [newId]: newLibrarian }));
    };

    const updateLibrarian = (librarianId: string, updatedData: Partial<Librarian>) => {
        setLibrarians(prev => ({
            ...prev,
            [librarianId]: { ...prev[librarianId], ...updatedData }
        }));
    };

    const addMainExam = (examData: Omit<MainExam, 'id'>) => {
        const newId = `exam${Date.now()}`;
        const newExam: MainExam = { id: newId, ...examData };
        setMainExams(prev => ({ ...prev, [newId]: newExam }));
    };

    const deleteMainExam = (id: string) => {
        setMainExams(prev => {
            const newState = { ...prev };
            delete newState[id];
            return newState;
        });
    };

    const addRoom = (roomData: Omit<Room, 'id'>) => {
        const newId = `room${Date.now()}`;
        const newRoom: Room = { id: newId, ...roomData };
        setRooms(prev => ({ ...prev, [newId]: newRoom }));
    };

    const deleteRoom = (id: string) => {
        setRooms(prev => {
            const newState = { ...prev };
            delete newState[id];
            return newState;
        });
    };
    
    const saveInvigilatorRoster = (examId: string, date: string, roster: { [roomId: string]: string }) => {
        setInvigilatorRosters(prev => ({
            ...prev,
            [examId]: {
                ...prev[examId],
                [date]: roster
            }
        }));
    };

    const addSchedule = (scheduleData: Omit<Schedule, 'id'>) => {
        const newId = `sch${Date.now()}`;
        const newSchedule: Schedule = { id: newId, ...scheduleData };
        setSchedules(prev => ({ ...prev, [newId]: newSchedule }));
    };

    const deleteSchedule = (id: string) => {
        setSchedules(prev => {
            const newState = { ...prev };
            delete newState[id];
            return newState;
        });
    };
    
    const addNotice = (noticeData: Omit<Notice, 'id'>) => {
        const newId = `notice${Date.now()}`;
        const newNotice: Notice = { id: newId, ...noticeData };
        setNotices(prev => ({ ...prev, [newId]: newNotice }));
    };

    const deleteNotice = (id: string) => {
        setNotices(prev => {
            const newState = { ...prev };
            delete newState[id];
            return newState;
        });
    };

    const saveAttendance = (date: string, classSection: string, dailyAttendance: DailyAttendance) => {
        setAttendance(prev => ({
            ...prev,
            [date]: {
                ...prev[date],
                [classSection]: dailyAttendance
            }
        }));
    };
    
    const addFeeInvoice = (invoiceData: Omit<FeeInvoice, 'id'>) => {
        const newId = `inv${Date.now()}`;
        const newInvoice: FeeInvoice = { id: newId, ...invoiceData };
        setFeeInvoices(prev => ({ ...prev, [newId]: newInvoice }));
    };

    const updateFeeInvoice = (invoiceId: string, updatedData: Partial<FeeInvoice>) => {
        setFeeInvoices(prev => ({
            ...prev,
            [invoiceId]: { ...prev[invoiceId], ...updatedData }
        }));
    };
    
    const deleteFeeInvoice = (id: string) => {
        if (Object.values(studentPayments).some(p => p.invoiceId === id)) {
            alert('এই ইনভয়েসের বিপরীতে পেমেন্ট থাকায় এটি মুছে ফেলা যাবে না।');
            return;
        }
        setFeeInvoices(prev => {
            const newState = { ...prev };
            delete newState[id];
            return newState;
        });
    };

    const recordStudentPayment = (paymentData: Omit<StudentPayment, 'id'>) => {
        const newId = `payment${Date.now()}`;
        const newPayment: StudentPayment = { id: newId, ...paymentData };
        setStudentPayments(prev => ({ ...prev, [newId]: newPayment }));
    };

    const value = {
        user,
        login,
        logout,
        settings,
        students,
        teachers,
        librarians,
        schedules,
        classTests,
        marks,
        classes,
        sections,
        leaves,
        attendance,
        subscription,
        library,
        mainExams,
        rooms,
        invigilatorRosters,
        notices,
        feeInvoices,
        studentPayments,
        addStudent,
        updateStudent,
        addTeacher,
        updateTeacher,
        addLibrarian,
        updateLibrarian,
        addMainExam,
        deleteMainExam,
        addRoom,
        deleteRoom,
        saveInvigilatorRoster,
        addSchedule,
        deleteSchedule,
        addNotice,
        deleteNotice,
        saveAttendance,
        addFeeInvoice,
        updateFeeInvoice,
        deleteFeeInvoice,
        recordStudentPayment,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};