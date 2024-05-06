import request, { type Pagination } from '@/utils/request'

export function GetVIPAwardTypes() {
  return request<RespVIPAwardType[]>({
    url: '/api/ActivityMgt/GetVIPPreferentialType',
  })
}

export function GetVIPAwardReleaseList(data: ReqGetVIPAwardRelease) {
  return request<RespGetVIPAwardRelease[]>({
    url: '/api/ActivityMgt/GetVIPPreferentialReleaseList',
    method: 'post',
    data,
  })
}

export function GetCommRateList(data: ReqCommRateList) {
  return request<RespCommRate[]>({
    url: '/api/ActivityMgt/GetCommRateList',
    method: 'post',
    data,
  })
}

export function AddCommRate(data: ReqAddCommRate) {
  return request<number>({
    url: '/api/ActivityMgt/AddCommRate',
    method: 'post',
    data,
  })
}

export function EditCommRate(data: ReqEditCommRate) {
  return request<number>({
    url: '/api/ActivityMgt/EditCommRate',
    method: 'post',
    data,
  })
}

export function DeleteCommRate(data: { SID: number }) {
  return request<number>({
    url: '/api/ActivityMgt/DeleteCommRate',
    method: 'post',
    data,
  })
}

export function AddActivity(data: ReqAddActivity) {
  return request<number>({
    url: '/api/ActivityMgt/AddActivity',
    method: 'post',
    data,
  })
}

export function EditActivity(data: ReqAddActivity & { ActivityID: number }) {
  return request<number>({
    url: '/api/ActivityMgt/EditActivity',
    method: 'post',
    data,
  })
}

export function CancelActivity(data: { ActivityID: number }) {
  return request<number>({
    url: '/api/ActivityMgt/TerminateActivity',
    method: 'post',
    data,
  })
}

export function DelActivity(data: { ActivityID: number }) {
  return request<number>({
    url: '/api/ActivityMgt/DeleteActivity',
    method: 'post',
    data,
  })
}

export function EditActivitySeq(data: ReqEditActivitySeq) {
  return request<number>({
    url: '/api/ActivityMgt/EditActivitySequence',
    method: 'post',
    data,
  })
}

export function GetActivities(data: ReqGetActivities) {
  return request<RespGetActivity[]>({
    url: '/api/ActivityMgt/ActivityList',
    method: 'post',
    data,
  })
}

export function GetActivity(data: { ActivityID: number }) {
  return request<RespGetActivityDetail>({
    url: '/api/ActivityMgt/ActivityDetail',
    method: 'post',
    data,
  })
}

export function GetActivityAuditList(data: ReqGetActivityAuditList) {
  return request<RespGetActivityAuditList[]>({
    url: '/api/ActivityMgt/ActivityAuditList',
    method: 'post',
    data,
  })
}

export function ReviewActivityAudit(data: ReqReviewActivityAudit) {
  return request<RespReviewActivityAudit>({
    url: '/api/ActivityMgt/ActivityAuditVerify',
    method: 'post',
    data,
  })
}

export function GetActivityModuleTypes(data: { DictionaryID: number }) {
  return request<RespGetActivityModuleType[]>({
    url: '/api/ActivityMgt/ActivityModuleTypeCBList',
    method: 'post',
    data,
  })
}

export function GetActivityModules(data: ReqGetActivityModules) {
  return request<RespGetActivityModule[]>({
    url: '/api/ActivityMgt/ActivityModuleList',
    method: 'post',
    data,
  })
}

export function AddActivityModule(data: Omit<ReqEditActivityModule, 'ModuleID'>) {
  return request<number>({
    url: '/api/ActivityMgt/AddActivityModule',
    method: 'post',
    data,
  })
}

export function EditActivityModule(data: ReqEditActivityModule) {
  return request<number>({
    url: '/api/ActivityMgt/EditActivityModule',
    method: 'post',
    data,
  })
}

export function DelActivityModule(data: { ModuleID: number }) {
  return request<number>({
    url: '/api/ActivityMgt/DeleteActivityModule',
    method: 'post',
    data,
  })
}

export function GetActivityModule(data: { ModuleID: number }) {
  return request<ReqEditActivityModule>({
    url: '/api/ActivityMgt/GetActivityModule',
    method: 'post',
    data,
  })
}

export function GetActivityDictionaries() {
  return request<RespGetActivityDictionary[]>({
    url: '/api/ActivityMgt/ActivityDictionaryCBList',
  })
}

export function GetActivitySimpleModules(data: { DictionaryID: number }) {
  return request<RespGetActivitySimpleModule[]>({
    url: '/api/ActivityMgt/ActivityModuleCBList',
    method: 'post',
    data,
  })
}

export function GetMemberCommissions(data: ReqGetMemberCommissions) {
  return request<RespGetMemberCommission[]>({
    url: '/api/ActivityMgt/GetMemberCommissionList',
    method: 'post',
    data,
  })
}

export function GetBonusReceiveLogs(data: ReqGetBonusReceiveLogs) {
  return request<RespGetBonusReceiveLog[]>({
    url: '/api/ActivityMgt/GetActivityBonusReceiveRecordList',
    method: 'post',
    data,
  })
}

