import React, { useEffect } from 'react'
import { useNavigate, useNavigation } from 'react-router-dom'
import { useLogin } from '../context/LoginProvider'
import { ProfileForm } from '../elements/forms/ProfileForm'

export const Profile = () => {

    const { uuid } = useLogin() 
    const navigate = useNavigate()

    useEffect(() => {
        if (!uuid) {
            navigate('/login', {replace: true})
            return
        }
    })
    
    return (
        <div className='container-flex-column'>
            <ProfileForm />
        </div>
    )
}
