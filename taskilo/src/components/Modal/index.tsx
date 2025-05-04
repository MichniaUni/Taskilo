import React from 'react'
import ReactDOM from 'react-dom';
import Header from '../Header';
import { X } from 'lucide-react';

type Props = {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    name: string;
}

const Modal = ({ children, isOpen, onClose, name }: Props) => {
    if (!isOpen) return null;

  return (
    ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl rounded-lg bg-white p-4 shadow-lg dark:bg-dark-secondary z-50 pointer-events-auto">
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
                {children}
            </div>
        </div>,
        document.body,
    )
  )
}

export default Modal