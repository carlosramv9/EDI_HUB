import classNames from 'classnames';
import React from 'react';

const LoaderSplash = () => {
    return (
        <div className={classNames(
            'w-full h-full flex items-center justify-center py-8',
            'fixed inset-0 z-50 bg-white/75 dark:bg-[#303135]/75'
        )}>
            <div className="banter-loader">
                <div className="banter-loader__box"></div>
                <div className="banter-loader__box"></div>
                <div className="banter-loader__box"></div>
                <div className="banter-loader__box"></div>
                <div className="banter-loader__box"></div>
                <div className="banter-loader__box"></div>
                <div className="banter-loader__box"></div>
                <div className="banter-loader__box"></div>
                <div className="banter-loader__box"></div>
            </div>
        </div>
    );
};

export default LoaderSplash;
