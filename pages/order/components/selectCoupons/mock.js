export const couponsData = {
  // 优惠券结果列表
  couponResultList: [
    {
      couponVO: {
        condition: '满200元可用', // 使用条件
        couponId: 11, // 优惠券 ID
        endTime: 1584530282686, // 结束时间（时间戳）
        name: '折扣券', // 优惠券名称
        profit: '5.5折', // 优惠内容
        promotionCode: 90, // 促销代码
        promotionSubCode: 1, // 促销子代码
        scopeText: '部分商品可用', // 使用范围说明
        startTime: 1584530282686, // 开始时间（时间戳）
        storeId: 90, // 店铺 ID
        value: 550, // 优惠券面值
        type: 2, // 优惠券类型
      },
      status: 0, // 状态：0:未勾选，1:勾选，-1:置灰
    },
  ],
  reduce: 1000, // 总优惠金额
};
