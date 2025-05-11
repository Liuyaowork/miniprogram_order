import { model } from '../_utils/model';
import { DATA_MODEL_KEY } from '../../config/model';
import { cloudbaseTemplateConfig } from '../../config/index';
import { COMMENTS } from '../cloudbaseMock/index';

const COMMENT_MODEL_KEY = DATA_MODEL_KEY.COMMENT;

export async function getGoodsDetailCommentInfo(spuId) {
  if (cloudbaseTemplateConfig.useMock) {
    // 使用 Mock 数据时，过滤出与 spuId 匹配的评论
    const all = COMMENTS.filter((x) => x.spu._id === spuId);
    const good = all.filter((x) => x.rating > 3); // 筛选好评（评分大于 3）
    const firstAndTotal = (x) => ({
      data: {
        records: x.length === 0 ? [] : [x[0]], // 返回第一条记录
        total: x.length, // 总评论数
      },
    });
    return Promise.resolve([firstAndTotal(all), firstAndTotal(good)]);
  }

  // 获取所有评论的第一条记录和总数
  const firstAndCount = () =>
    model()[COMMENT_MODEL_KEY].list({
      filter: {
        relateWhere: {
          spu: {
            where: {
              _id: {
                $eq: spuId,
              },
            },
          },
        },
      },
      select: {
        $master: true,
        spu: {
          _id: true,
        },
      },
      orderBy: [{ rating: 'desc' }], // 按评分降序排序
      pageNumber: 1,
      pageSize: 1,
      getCount: true,
    });

  // 获取好评的第一条记录和总数
  const goodCount = () =>
    model()[COMMENT_MODEL_KEY].list({
      filter: {
        relateWhere: {
          spu: {
            where: {
              _id: {
                $eq: spuId,
              },
            },
          },
        },
        where: {
          rating: {
            $gt: 3, // 筛选评分大于 3 的评论
          },
        },
      },
      select: {
        $master: true,
      },
      pageNumber: 1,
      pageSize: 1,
      getCount: true,
    });

  // 并行获取所有评论和好评的数据
  return await Promise.all([firstAndCount(), goodCount()]);
}

export async function getCommentsOfSpu({ spuId, pageNumber, pageSize }) {
  if (cloudbaseTemplateConfig.useMock) {
    // 使用 Mock 数据时，分页返回评论
    const all = COMMENTS.filter((x) => x.spu._id === spuId);
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const records = all.slice(startIndex, endIndex);
    return {
      records, // 当前页的评论记录
      total: all.length, // 总评论数
    };
  }
  // 从数据库获取评论列表
  return (
    await model()[COMMENT_MODEL_KEY].list({
      select: {
        $master: true,
        order_item: {
          _id: true,
        },
        spu: {
          _id: true,
        },
      },
      filter: {
        relateWhere: {
          spu: {
            where: {
              _id: {
                $eq: spuId,
              },
            },
          },
        },
      },
      pageSize, // 每页评论数
      pageNumber, // 当前页码
      getCount: true, // 获取总评论数
    })
  ).data;
}

/**
 * 创建评论
 * @param {{
 *   orderItemId: string, // 订单项 ID
 *   content: string, // 评论内容
 *   rating: number, // 评论评分
 *   spuId: string // 商品 ID
 * }} param0
 */
export function createComment({ orderItemId, content, rating, spuId }) {
  return model()[COMMENT_MODEL_KEY].create({
    data: {
      content, // 评论内容
      rating, // 评论评分
      order_item: {
        _id: orderItemId, // 关联的订单项 ID
      },
      spu: {
        _id: spuId, // 关联的商品 ID
      },
    },
  });
}
