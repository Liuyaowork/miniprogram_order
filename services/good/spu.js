import { model } from '../_utils/model';
import { getCloudImageTempUrl } from '../../utils/cloudImageHandler';
import { SPU_SELLING_STATUS } from '../../utils/spuStatus';
import { DATA_MODEL_KEY } from '../../config/model';
import { cloudbaseTemplateConfig } from '../../config/index';
import { SPU, SKU } from '../cloudbaseMock/index';

const SPU_MODEL_KEY = DATA_MODEL_KEY.SPU;
const SKU_MODEL_KEY = DATA_MODEL_KEY.SKU;

/**
 * 获取商品列表。
 * @param {{
 *   pageSize: Number, // 每页条数
 *   pageNumber: Number, // 页码
 *   cateId: String, // 分类 ID（未使用）
 *   search: String // 搜索关键字
 * }} param0
 * @returns {Promise<{records: Array, total: Number}>} - 返回商品列表和总数
 */
export async function listGood({ pageSize, pageNumber, search }) {
  if (cloudbaseTemplateConfig.useMock) {
    // 使用 Mock 数据
    const records = search ? SPU.filter((x) => x.name.includes(search)) : SPU;
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return {
      records: records.slice(startIndex, endIndex),
      total: records.length,
    };
  }
  const filter = {
    where: {
      status: { $eq: SPU_SELLING_STATUS }, // 筛选上架状态的商品
    },
  };
  if (search) {
    filter.where.name = { $search: search }; // 添加搜索条件
  }

  return (
    await model()[SPU_MODEL_KEY].list({
      filter,
      pageSize,
      pageNumber,
      getCount: true,
      orderBy: [{ priority: 'desc' }], // 按优先级降序排序
    })
  ).data;
}

/**
 * 获取商品的价格。
 * @param {String} spuId - 商品 SPU ID
 * @returns {Promise<Number>} - 返回商品价格
 */
export async function getPrice(spuId) {
  if (cloudbaseTemplateConfig.useMock) {
    // 使用 Mock 数据
    return SKU.find((x) => x.spu._id === spuId).price;
  }
  const {
    data: { records },
  } = await model()[SKU_MODEL_KEY].list({
    filter: {
      where: {
        spu: {
          $eq: spuId, // 筛选指定 SPU 的 SKU
        },
      },
    },
    select: {
      $master: true,
      spu: {
        _id: true,
      },
    },
  });
  return records[0].price; // 返回第一个 SKU 的价格
}

/**
 * 处理 SPU 的云存储图片，将云存储路径替换为临时访问 URL。
 * @param {Object} spu - 商品 SPU 对象
 */
export async function handleSpuCloudImage(spu) {
  if (spu == null) {
    return;
  }
  // 获取云存储图片的临时访问 URL
  const handledImages = await getCloudImageTempUrl([spu.cover_image, ...spu.swiper_images]);
  handledImages.forEach((image, index) => {
    if (index === 0) {
      spu.cover_image = image; // 替换封面图片
      return;
    }
    spu.swiper_images[index - 1] = image; // 替换轮播图片
  });
}

/**
 * 获取单个商品的详细信息。
 * @param {String} spuId - 商品 SPU ID
 * @returns {Promise<Object>} - 返回商品详情
 */
export async function getSpu(spuId) {
  if (cloudbaseTemplateConfig.useMock) {
    // 使用 Mock 数据
    return SPU.find((x) => x._id === spuId);
  }
  return (
    await model()[SPU_MODEL_KEY].get({
      filter: {
        where: { _id: { $eq: spuId } }, // 筛选指定 ID 的商品
      },
    })
  ).data;
}
