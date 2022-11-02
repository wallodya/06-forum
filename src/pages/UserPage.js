import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FriendsProvider } from '../context/FriendsProvider'
import { useLogin } from '../context/LoginProvider'
import { UserProvider } from '../context/UserProvider'
import { User } from './User/User'

export const UserPage = () => {

    const { login } = useParams()
    const user = useLogin()
    const navigate = useNavigate()

    useEffect(() => {
        if (login?.length < 4) {
            navigate('/404')
            return
        }
    })

    return (
        <UserProvider login={login || user?.login || ''}>
            <FriendsProvider>
                <User />
            </FriendsProvider>
        </UserProvider>
    )
}
