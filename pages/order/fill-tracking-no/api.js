import { mockIp, mockReqId } from '../../../utils/mock';

/**
 * 模拟创建操作的 API 调用。
 * @returns {Promise<Object>} 返回一个包含模拟响应数据的 Promise。
 */
export function create() {
  const _resq = {
    data: null,
    code: 'Success',
    msg: null,
    requestId: mockReqId(),
    clientIp: mockIp(),
    rt: 79,
    success: true,
  };
  return Promise.resolve(_resq);
}

/**
 * 模拟更新操作的 API 调用。
 * @returns {Promise<Object>} 返回一个包含模拟响应数据的 Promise。
 */
export function update() {
  const _resq = {
    data: null,
    code: 'Success',
    msg: null,
    requestId: mockReqId(),
    clientIp: mockIp(),
    rt: 79,
    success: true,
  };
  return Promise.resolve(_resq);
}

/**
 * 获取快递公司列表的模拟 API 调用。
 * @returns {Promise<Object>} 返回一个包含快递公司列表的 Promise。
 */
export function getDeliverCompanyList() {
  const _resq = {
    data: [
      {
        name: '中通快递',
        code: '0001',
      },
      {
        name: '申通快递',
        code: '0002',
      },
      {
        name: '圆通快递',
        code: '0003',
      },
      {
        name: '顺丰快递',
        code: '0004',
      },
      {
        name: '百世快递',
        code: '0005',
      },
      {
        name: '韵达快递',
        code: '0006',
      },
      {
        name: '邮政快递',
        code: '0007',
      },
      {
        name: '丰网快递',
        code: '0008',
      },
      {
        name: '顺丰直邮',
        code: '0009',
      },
    ],
  };
  return Promise.resolve(_resq);
}
