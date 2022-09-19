

const DB_TEST_MANUAL = {
    "000001" : {
      userName: "wallodya",
      name: "Vladimir",
      email: "qwerty@test.com",
      isAdmin: true,
      avatarLink: '../lib/img/default_prof_pic.png',
      friendList: ["000002", "000003", "000004", "000005"],
      isBanned: true
    },
    "000002" : {
      userName: "user123",
      name: "John",
      email: "abc@test.com",
      isAdmin: false,
      avatarLink: '../lib/img/default_prof_pic.png',
      friendList: ["000001", "000003", "000004", "000005"],
      isBanned: true
    },
    "000003" : {
      userName: "_ivan_",
      name: "Иван Иванов",
      email: "ivan4321@test.com",
      isAdmin: false,
      avatarLink: '../lib/img/default_prof_pic.png',
      friendList: ["000001", "000002", "000004", "000005"],
      isBanned: true
    },
    "000004" : {
      userName: "random_user",
      name: "John Smith",
      email: "qwerty@test.com",
      isAdmin: false,
      avatarLink: '../lib/img/default_prof_pic.png',
      friendList: ["000001", "000002", "000003", "000005"],
      isBanned: true
    },
    "000005" : {
      userName: "Dude",
      name: "Имя Фамилия",
      email: "qwerty@test.com",
      isAdmin: false,
      avatarLink: '../lib/img/default_prof_pic.png',
      friendList: ["000001", "000002", "000003", "000004"],
      isBanned: true
    },
  }

const DB_TEST_AUOTOGEN = {}
const DB_TEST_AUOTOGEN_length = 30
for (let i = 6; i<DB_TEST_AUOTOGEN_length; i++) {
  const userId = ('000000' + i).slice(-6)
  // console.log(userId)
  DB_TEST_AUOTOGEN[userId] = {
      userName: `_${userId}_`,
      name: userId + "'s name",
      email: Math.floor(Math.random() * 1000) + "@test.com",
      isAdmin: false,
      avatarLink: '../lib/img/default_prof_pic.png',
      friendList: [
        ('000000' + (i-1)).slice(-6),
        ('000000' + (i-2)).slice(-6),
        ('000000' + (i-3)).slice(-6),
        ('000000' + (i-4)).slice(-6),
        ('000000' + (i-5)).slice(-6),
      ],
      isBanned: !!Math.floor(Math.random() + 1)
  }
}

// console.log('auto generated users:')
// console.dir(DB_TEST_AUOTOGEN)

// Mock DB for testing
export const DB_TEST = {...DB_TEST_MANUAL, ...DB_TEST_AUOTOGEN}

// Imitation of user ID which will be stored in a cookie
// Change this to "login" as a different user
export const userId = "000001"