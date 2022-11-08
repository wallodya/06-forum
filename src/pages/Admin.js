import React, { useEffect } from 'react'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { getAllUsers, getDeletedUsers } from '../api/api'
import { useLogin } from '../context/LoginProvider'
import { CardWideColumn } from '../elements/CardWide/CardWideColumn'
import { DeletedUsersList } from '../elements/usersList/DeletedUsersList'
import { UsersList } from '../elements/usersList/UsersList'
import '../style/global.css'
import '../style/user_profile.css'

export const Admin = () => {

    const navigate = useNavigate()
    const { is_admin } = useLogin()

    const { 
        isFetched: isAllUsersFetched,
        isLoading: isAllUsersLoading,
        isError: isAllUsersError,
        error: allUsersError,
        data: allUsers
    } = useQuery(['user', 'all'], () => {
        return getAllUsers()
    }, {
        enabled: is_admin
    })
    const {
        isFetched: isDeletedUsersFetched,
        isLoading: isDeletedLoading,
        isError: isDeletedError,
        error: deletedError,
        data: deletedUsers
    } = useQuery(['user', 'deleted'], () => {
        return getDeletedUsers()
    }, {
        enabled: is_admin
    })

    useEffect(() => {
        if (!is_admin) {
            navigate('/login')
            return
        }
    })

    return (
        <div className='container-flex-column'>
            <CardWideColumn header={'All users'}>
                {
                    isAllUsersLoading
                        ? <div>Loading...</div> 
                        : isAllUsersError
                        ? <div>Error: {allUsersError}</div>
                        : isAllUsersFetched  
                        ? <UsersList users={allUsers} />
                        : <></>
                }
            </CardWideColumn>

            <CardWideColumn header={'Deleted users'}>
                {
                    isDeletedLoading
                        ? <div>Loading...</div>
                        : isDeletedError
                        ? <div>Error: {deletedError}</div>
                        : isDeletedUsersFetched
                        ? <DeletedUsersList users={deletedUsers} />
                        :<></>
                }
            </CardWideColumn>
        </div> 
    )
}
