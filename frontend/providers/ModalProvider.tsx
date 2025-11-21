"use client";

import React, { createContext, useState, ReactNode } from "react";



interface ModalContextType {
    modal: ReactNode | null;
    openModal: (modal: ReactNode) => void;
    closeModal: () => void;
    }

    export const ModalContext = createContext<ModalContextType>({
        modal: null,
        openModal: () => {},
        closeModal: () => {},
    });

    export default function ModalProvider({ children }: { children: ReactNode }) {
    const [modal, setModal] = useState<ReactNode | null>(null);

    const openModal = (modalData: ReactNode) => setModal(modalData);
    const closeModal = () => setModal(null);

    return (
        <ModalContext.Provider value={{ modal, openModal, closeModal }}>
        {children}
        </ModalContext.Provider>
    );
}
