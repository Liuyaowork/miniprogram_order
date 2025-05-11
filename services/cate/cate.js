/* eslint-disable eqeqeq */
import { model, getAll } from '../_utils/model';
import { getCloudImageTempUrl } from '../../utils/cloudImageHandler';
import { SPU_SELLING_STATUS } from '../../utils/spuStatus';
import { DATA_MODEL_KEY } from '../../config/model';
import { cloudbaseTemplateConfig } from '../../config/index';
import { CATEGORY, SPU } from '../cloudbaseMock/index';

const CATE_MODEL_KEY = DATA_MODEL_KEY.CATE;

/**
 * 获取指定分类下的所有商品 SPU。
 * @param {String} cateId - 分类 ID
 * @returns {Promise<Object>} - 返回包含 SPU 列表的对象
 */
export async function getAllSpuOfCate(cateId) {
  if (cloudbaseTemplateConfig.useMock) {
    // 使用 Mock 数据
    return { spu: CATEGORY.find((x) => x._id === cateId).spu.map(({ _id }) => SPU.find((x) => x._id === _id)) };
  }

  return (
    await model()[CATE_MODEL_KEY].get({
      filter: {
        where: {
          _id: {
            $eq: cateId, // 筛选指定分类 ID
          },
        },
        relateWhere: {
          spu: {
            where: {
              status: {
                $eq: SPU_SELLING_STATUS, // 筛选上架状态的商品
              },
            },
          },
        },
      },
      select: {
        spu: {
          $master: true, // 获取关联的 SPU 数据
        },
      },
    })
  ).data;
}

/**
 * 获取所有分类及其子分类。
 * @returns {Promise<Array>} - 返回分类列表
 */
export async function getCates() {
  if (cloudbaseTemplateConfig.useMock) {
    // 使用 Mock 数据，筛选有子分类的分类
    return CATEGORY.filter((x) => x.child_cate?.length > 0);
  }

  const cateSelect = {
    _id: true, // 分类 ID
    name: true, // 分类名称
    image: true, // 分类图片
  };

  // 获取所有分类及其子分类
  const allCates = (
    await getAll({
      name: CATE_MODEL_KEY,
      select: {
        ...cateSelect,
        child_cate: cateSelect, // 获取子分类信息
      },
    })
  ).filter((c) => c.child_cate.length !== 0); // 筛选有子分类的分类

  // 获取子分类的图片临时访问 URL
  const childCates = allCates.flatMap((c) => c.child_cate);
  const res = await getCloudImageTempUrl(childCates.map((x) => x.image));
  res.forEach((image, index) => (childCates[index].image = image)); // 替换子分类图片路径为临时 URL

  return allCates;
}
