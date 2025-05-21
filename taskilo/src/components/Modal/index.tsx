import React from 'react'
import ReactDOM from 'react-dom';
import Header from '../Header';
import { X } from 'lucide-react';

// Props definition for the modal component
type Props = {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    name: string;
}

// Modal component
const Modal = ({ children, isOpen, onClose, name }: Props) => {
    // If not open, render nothing
    if (!isOpen) return null;
  
  // Render the modal using a React portal
  return (
    ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
            {/* Modal content container */}
            <div className="w-full max-w-2xl rounded-lg bg-white p-4 shadow-lg dark:bg-dark-secondary z-50 pointer-events-auto">
                {/* Reusable header with title and close button */}
                <Header
                    name={name}
                    buttonComponent={
                        <button
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-primary text-white hover:bg-blue-600"
                            onClick={onClose}
                            aria-label="Close"
                        >
                            <X size={18} />
                        </button>
                    }
                    isSmallText
                />
                {/* Modal body content */}
                {children}
            </div>
        </div>,
        document.body,
    )
  )
}

export default Modal