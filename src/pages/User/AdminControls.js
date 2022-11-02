import React from 'react'
import { useBanUser, useDeleteUser, useUser } from '../../context/UserProvider'
import { SecondaryButton } from '../../elements/buttons/SecondaryButton'

export const AdminControls = () => {

    const { userOwner : { is_banned } } = useUser()
    const handleBanUser = useBanUser()
    const handleDeleteUser = useDeleteUser()

    return (
        <div className="container-flex-row admin-controls">
            <SecondaryButton text={is_banned ? "Remove ban" : "Ban"} onClick={handleBanUser}/>
            <SecondaryButton 
                text={"Delete"}
                onClick={() => {
                    if (window.confirm("You sure you want to delete this user?")) {
                        handleDeleteUser()
                    }
                }}
            />
        </div>
    )
}
