import React from 'react'
import { useQuery } from 'react-query'
import { getOnlineStatus } from '../../api/api'
import { useUser } from '../../context/UserProvider'
import { millisecondsToHuman } from './mlsToTime'

export const OnlineStatus = ({ isLarge = false , isBanned, uuid}) => {
    const { isLoading, data : status } = useQuery(['user', 'online', uuid], () => {
        if (isNaN(uuid)) return
        return getOnlineStatus(uuid)
    }, {
        initialData: {online: true}
    })
    return (
        isBanned
            ?
            <p className={(isLarge ? "fs-m text-accent-60" : "fs-xs text-accent-40") + " fw-bold"}>banned</p>
            :
            <p
                className={(isLarge ? 'fs-m text-primary-60' : 'fs-xs text-primary-40') + ' ff-body fw-light'}
            >
                {
                    status?.online
                        ? <span>online</span>
                        : status?.lastOnline
                        ? millisecondsToHuman(status?.lastOnline)
                        : <span>loading...</span>
                }
            </p>
    )
}
