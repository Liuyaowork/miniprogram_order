import { DATA_MODEL_KEY } from '../../config/model';
import { getAll, model } from '../_utils/model';
import { cloudbaseTemplateConfig } from '../../config/index';
import { DELIVERY_INFO, createId } from '../cloudbaseMock/index';

const DELIVERY_INFO_MODEL_KEY = DATA_MODEL_KEY.DELIVERY_INFO;

/**
 * 获取所有地址信息。
 * @returns {Promise<Array>} - 返回地址信息列表
 */
export async function getAllAddress() {
  if (cloudbaseTemplateConfig.useMock) {
    // 使用 Mock 数据
    return DELIVERY_INFO;
  }
  return getAll({
    name: DELIVERY_INFO_MODEL_KEY,
    select: {
      _id: true, // 地址 ID
      phone: true, // 电话号码
      address: true, // 地址详情
      name: true, // 收件人姓名
    },
  });
}

/**
 * 创建新地址。
 * @param {{
 *   name: String, // 收件人姓名
 *   address: String, // 地址详情
 *   phone: String, // 电话号码
 * }} param0
 * @returns {Promise<void>}
 */
export function createAddress({ name, address, phone }) {
  if (cloudbaseTemplateConfig.useMock) {
    // 使用 Mock 数据
    DELIVERY_INFO.push({
      address,
      name,
      phone,
      _id: createId(), // 生成唯一 ID
    });
    return;
  }
  return model()[DELIVERY_INFO_MODEL_KEY].create({
    data: {
      name,
      address,
      phone,
    },
  });
}

/**
 * 更新地址信息。
 * @param {{
 *   name: String, // 收件人姓名
 *   address: String, // 地址详情
 *   phone: String, // 电话号码
 *   _id: String, // 地址 ID
 * }} props
 * @returns {Promise<void>}
 */
export function updateAddress(props) {
  const { name, address, phone, _id } = props;
  if (cloudbaseTemplateConfig.useMock) {
    // 使用 Mock 数据
    Object.assign(
      DELIVERY_INFO.find((x) => x._id === _id), // 查找并更新地址
      props,
    );
    return;
  }
  return model()[DELIVERY_INFO_MODEL_KEY].update({
    data: {
      name,
      address,
      phone,
    },
    filter: {
      where: {
        _id: { $eq: _id }, // 根据 ID 筛选
      },
    },
  });
}

/**
 * 删除地址信息。
 * @param {{ id: String }} param0 - 地址 ID
 * @returns {Promise<void>}
 */
export function deleteAddress({ id }) {
  if (cloudbaseTemplateConfig.useMock) {
    // 使用 Mock 数据
    DELIVERY_INFO.splice(
      DELIVERY_INFO.findIndex((x) => x._id === id), // 查找并删除地址
      1,
    );
    return;
  }
  return model()[DELIVERY_INFO_MODEL_KEY].delete({
    filter: {
      where: {
        _id: {
          $eq: id, // 根据 ID 筛选
        },
      },
    },
  });
}

/**
 * 获取单个地址信息。
 * @param {{ id: String }} param0 - 地址 ID
 * @returns {Promise<Object>} - 返回地址详情
 */
export async function getAddress({ id }) {
  return (
    await model()[DELIVERY_INFO_MODEL_KEY].get({
      filter: {
        where: {
          _id: {
            $eq: id, // 根据 ID 筛选
          },
        },
      },
    })
  ).data;
}
