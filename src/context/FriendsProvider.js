import React, { Children, useContext } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { addFriend, deleteFriend, getFriendList } from '../api/api'
import { useLogin } from './LoginProvider'
import { useUser } from './UserProvider'

const FriendsContext = React.createContext()
const UpdateFriendshipStatusContext = React.createContext()

export const useFriends = () => useContext(FriendsContext)
export const useFriendshipButton = () => useContext(UpdateFriendshipStatusContext)

export const FriendsProvider = ({children}) => {
    const { userOwner : { login, uuid : uuidOwner } } = useUser()
    const { login : loginClient, uuid : uuidClient } = useLogin()
    const queryClient = useQueryClient()

    const {
        isLoading: isFriendsLoading,
        isSuccess: isFriendsSuccess,
        isError: isFriendsError,
        error: friendsError,
        data: friends
    } = useQuery(['friends', login], () => {
        return getFriendList(login)
    }, {
        initialData: [
            { uuid: 'initial_1', login: "Loading...", avatar: null, is_banned: false },
            { uuid: 'initial_2', login: "Loading...", avatar: null, is_banned: false },
            { uuid: 'initial_3', login: "Loading...", avatar: null, is_banned: false }
        ]
    })

    const isFriend = !!friends.find(friend => friend.login === loginClient)

    const { mutate : handleFriendshipButton} = useMutation(() => {
        if (isFriend) {
            return deleteFriend(uuidOwner, uuidClient)
        } else {
            return addFriend(uuidOwner, uuidClient)
        }
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries(['friends', login])
        }
    })

    return (
        <FriendsContext.Provider value={{friends: friends, isFriend: isFriend}}>
            <UpdateFriendshipStatusContext.Provider value={handleFriendshipButton}>
                {children}
            </UpdateFriendshipStatusContext.Provider>
        </FriendsContext.Provider>
    )
}
