import React from 'react'
import { useQuery } from 'react-query'
import { getFriendList } from '../../api/api'
import { useFriends } from '../../context/FriendsProvider'
import { useUser } from '../../context/UserProvider'
import { CardWideColumn } from '../../elements/CardWide/CardWideColumn'
import { UsersList } from '../../elements/usersList/UsersList'

export const FriendList = () => {

    const { userOwner : { login } } = useUser()
    const { friends } = useFriends()

    return (
        <CardWideColumn header={"Friends"}>
            <UsersList key={'friends'} users={friends} />
        </CardWideColumn>
    )
}
