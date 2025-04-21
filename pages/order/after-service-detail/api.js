// 从其他模块导入响应数据和工具函数
import { resp } from '../after-service-list/api';
import dayjs from 'dayjs';
import { mockIp, mockReqId } from '../../../utils/mock';

// 格式化时间的工具函数
// @param {string|Date} date - 要格式化的日期
// @param {string} template - 格式化模板
// @returns {string} 格式化后的日期字符串
export const formatTime = (date, template) => dayjs(date).format(template);

// 获取权益详情
// @param {Object} params - 参数对象
// @param {string} params.rightsNo - 权益编号
// @returns {Promise<Object>} 包含权益详情的响应数据
export function getRightsDetail({ rightsNo }) {
  const _resq = {
    data: {},
    code: 'Success',
    msg: null,
    requestId: mockReqId(),
    clientIp: mockIp(),
    rt: 79,
    success: true,
  };
  // 从响应数据中过滤出匹配的权益详情
  _resq.data =
    resp.data.dataList.filter((item) => item.rights.rightsNo === rightsNo) ||
    {};
  return Promise.resolve(_resq);
}

// 取消权益
// @returns {Promise<Object>} 包含取消结果的响应数据
export function cancelRights() {
  const _resq = {
    data: {},
    code: 'Success',
    msg: null,
    requestId: mockReqId(),
    clientIp: mockIp(),
    rt: 79,
    success: true,
  };
  return Promise.resolve(_resq);
}
