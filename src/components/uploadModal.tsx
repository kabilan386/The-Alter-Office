import React, { ReactNode } from 'react';

interface UploadModalProps {
    isVisible: boolean;
    onClose: () => void;
    children: ReactNode;
}

const UploadModal: React.FC<UploadModalProps> = ({ isVisible, onClose, children }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className=" bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/2 lg:w-1/3">
                <div className='flex items-start justify-between'>
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Upload image(s)</h2>
                        <p className='text-[16px]'>You may upload up to 5 images</p>
                    </div>
                    <button className="text-right text-gray-500" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
};

export default UploadModal;