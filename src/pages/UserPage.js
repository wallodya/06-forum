import React from 'react'
import { useParams } from 'react-router-dom'
import { FriendsProvider } from '../context/FriendsProvider'
import { useLogin } from '../context/LoginProvider'
import { UserProvider } from '../context/UserProvider'
import { User } from './User/User'

export const UserPage = () => {

    const { login } = useParams()
    const user = useLogin()

    return (
        <UserProvider login={login || user?.login || ''}>
            <FriendsProvider>
                <User />
            </FriendsProvider>
        </UserProvider>
    )
}
