import React from 'react'
import { OnlineStatus } from '../onlineStatus/OnlineStatus'
import default_prof_pic from '../../lib/img/default_prof_pic.png'
import './user_badge.css'
import { Link } from 'react-router-dom'

export const UserBadge = ({ user }) => {
    return (
        <Link to={'/' + user.login}>
            <div className='card-round-small container-flex-row full-width user-badge'>
                <img
                    className='avatar-header'
                    src={
                        user.avatar === '../lib/img/default_prof_pic.png' || !user.avatar
                            ? default_prof_pic
                            : user.avatar
                    }
                    alt='username' />
                <div className='badge-legend-container'>
                    <p className='ff-body fs-s fw-regular text-primary-100'>
                        {user.login}
                    </p>
                    <OnlineStatus isBanned={user.is_banned} uuid={user.uuid}/>
                </div>
            </div>
        </Link>
    )
}
