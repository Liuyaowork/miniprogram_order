import { getAll } from '../_utils/model';
import { DATA_MODEL_KEY } from '../../config/model';
import { cloudbaseTemplateConfig } from "../../config/index"
import { ATTR_VALUE } from "../cloudbaseMock/index"

const ATTR_VALUE_MODEL_KEY = DATA_MODEL_KEY.ATTR_VALUE;

/**
 * 获取指定 SKU 的所有属性值。
 * @param {String} skuId - SKU 的唯一标识符
 * @returns {Promise<Array>} - 返回属性值列表
 */
export async function getAllAttrValues(skuId) {
  if (cloudbaseTemplateConfig.useMock) {
    // 使用 Mock 数据
    return ATTR_VALUE.filter(x => x.sku.find(x => x._id === skuId));
  }
  // 从数据模型中获取属性值
  const res = await getAll({
    name: ATTR_VALUE_MODEL_KEY,
    filter: {
      relateWhere: {
        sku: {
          where: {
            _id: {
              $eq: skuId, // 筛选与指定 SKU 关联的属性值
            },
          },
        },
      },
    },
    select: {
      _id: true, // 属性值 ID
      value: true, // 属性值
      attr_name: {
        _id: true, // 属性名称 ID
        name: true, // 属性名称
      },
      sku: {
        _id: true, // SKU ID
      },
    },
  });
  return res;
}
