import React, { useRef } from 'react'
import { useEffect } from 'react'

export const ModalContainer = ({ isOpen, children }) => {
    const modal = useRef()
    useEffect(() => {
        const dialogNode = modal.current
        isOpen
            ? dialogNode?.showModal()
            : dialogNode?.close()  
    },[isOpen])

    return (
        <dialog ref={modal} className={"card"}>
            {children}
        </dialog>
    )
}