export function GetTaskTags() {
  return request<RespGetTaskTag[]>({
    url: '/api/ActivityMgt/TaskTagList',
  })
}

export function AddTaskTag(data: { TagName: string }) {
  return request<number>({
    url: '/api/ActivityMgt/AddTaskTag',
    method: 'post',
    data,
  })
}

export function SortTaskTag(data: ReqSortTaskTag) {
  return request<number>({
    url: '/api/ActivityMgt/SequenceEditTaskTag',
    method: 'post',
    data,
  })
}

export function DelTaskTag(data: { TagID: number }) {
  return request<number>({
    url: '/api/ActivityMgt/DeleteTaskTag',
    method: 'post',
    data,
  })
}

export function GetTasks(data: ReqGetTasks) {
  return request<RespGetTask[]>({
    url: '/api/ActivityMgt/TaskList',
    method: 'post',
    data,
  })
}

export function AddTask(data: ReqAddTask) {
  return request<number>({
    url: '/api/ActivityMgt/AddTask',
    method: 'post',
    data,
  })
}

export function EditTask(data: ReqEditTask) {
  return request<number>({
    url: '/api/ActivityMgt/EditTask',
    method: 'post',
    data,
  })
}

export function DelTask(data: { TaskID: number }) {
  return request<number>({
    url: '/api/ActivityMgt/DeleteTask',
    method: 'post',
    data,
  })
}

export function StopTask(data: { TaskID: number }) {
  return request<number>({
    url: '/api/ActivityMgt/TerminateTask',
    method: 'post',
    data,
  })
}

