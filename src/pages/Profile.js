import React from 'react'
import { useNavigate, useNavigation } from 'react-router-dom'
import { useLogin } from '../context/LoginProvider'
import { ProfileForm } from '../elements/forms/ProfileForm'

export const Profile = () => {

    const { user } = useLogin() 
    const navigate = useNavigate()

    if (!user) {
        navigate('/login', {replace: true})
    }
    
    return (
        <div className='container-flex-column'>
            <ProfileForm />
        </div>
    )
}
