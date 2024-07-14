import React, { ReactNode } from 'react';

interface ModalProps {
    isVisible: boolean;
    onClose: () => void;
    children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isVisible, onClose, children }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className=" bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/2 lg:w-1/3">
                <div className='flex justify-between'>
                    <h2 className="text-lg font-semibold mb-2">Crop your picture</h2>
                    <button onClick={onClose} className="hover:text-[#171717] focus:shadow-sm text-right text-gray-500" >
                        &times;
                    </button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
};

export default Modal;