interface ReqEditTask {
  TaskID: number
  Name: string
  ActivityModuleID: number
  TagID: number
  DisplayStartDate: string
  IsPC: number
  PCImg: string
  IsH5: number
  H5Img: string
  Rule: string
  StartDate: string
  EndDate: string
  IsExpiredContinue: number
}
type ReqAddTask = Omit<ReqEditTask, 'TaskID'>
interface RespGetTask {
  TaskID: number
  TaskTagName: string
  TaskName: string
  ActivityModuleName: string
  IsExpiredContinue: number
  Status: number
  StartDate: string
  EndDate: string
  ModifyDate: string
  Account: string
  ActivityModuleID: number
  DisplayStartDate: string
  PCImg: string
  H5Img: string
  Rule: string
}
interface ReqGetTasks {
  Name: string
  TagID: number
  ActivityModuleID: number
  Status: number
  DateType: number
  StartDate: string
  EndDate: string
  Pagination: Pagination
}
interface ReqSortTaskTag {
  TagID: number
  Type: number
}
interface RespGetTaskTag {
  TagID: number
  Name: string
}
interface ReqGetBonusReceiveLogs {
  StartDate: string
  EndDate: string
  Account: string
  DictionaryID: number
  Note: string
  Title: string
  ModuleID: number
  Pagination: Pagination
}
interface RespGetBonusReceiveLog {
  ReceiveTime: string
  ActivityItemName: string
  Name: string
  ModuleName: string
  Account: string
  Bonus: number
  Note: string
}
interface RespGetMemberCommission {
  ExcuteDate: string
  GrossCommPoint: number
  GrossTotalBet: number
  ElectronicGameTotalBet: number
  ElectronicGameCommPoint: number
  ElectronicGameCommRate: number
  LiveGameTotalBet: number
  LiveGameCommPoint: number
  LiveGameCommRate: number
  SportGameTotalBet: number
  SportGameCommPoint: number
  SportGameCommRate: number
}
interface ReqGetMemberCommissions {
  Account: string
  StartDate: string
  EndDate: string
  Pagination: Pagination
}
interface RespGetActivitySimpleModule {
  ModuleID: number
  ModuleName: string
}
interface RespGetActivityDictionary {
  DictionaryID: number
  ActivityItemName: string
}
interface ReqEditActivityModule {
  ModuleID: number
  DictionaryID: number
  ModuleTypeID: number
  DisplayName: string
  SubName?: string
  Name: string
  ImgType?: number
  Img?: string
  Bonus?: number
  MultipleFlow: number
  BonusStats?: number
  Distribute?: number
  RookieData?: {
    AccumulationData?: {
      TotalDepositAmount: number
      TotalValidBet: number
    }
    RookieSingleData?: {
      GameType: number
      DepositAmount: number
      ValidBet: number
    }
    RookieBasicData?: {
      Cellphone: number
      Mail: number
      VirtualWallet: number
      IPLimit: number
    }
    RookieDepositWithdrawDala?: {
      IsDeposit: number
      IsWithdraw: number
    }
  }
  CommonModuleData?: {
    CommonModuleDepositData?: {
      PaymentTypeID: number
      ConditionID: number
      Target: number
    }
    CommonModuleBetData?: {
      ConditionID: number
      GamePlatform: number
      GameTypeID: number
      Target: number
    }
    CommonModuleLoginData?: {
      DeviceList: number[]
      Target: number
    }
    CommonModuleModulesData?: {
      ModuleIDList: number[]
    }
  }
  GameRaceData?: {
    ConditionData: {
      BetLimitData: {
        IsLimitBetAmount: boolean
        MinLimit: number
        MaxLimit: number
      }
      TargetData: {
        PlatformID: number
        GameTypeID: number
        GameCode: string
      }
    }
    BonusDataList: {
      StartPlace: number
      EndPlace: number
      Bonus: number
    }[]
  }
}
interface RespGetActivityModule {
  ModuleID: number
  DictionaryID: number
  TypeID: number
  DisplayName: string
  Name: string
  Contents: string
  BonusStats: number
  Distribute: number
  ModifyDate: string
  Account: string
  IsUsed: number
}
interface ReqGetActivityModules {
  DictionaryID: number
  ModuleTypeID: number
  ModuleID: number
  DisplayName: string
  Name: string
  BonusStats: number
  Distribute: number
  Pagination: Pagination
}
interface RespGetActivityModuleType {
  ModuleTypeID: number
  ModuleTypeName: string
}
interface RespReviewActivityAudit {
  SuccessCount: number
  FailCount: number
}
interface ReqReviewActivityAudit {
  IDList: number[]
  Status: number
  Bonus: number
  Note: string
  MailContent: string
}
interface RespGetActivityAuditList {
  ID: number
  Account: string
  ActivityItemName: string
  Name: string
  ActivityModuleName: string
  Bonus: number
  RealBonus: number
  MultipleFlow: number
  RealMultipleFlow: number
  CreateDate: string
  ReviewDate: string
  Status: number
  OperationAccount: string
}
interface ReqGetActivityAuditList {
  Account: string
  DictionaryID: number
  Name: string
  ModuleID: number
  DateType: number
  StartDate: string
  EndDate: string
  Status: number
  Pagination: Pagination
}
interface RespGetActivityDetail {
  ActivityID: number
  DictionaryID: number
  ActivityType: string
  DeviceCommGroupID: number
  ActivityStartTime: string
  ActivityEndTime: string
  DisplayStartTime: string
  DisplayEndTime: string
  ShowApplyBtn: boolean
  IsDuplicateApply: boolean
  Choose: number
  ActivityModuleID: string
  ActivityModuleIDList: number[]
  ActivityContnets: {
    LangID: number
    Name: string
    ActivityTarget: string
    PicURLforPC: string
    PicURLforAPP: string
    InnerPagePicForPC: string
    InnerPagePicForAPP: string
    HyperLinkForPC: string
    HyperLinkForAPP: string
    ActivityOverview: string
    ActivityContent: string
    ActivityRule: string
  }[]
}
interface RespGetActivity {
  ActivityID: number
  JPName: string
  CNName: string
  DictionaryID: number
  DeviceCommGroupID: number
  DisplayStartTime: string
  DisplayEndTime: string
  ActivityStartTime: string
  ActivityEndTime: string
  ActivityTypeStr: string
  ActivityModule: string
  Sequence: number
  Account: string
  Status: number
}
interface ReqGetActivities {
  Name: string
  DisplayTime: string
  DictionaryID: number
  ActivityTypeID: number
  Status: number
  Pagination: Pagination
}
interface ReqEditActivitySeq {
  ActivityID: number
  Type: number
}
interface ReqAddActivity {
  DictionaryID: number
  ActivityTypeList: {
    ID: number
  }[]
  ActivityContentList: {
    LangID: number
    Name: string
    ActivityTarget: string
    PicURLforPC: string
    PicURLforAPP: string
    InnerPagePicForPC: string
    InnerPagePicForAPP: string
    HyperLinkForPC: string
    HyperLinkForAPP: string
    ActivityOverview: string
    ActivityContent: string
    ActivityRule: string
  }[]
  DeviceCommGroupID: number
  ActivityStartTime: string
  ActivityEndTime: string
  DisplayStartTime: string
  DisplayEndTime: string
  ShowApplyBtn: boolean
  IsDuplicateApply: boolean
  ActivityModuleIDList?: number[]
}
interface ReqEditCommRate {
  SID: number
  CommRate: number
}
interface ReqAddCommRate {
  LevelID: number
  GameTypeID: number
  PlatformID: number
  SetTypeID: number
  GameCode: string
  CommRate: number
  StartDate: string
  EndDate: string
}
interface RespCommRate {
  SID: number
  Level: number
  LevelName: string
  Name: string
  CommRate: number
  DateRange: string
}
interface ReqCommRateList {
  LevelID: number
  GameTypeID: number
  PlatformID: number
  SetTypeID: number
  Pagination: Pagination
}
interface RespVIPAwardType {
  PreferentialType: number
  TypeName: string
  TypeEName: string
}
interface RespGetVIPAwardRelease {
  Date: string
  Account: string
  TypeName: string
  ChangePoint: number
}
interface ReqGetVIPAwardRelease {
  Account: string
  Date_Start: string
  Date_End: string
  PreferentialType: number
  Pagination: Pagination
}
