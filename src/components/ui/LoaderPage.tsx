import React from 'react';

const LoaderPage = () => {
    return (
        <div className='w-full h-full flex items-center justify-center bg-gray-50 py-8'>
            <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500'></div>
        </div>
    );
};

export default LoaderPage;
