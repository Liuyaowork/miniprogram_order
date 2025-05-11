import { model, getAll } from '../../services/_utils/model';
import { config } from '../../config/index';
import { DATA_MODEL_KEY } from '../../config/model';
import { cloudbaseTemplateConfig } from '../../config/index';
import { CART_ITEM, SKU, createId } from '../cloudbaseMock/index';

const CATE_ITEM_MODEL_KEY = DATA_MODEL_KEY.CART_ITEM;

/** 
 * 获取购物车 Mock 数据。
 * @param {Object} params - 参数对象
 * @returns {Promise<Object>} - 返回模拟的购物车分组数据
 */
function mockFetchCartGroupData(params) {
  const { delay } = require('../_utils/delay');
  const { genCartGroupData } = require('../../model/cart');

  return delay().then(() => genCartGroupData(params));
}

/**
 * 获取单个购物车项。
 * @param {{ id: string }} param0 - 购物车项 ID
 * @returns {Promise<Object>} - 返回购物车项数据
 */
export async function getCartItem({ id }) {
  if (cloudbaseTemplateConfig.useMock) {
    // 使用 Mock 数据
    const cartItem = CART_ITEM.find((x) => x._id === id);
    cartItem.sku = SKU.find((sku) => sku._id === cartItem.sku._id); // 关联 SKU 数据
    return { data: cartItem };
  }

  return model()[CATE_ITEM_MODEL_KEY].get({
    filter: {
      where: {
        _id: {
          $eq: id, // 根据 ID 筛选
        },
      },
    },
    select: {
      _id: true, // 购物车项 ID
      count: true, // 商品数量
      sku: {
        _id: true, // SKU ID
        count: true, // SKU 数量
        description: true, // SKU 描述
      },
    },
  });
}

/**
 * 获取所有购物车项。
 * @returns {Promise<Array>} - 返回购物车项列表
 */
export async function fetchCartItems() {
  if (cloudbaseTemplateConfig.useMock) {
    // 使用 Mock 数据
    return CART_ITEM.map((cartItem) => {
      const sku = SKU.find((x) => x._id === cartItem.sku._id);
      return {
        ...cartItem,
        sku, // 关联 SKU 数据
      };
    });
  }

  return getAll({
    name: CATE_ITEM_MODEL_KEY,
    select: {
      _id: true,
      count: true,
      sku: {
        _id: true,
        count: true,
        description: true,
      },
    },
  });
}

/**
 * 创建购物车项。
 * @param {{ skuId: String, count: Number }} param0 - SKU ID 和数量
 * @returns {Promise<void>}
 */
export async function createCartItem({ skuId, count }) {
  if (cloudbaseTemplateConfig.useMock) {
    // 使用 Mock 数据
    CART_ITEM.push({ sku: { _id: skuId }, count, _id: createId() });
    return;
  }
  return await model()[CATE_ITEM_MODEL_KEY].create({
    data: {
      count,
      sku: { _id: skuId },
    },
  });
}

/**
 * 删除购物车项。
 * @param {{ cartItemId: string }} param0 - 购物车项 ID
 * @returns {Promise<void>}
 */
export async function deleteCartItem({ cartItemId }) {
  if (cloudbaseTemplateConfig.useMock) {
    // 使用 Mock 数据
    CART_ITEM.splice(
      CART_ITEM.findIndex((cartItem) => cartItem._id === cartItemId), // 查找并删除购物车项
      1,
    );
    return;
  }
  return await model()[CATE_ITEM_MODEL_KEY].delete({
    filter: {
      where: {
        _id: {
          $eq: cartItemId, // 根据 ID 筛选
        },
      },
    },
  });
}

/**
 * 更新购物车项的数量。
 * @param {{ cartItemId: String, count: Number }} param0 - 购物车项 ID 和新的数量
 * @returns {Promise<void>}
 */
export async function updateCartItemCount({ cartItemId, count }) {
  if (cloudbaseTemplateConfig.useMock) {
    // 使用 Mock 数据
    CART_ITEM.find((x) => x._id === cartItemId).count = count;
    return;
  }
  return await model()[CATE_ITEM_MODEL_KEY].update({
    data: {
      count,
    },
    filter: {
      where: {
        _id: {
          $eq: cartItemId, // 根据 ID 筛选
        },
      },
    },
  });
}

/**
 * 获取购物车分组数据。
 * @param {Object} params - 参数对象
 * @returns {Promise<Object>} - 返回购物车分组数据
 */
export function fetchCartGroupData(params) {
  if (config.useMock) {
    return mockFetchCartGroupData(params);
  }

  return new Promise((resolve) => {
    resolve('real api'); // 实际 API 调用占位
  });
}
