import { model, getAll } from '../../services/_utils/model';
import { getSkuDetail } from '../sku/sku';
import { DATA_MODEL_KEY } from '../../config/model';
import { cloudbaseTemplateConfig } from '../../config/index';
import { ORDER_ITEM, createId } from '../cloudbaseMock/index';

const ORDER_ITEM_MODEL_KEY = DATA_MODEL_KEY.ORDER_ITEM; // 订单项数据模型键

export async function getOrderItem(id) {
  // 根据订单项 ID 获取订单项详情
  return (
    await model()[ORDER_ITEM_MODEL_KEY].get({
      filter: {
        where: {
          _id: {
            $eq: id, // 匹配订单项 ID
          },
        },
      },
      select: {
        sku: {
          _id: true, // 选择 SKU ID
        },
        comment: {
          _id: true, // 选择评论 ID
        },
      },
    })
  ).data;
}

export async function createOrderItem({ count, skuId, orderId }) {
  // 创建订单项
  if (cloudbaseTemplateConfig.useMock) {
    // 如果使用 Mock 数据，直接添加到 Mock 数据中
    ORDER_ITEM.push({
      _id: createId(), // 生成唯一 ID
      count, // 商品数量
      order: {
        _id: orderId, // 关联订单 ID
      },
      sku: {
        _id: skuId, // 关联 SKU ID
      },
    });
    return;
  }
  // 如果不使用 Mock 数据，调用数据模型创建接口
  return model()[ORDER_ITEM_MODEL_KEY].create({
    data: {
      count,
      sku: {
        _id: skuId,
      },
      order: {
        _id: orderId,
      },
    },
  });
}

export function getAllOrderItems() {
  // 获取所有订单项
  return getAll({ name: ORDER_ITEM_MODEL_KEY });
}

/**
 * 获取指定订单的所有订单项
 * @param {{orderId: String}} param0 - 包含订单 ID 的对象
 */
export async function getAllOrderItemsOfAnOrder({ orderId }) {
  if (cloudbaseTemplateConfig.useMock) {
    // 如果使用 Mock 数据，过滤出对应订单的订单项
    const orderItems = ORDER_ITEM.filter((orderItem) => orderItem.order._id === orderId);
    await Promise.all(
      orderItems.map(async (orderItem) => {
        const skuId = orderItem.sku._id;
        const sku = await getSkuDetail(skuId); // 获取 SKU 详情
        orderItem.sku = sku; // 更新订单项中的 SKU 信息
      }),
    );
    return orderItems;
  }

  // 如果不使用 Mock 数据，调用数据模型接口获取订单项
  const orderItems = await getAll({
    name: ORDER_ITEM_MODEL_KEY,
    filter: {
      where: {
        order: {
          $eq: orderId, // 匹配订单 ID
        },
      },
    },
    select: {
      _id: true, // 选择订单项 ID
      count: true, // 选择商品数量
      sku: {
        _id: true, // 选择 SKU ID
      },
    },
  });
  await Promise.all(
    orderItems.map(async (orderItem) => {
      const skuId = orderItem.sku._id;
      const sku = await getSkuDetail(skuId); // 获取 SKU 详情
      orderItem.sku = sku; // 更新订单项中的 SKU 信息
    }),
  );
  return orderItems;
}
