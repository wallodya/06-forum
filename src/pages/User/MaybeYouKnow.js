import React from 'react'
import { useQuery } from 'react-query'
import { getMaybeYouKnowList } from '../../api/api'
import { useUser } from '../../context/UserProvider'
import { CardWideColumn } from '../../elements/CardWide/CardWideColumn'
import { UsersList } from '../../elements/usersList/UsersList'

export const MaybeYouKnow = () => {

    const { isOwner, userOwner: user } = useUser()

    const {
        isLoading: isMaybeYouKnowLoading,
        isError: isMaybeYouKnowError,
        error: maybeYouKnowError,
        data: maybeYouKnow
    } = useQuery(['maybeYouKnow', user.login], () => {
        return getMaybeYouKnowList(user.login)
    }, {
        enabled: isOwner,
        initialData: [
            { uuid: 'initial_1', login: "Loading...", avatar: null, is_banned: false },
            { uuid: 'initial_2', login: "Loading...", avatar: null, is_banned: false },
            { uuid: 'initial_3', login: "Loading...", avatar: null, is_banned: false }
        ]
    })

    return (
        <CardWideColumn header={"Maybe you know"}>
            {
                isMaybeYouKnowLoading
                    ? <div>Loading...</div>
                    : isMaybeYouKnowError
                        ? <div>Error: {maybeYouKnowError}</div>
                        : <UsersList key={'maybe you know'} users={maybeYouKnow} />
            }
        </CardWideColumn>
    )
}
