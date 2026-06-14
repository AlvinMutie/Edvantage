import React from 'react';
import { Construction } from 'lucide-react';

const Placeholder = ({ title }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
            <div className="p-6 rounded-full bg-slate-900 border border-slate-800 text-primary-500">
                <Construction size={48} />
            </div>
            <h1 className="text-3xl font-bold text-white">{title} Module</h1>
            <p className="text-slate-400 max-w-md">
                We are currently building the {title.toLowerCase()} system. This feature will be available in the next production update.
            </p>
        </div>
    );
};

export default Placeholder;
