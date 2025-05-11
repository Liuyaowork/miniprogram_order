import { model, getAll } from '../_utils/model';
import { DATA_MODEL_KEY } from '../../config/model';
import { cloudbaseTemplateConfig } from '../../config/index';
import { SKU, SPU, ATTR_VALUE } from '../cloudbaseMock/index';

const SKU_MODEL_KEY = DATA_MODEL_KEY.SKU; // SKU 数据模型键

/**
 * 获取 SKU 详情
 * @param {String} skuId - SKU 的 ID
 */
export async function getSkuDetail(skuId) {
  if (cloudbaseTemplateConfig.useMock) {
    // 如果使用 Mock 数据
    const sku = SKU.find((x) => x._id === skuId); // 查找 SKU
    sku.attr_value = ATTR_VALUE.filter((x) => x.sku.find((x) => x._id === skuId)); // 获取属性值
    sku.spu = SPU.find((spu) => spu._id === sku.spu._id); // 获取关联的 SPU
    return sku;
  }

  // 如果不使用 Mock 数据，调用数据模型接口获取 SKU 详情
  const { data } = await model()[SKU_MODEL_KEY].get({
    filter: {
      where: {
        _id: { $eq: skuId }, // 匹配 SKU ID
      },
    },
    select: {
      _id: true, // 选择 SKU ID
      count: true, // 选择库存数量
      price: true, // 选择价格
      image: true, // 选择图片
      attr_value: {
        value: true, // 选择属性值
        _id: true, // 选择属性值 ID
      },
      spu: {
        name: true, // 选择 SPU 名称
      },
    },
  });
  return data;
}

/**
 * 更新 SKU 信息
 * @param {Object} param0 - 包含 SKU ID 和更新数据的对象
 */
export async function updateSku({ skuId, data }) {
  if (cloudbaseTemplateConfig.useMock) {
    // 如果使用 Mock 数据，直接更新 Mock 数据中的库存数量
    SKU.find((x) => x._id === skuId).count = data.count;
    return;
  }

  // 如果不使用 Mock 数据，调用云函数更新 SKU 信息
  return wx.cloud.callFunction({
    name: 'shop_update_sku', // 云函数名称
    data: {
      skuId, // SKU ID
      data, // 更新的数据
    },
  });
}

/**
 * 获取指定 SPU 的所有 SKU
 * @param {String} spuId - SPU 的 ID
 */
export async function getAllSku(spuId) {
  if (cloudbaseTemplateConfig.useMock) {
    // 如果使用 Mock 数据，过滤出对应 SPU 的 SKU
    return SKU.filter((x) => x.spu._id === spuId);
  }
  // 如果不使用 Mock 数据，调用数据模型接口获取 SKU 列表
  return getAll({
    name: SKU_MODEL_KEY,
    filter: {
      where: {
        spu: {
          $eq: spuId, // 匹配 SPU ID
        },
      },
    },
  });
}
