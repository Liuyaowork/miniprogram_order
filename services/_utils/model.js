/**
 * 获取全局数据模型。
 * @returns {Object} - 返回全局数据模型对象
 */
export function model() {
  return globalThis.dataModel;
}

/**
 * 获取所有符合条件的数据，支持分页处理。
 * @param {Object} param0 - 参数对象
 * @param {Object} param0.filter - 筛选条件
 * @param {Object} param0.select - 选择字段
 * @param {String} param0.name - 数据模型名称
 * @returns {Promise<Array>} - 返回符合条件的所有数据记录
 */
export async function getAll({ filter, select, name }) {
  const addSelect = (prop) => (select ? { ...prop, select } : prop); // 如果有选择字段，则添加到请求参数中
  const pageSize = 200; // 每页最大条数

  // 获取第一页数据
  const first = await model()[name].list(
    addSelect({
      pageNumber: 1,
      pageSize,
      getCount: true, // 获取总记录数
      filter,
    }),
  );

  const {
    data: { total }, // 总记录数
  } = first;
  const totalPage = Math.ceil(total / 200); // 计算总页数

  // 获取剩余页的数据
  const lists = await Promise.all(
    Array.from({ length: totalPage - 1 }, (_, index) => index + 2).map((pageNumber) =>
      model()[name].list(
        addSelect({
          pageNumber, // 当前页码
          pageSize,
          filter,
        }),
      ),
    ),
  );

  // 合并所有页的数据
  const ret = lists.reduce((acc, current) => acc.concat(current.data.records), first.data.records);
  return ret;
}
