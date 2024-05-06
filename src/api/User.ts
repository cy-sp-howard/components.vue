import request, { type RespBodyWrapper } from '@/utils/request'

export function Login() {
  return Promise.resolve({ Code: 0, Data: { AccessToken: 'token' } })
}

export function Logout() {
  return Promise.resolve({ Code: 0, Data: 0 })
}

export function GetUserMenu(): Promise<RespBodyWrapper<RespUserMenu[]>> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        Code: 0,
        ExtensionData: null,
        Message: '',
        Success: true,
        Pagination: null,
        Data: [
          {
            MenuID: 1,
            MenuName: 'FirstGroup',
            MainPageID: 0,
            ParentMenuID: 0,
            Level: 0,
            Sort: 1,
            Description: '第一層分類',
          },
          {
            MenuID: 2,
            MenuName: 'SecondGroup',
            MainPageID: 0,
            ParentMenuID: 0,
            Level: 0,
            Sort: 2,
            Description: '第一層分類2',
          },

          {
            MenuID: 3,
            MenuName: 'Child1',
            MainPageID: 1,
            ParentMenuID: 1,
            Level: 1,
            Sort: 1,
            Description: '第二層分類1',
          },
          {
            MenuID: 6,
            MenuName: 'Child2',
            MainPageID: 1,
            ParentMenuID: 1,
            Level: 1,
            Sort: 2,
            Description: '第二層2',
          },
          {
            MenuID: 4,
            MenuName: 'ChildChild1',
            MainPageID: 3,
            ParentMenuID: 3,
            Level: 1,
            Sort: 2,
            Description: '第三層1',
          },
          {
            MenuID: 5,
            MenuName: 'ChildChild2',
            MainPageID: 3,
            ParentMenuID: 3,
            Level: 1,
            Sort: 1,
            Description: '第三層2',
          },
        ],
      })
    }, 100)
  })
}

export function GetPermission(data: ReqPermission) {
  return request<RespPermission[]>({
    url: '/api/User/GetUserPagePermission',
    method: 'post',
    data,
  })
}

export function CheckOnline() {
  return Promise.resolve({
    Code: 0,
    Data: {
      NowDate: Date.now(),
      RefreshToken: 'token-' + Date.now(),
    },
  })
}

// interface RespCheckOnline {
//   NowDate: string
//   RefreshToken: string
// }
interface ReqPermission {
  MainPageID: number
}

interface RespPermission {
  FunctionID: number
  FunctionName: string
}

// interface ReqLogin {
//   Account: string
//   Password: string
// }

// interface RespLogin {
//   AccessToken: string
// }

interface RespUserMenu {
  MenuID: number
  MenuName: string
  MainPageID: number
  ParentMenuID: number
  Level: number
  Sort: number
  Description: string
}
