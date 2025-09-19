import React from 'react';

const Loader: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[100]">
            <div className="loader"></div>
            <p className="mt-4 text-lg text-primary font-semibold">লোড হচ্ছে...</p>
            <style>{`
                .loader {
                    border: 8px solid #f3f3f3; /* Light grey */
                    border-top: 8px solid #4f46e5; /* Primary color */
                    border-radius: 50%;
                    width: 60px;
                    height: 60px;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Loader;