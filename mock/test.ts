import type { mockConfig } from './index'

const list: mockConfig[] = [
  {
    url: '-/api/MoneyMgt/OnlinePaymentList',
    method: 'post',
    response: {
      Success: true,
      Code: 0,
      Message: '执行成功',
      Data: {
        OnlinePaymentTotalAmountData: {
          TotalAmount: 0,
          TotalVirtualPayAmount: 20,
        },
        OnlinePaymentDataList: [
          {
            OnlinePaymentID: 1,
            OnlineBillNo: 'string',
            APIBillNo: 'string',
            BillNo: 'string',
            IPSBillNo: 'string',
            Account: 'string',
            LevelName: 'string',
            VirtualPayAmount: 20,
            ExchangeRate: 5.2,
            VirtualPayRealAmount: 50,
            RealExchangeRate: 54.2,
            Amount: 500,
            RealAmount: 800,
            Name: 'string',
            Code: 'string',
            Status: 1,
            StatusName: 'string',
            Msg: 'string',
            CreateDate: '2023-09-11T00:00:00Z',
            ClosedDate: '',
            CityID: 14,
            ProvinceID: 2,
            ShowRecord: 1,
            ShowRedeem: 1,
            Region: 'string',
            City: 'string',
          },
        ],
      },
      ExtensionData: null,
      Pagination: null,
    },
  },

]

export default list
