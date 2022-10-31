import React from 'react'
import { UserBadge } from '../userBadge/UserBadge'

export const UsersList = ({users}) => {
  return (
    <div className='container-grid-auto-columns full-width'>
        {users.map(user => <UserBadge key={user.uuid} user={user}/>)}
    </div>
  )
}
