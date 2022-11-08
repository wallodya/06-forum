import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { getUserData, openSession, closeSession } from '../api/api'
import default_prof_pic from '../lib/img/default_prof_pic.png'

const LoginContext = React.createContext()
const LoginUpdateContext = React.createContext()

export const useLogin = () => useContext(LoginContext)
export const useLoginUpdate = () => useContext(LoginUpdateContext)

const emptyUser = {uuid: 0, login: '_', is_admin: false, is_banned: false}

const LoginProvider = ({children}) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || emptyUser)

    const updateUser = async (login) => {
        localStorage.clear()
        if (!login) {
            setUser(emptyUser)
            return
        }
        const data = await getUserData(login)
        console.log('Updating user:')
        console.table(data)
        if (data.avatar === '../lib/img/default_prof_pic.png') data.avatar = default_prof_pic
        localStorage.setItem("user", JSON.stringify(data))
        setUser(JSON.parse(localStorage.getItem("user")))
    }

    // const {} = useQuery(['user', 'session'], () => {
    //     return openSession(user.login)
    // }, {
    //     enabled: !!user
    // })

    useEffect(() => {
        const ID = Date.now().toString(36) + Math.random().toString(36).substr(2)
        
        window.addEventListener('load', () => openSession(user?.uuid, ID))
        window.addEventListener('beforeunload', () => closeSession(user?.uuid, ID))

        return () => {
            window.removeEventListener('load', () => openSession(user?.uuid, ID))
            window.removeEventListener('beforeunload', () => closeSession(user?.uuid, ID))
        }
    })

    return (
        <LoginContext.Provider value={user}>
            <LoginUpdateContext.Provider value={updateUser}>
                {children}
            </LoginUpdateContext.Provider>
        </LoginContext.Provider>
    )
}

export default LoginProvider