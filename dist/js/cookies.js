import { getUsersData, getFriendList } from "./sockets"
import Cookies from "js-cookie"

// Imitation of user ID which will be stored in a cookie
// Change this to "login" as a different user
export const userId = Cookies.get("UUID") ?? null

// export const setCookie = (_name, _value, _lifeDays) => {
// 	const expDay = new Date()
// 	expDay.setTime(expires.getTime() + _lifeDays * 24 * 60 * 60 * 1000)
// 	let expires = "expires=" + expDay.toUTCString()
// 	document.cookie = `${_name }=${_value};${expires};path=/`
// }

// export const getCookieValue = (_name) => {
//   return document
//           .cookie
//           .split(';')
//           .find(row => row.startsWith(_name))
//           ?.split('=')[1]
// }

// export const deleteCookie = () => {
//   document.cookie = 'expires=18 Dec 2013 12:00:00 UTC;'
// }

export const addUserToLocalStorage = _userId => {
	localStorage.clear()
	return new Promise((resolve, reject) => {
		getUsersData(_userId)
			.then(data => {
				for (let key in data) {
					localStorage.setItem(key, data[key])
				}
				getFriendList(_userId)
				.then(friends => {
					localStorage.setItem('friend_list', friends)
					console.log(`Friend list ${friends} added to LS: `, localStorage.friend_list)
					resolve()
				})
			})
			.catch(err => {
				reject(`Promise in addUserToLocalStorage: promise rejected, err: `, err)				
			})
	})
}
