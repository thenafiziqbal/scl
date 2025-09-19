import React, { useState } from 'react';
import { School } from '../types';
import CreateSchoolModal from '../components/CreateSchoolModal';

const mockSchools: School[] = [
    { id: 'school1', name: 'আমার আদর্শ স্কুল', principalName: 'মোঃ আব্দুল্লাহ', principalEmail: 'principal@school1.com', status: 'active' },
    { id: 'school2', name: 'Another Model School', principalName: 'Jane Doe', principalEmail: 'principal@school2.com', status: 'inactive' },
];

const SuperAdminDashboard: React.FC = () => {
    const [schools, setSchools] = useState<School[]>(mockSchools);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreateSchool = (schoolData: any) => {
        console.log('Creating new school:', schoolData);
        const newSchool: School = {
            id: `school${schools.length + 1}`,
            name: schoolData.schoolName,
            principalName: schoolData.principalName,
            principalEmail: schoolData.principalEmail,
            status: 'active'
        }
        setSchools(prev => [...prev, newSchool]);
        setIsModalOpen(false);
    };

    return (
        <div className="p-8 font-sans">
            <h1 className="text-3xl font-bold text-primary mb-6">Super Admin Dashboard</h1>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-primary">Manage Schools</h2>
                    <button onClick={() => setIsModalOpen(true)} className="bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-accent transition">
                        <i className="fas fa-plus mr-2"></i> Create New School
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-sidebar text-white">
                            <tr>
                                <th className="p-4">School Name</th>
                                <th className="p-4">Principal</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schools.map(school => (
                                <tr key={school.id} className="border-b">
                                    <td className="p-4 font-medium">{school.name}</td>
                                    <td className="p-4">{school.principalName} ({school.principalEmail})</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${school.status === 'active' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                            {school.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button className="text-amber-600 hover:text-amber-800 mr-3"><i className="fas fa-edit"></i></button>
                                        <button className="text-danger hover:text-red-700"><i className="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <CreateSchoolModal 
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleCreateSchool}
                />
            )}
        </div>
    );
};

export default SuperAdminDashboard;
