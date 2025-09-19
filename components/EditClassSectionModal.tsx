import React, { useState, useEffect } from 'react';

interface EditClassSectionModalProps {
    item: { id: string; name: string };
    itemType: 'ক্লাস' | 'বিভাগ';
    onClose: () => void;
    onSave: (id: string, newName: string) => void;
}

const EditClassSectionModal: React.FC<EditClassSectionModalProps> = ({ item, itemType, onClose, onSave }) => {
    const [name, setName] = useState(item.name);

    useEffect(() => {
        setName(item.name);
    }, [item]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSave(item.id, name.trim());
        }
    };
    
    const fieldClasses = "w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-800 focus:ring-secondary focus:border-secondary";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 font-sans">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all animate-scaleIn">
                <div className="flex justify-between items-center border-b pb-3 mb-5">
                    <h2 className="text-xl font-bold text-primary">{itemType} এডিট করুন</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-danger text-2xl">&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-1">
                        <label className="font-medium text-gray-700">{itemType}-এর নাম</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                            className={fieldClasses}
                        />
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-5 rounded-lg hover:bg-gray-300 transition">বাতিল</button>
                        <button type="submit" className="bg-secondary text-white font-bold py-2 px-5 rounded-lg hover:bg-accent transition">সেভ করুন</button>
                    </div>
                </form>
            </div>
             <style>{`
                @keyframes scaleIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scaleIn { animation: scaleIn 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default EditClassSectionModal;
