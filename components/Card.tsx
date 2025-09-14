
import React from 'react';

interface CardProps {
    title: string;
    value: string | number;
    icon: string;
    colorClass: string;
}

const Card: React.FC<CardProps> = ({ title, value, icon, colorClass }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4 transition-transform transform hover:-translate-y-1">
            <div className={`rounded-full p-4 ${colorClass}`}>
                <i className={`${icon} text-white text-2xl`}></i>
            </div>
            <div>
                <p className="text-gray-500">{title}</p>
                <h3 className="text-3xl font-bold text-primary">{value}</h3>
            </div>
        </div>
    );
};

export default Card;
