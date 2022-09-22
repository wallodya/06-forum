import { getUsersData } from "./sockets"

// Imitation of user ID which will be stored in a cookie
// Change this to "login" as a different user
export const userId = "000001"

export const addUserToLocalStorage = (_userId) => {
  return new Promise((resolve, reject) => {
    localStorage.clear()
    getUsersData(userId)
      .then(data => {
          for (let key in data) {
              localStorage.setItem(key, data[key])
          }
          resolve()
      })
      .catch(err => {
        console.log(err)
        reject()
      })
  })
}