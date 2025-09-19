import React, { useState } from 'react';

interface CreateSchoolModalProps {
    onClose: () => void;
    onSave: (schoolData: any) => void;
}

const CreateSchoolModal: React.FC<CreateSchoolModalProps> = ({ onClose, onSave }) => {
    const [schoolName, setSchoolName] = useState('');
    const [principalName, setPrincipalName] = useState('');
    const [principalEmail, setPrincipalEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ schoolName, principalName, principalEmail });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 font-sans">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
                <h2 className="text-xl font-bold text-primary mb-4">Create New School</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-medium text-gray-700">School Name</label>
                        <input
                            type="text"
                            value={schoolName}
                            onChange={(e) => setSchoolName(e.target.value)}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Principal's Name</label>
                        <input
                            type="text"
                            value={principalName}
                            onChange={(e) => setPrincipalName(e.target.value)}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-gray-700">Principal's Email</label>
                        <input
                            type="email"
                            value={principalEmail}
                            onChange={(e) => setPrincipalEmail(e.target.value)}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-5 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="bg-secondary text-white font-bold py-2 px-5 rounded-lg hover:bg-accent">Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateSchoolModal;
