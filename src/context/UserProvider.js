import React, { useContext, useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { useLogin } from './LoginProvider'
import { getUserData, deleteUser, changeBanStatus } from '../api/api'

const UserContext = React.createContext()
const DeleteUserContext = React.createContext()
const BanUserContext = React.createContext()

export const useUser = () => useContext(UserContext)   
export const useDeleteUser = () => useContext(DeleteUserContext)
export const useBanUser = () => useContext(BanUserContext)

export const UserProvider = ({ login,  children }) => {

    const userClient = useLogin()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    // const [userOwner, setUserOwner] = useState(null)
    const isOwner = userClient?.login === login

    let {
        data: userOwner
    } = useQuery(['user', login], () => {
        return getUserData(login)
    }, {
        enabled: !isOwner,
        initialData: {
            uuid: "initial_0",
            login: "Loading...",
            email: "Loading...",
            avatar: null,
            is_banned: false
        }
    })

    if (isOwner) userOwner = userClient
    useEffect(() => {
        if (userOwner === 'deleted') {
            console.log('User was deleted')
            navigate('/deleted')
        }
        if (userOwner === null)  {
            navigate('/404')
        }
    }, [userOwner])


    const { mutate : handleBanUser } = useMutation(() => {
        changeBanStatus(login)
    } , {
            onSuccess: () => {
                console.log('ban success')
                queryClient.invalidateQueries(['user', login])
            }
        }
    )

    const { mutate : handleDeleteUser } = useMutation(() => {
        deleteUser(login)
    } , {
            onSuccess: () => {
                navigate('/admin')
                queryClient.removeQueries(['users', login])
                queryClient.invalidateQueries(['users', 'all'])
                queryClient.invalidateQueries(['users', 'deleted'])
            }
        }
    )

    return (
        <UserContext.Provider value={{userOwner: userOwner ?? {}, isOwner: isOwner}}>
            <DeleteUserContext.Provider value={handleDeleteUser}>
                <BanUserContext.Provider value={handleBanUser}>
                    {children}
                </BanUserContext.Provider>
            </DeleteUserContext.Provider>
        </UserContext.Provider>
    )
}
