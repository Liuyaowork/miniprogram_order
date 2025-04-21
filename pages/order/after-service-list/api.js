/* eslint-disable */
import { mockIp, mockReqId } from '../../../utils/mock'; // 引入模拟工具

export const resp = {
  data: {
    pageNum: 1, // 当前页码
    pageSize: 10, // 每页数据条数
    totalCount: 51, // 数据总条数
    states: {
      audit: 1, // 待审核数量
      approved: 6, // 已审核数量
      complete: 2, // 已完成数量
      closed: 1, // 已关闭数量
    },
    dataList: [], // 数据列表
  },
  code: 'Success', // 响应状态码
  msg: null, // 响应消息
  requestId: mockReqId(), // 模拟请求ID
  clientIp: mockIp(), // 模拟客户端IP
  rt: 79, // 响应时间
  success: true, // 请求是否成功
};

export function getRightsList({ parameter: { afterServiceStatus, pageNum } }) {
  // 模拟获取售后服务列表的接口
  const _resq = JSON.parse(JSON.stringify(resp)); // 深拷贝响应数据
  if (pageNum > 3) _resq.data.dataList = []; // 模拟超过3页时无更多数据
  if (afterServiceStatus > -1) {
    // 根据售后状态过滤数据
    _resq.data.dataList = _resq.data.dataList.filter(
      (item) => item.rights.rightsStatus === afterServiceStatus,
    );
  }
  return Promise.resolve(_resq); // 返回模拟的Promise对象
}
