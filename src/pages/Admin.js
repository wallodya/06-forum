import React from 'react'
import { useQuery } from 'react-query'
import { getAllUsers, getDeletedUsers } from '../api/api'
import { CardWideColumn } from '../elements/CardWide/CardWideColumn'
import { DeletedUsersList } from '../elements/usersList/DeletedUsersList'
import { UsersList } from '../elements/usersList/UsersList'
import '../style/global.css'
import '../style/user_profile.css'

export const Admin = () => {

    const { 
        isLoading: isAllUsersLoading,
        isError: isAllUsersError,
        error: allUsersError,
        data: allUsers
    } = useQuery(['user', 'all'], () => {
        return getAllUsers()
    })
    const {
        isLoading: isDeletedLoading,
        isError: isDeletedError,
        error: deletedError,
        data: deletedUsers
    } = useQuery(['user', 'deleted'], () => {
        return getDeletedUsers()
    })
    return (
        <div className='container-flex-column'>
            <CardWideColumn header={'All users'}>
                {
                    isAllUsersLoading
                        ? <div>Loading...</div> 
                        : isAllUsersError
                        ? <div>Error: {allUsersError}</div>
                        : <UsersList users={allUsers} />
                }
            </CardWideColumn>

            <CardWideColumn header={'Deleted users'}>
                {
                    isDeletedLoading
                        ? <div>Loading...</div>
                        : isDeletedError
                        ? <div>Error: {deletedError}</div>
                        : <DeletedUsersList users={deletedUsers} />
                }
            </CardWideColumn>
        </div>
    )
}
