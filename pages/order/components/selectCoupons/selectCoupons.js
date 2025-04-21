import dayjs from 'dayjs';
import { couponsData } from './mock';

// 空优惠券图片地址
const emptyCouponImg = `https://cdn-we-retail.ym.tencent.com/miniapp/coupon/ordersure-coupon-newempty.png`;

Component({
  properties: {
    // 店铺 ID
    storeId: String,
    // 促销商品列表
    promotionGoodsList: {
      type: Array,
      value: [],
    },
    // 确认订单的优惠券列表
    orderSureCouponList: {
      type: Array,
      value: [],
    },
    // 控制优惠券弹窗显示/隐藏
    couponsShow: {
      type: Boolean,
      value: false,
      observer(couponsShow) {
        if (couponsShow) {
          // 当弹窗显示时，初始化数据
          const { promotionGoodsList, orderSureCouponList, storeId } =
            this.data;
          const products =
            promotionGoodsList &&
            promotionGoodsList.map((goods) => {
              this.storeId = goods.storeId; // 记录店铺 ID
              return {
                skuId: goods.skuId, // SKU ID
                spuId: goods.spuId, // SPU ID
                storeId: goods.storeId, // 店铺 ID
                selected: true, // 是否选中
                quantity: goods.num, // 商品数量
                prices: {
                  sale: goods.settlePrice, // 商品结算价格
                },
              };
            });
          const selectedCoupons =
            orderSureCouponList &&
            orderSureCouponList.map((ele) => {
              return {
                promotionId: ele.promotionId, // 促销 ID
                storeId: ele.storeId, // 店铺 ID
                couponId: ele.couponId, // 优惠券 ID
              };
            });
          this.setData({
            products, // 设置商品数据
          });
          this.coupons({
            products,
            selectedCoupons,
            storeId,
          }).then((res) => {
            this.initData(res); // 初始化优惠券数据
          });
        }
      },
    },
  },
  data: {
    emptyCouponImg, // 空优惠券图片
    goodsList: [], // 商品列表
    selectedList: [], // 已选中的优惠券列表
    couponsList: [], // 优惠券列表
    orderSureCouponList: [], // 确认订单的优惠券列表
    promotionGoodsList: [], // 促销商品列表
  },
  methods: {
    // 初始化优惠券数据
    initData(data = {}) {
      const { couponResultList = [], reduce = 0 } = data;
      const selectedList = [];
      let selectedNum = 0;
      const couponsList =
        couponResultList &&
        couponResultList.map((coupon) => {
          const { status, couponVO } = coupon;
          const {
            couponId,
            condition = '', // 使用条件
            endTime = 0, // 结束时间
            name = '', // 优惠券名称
            startTime = 0, // 开始时间
            value, // 优惠券面值
            type, // 优惠券类型
          } = couponVO;
          if (status === 1) {
            // 如果优惠券已选中
            selectedNum++;
            selectedList.push({
              couponId,
              promotionId: ruleId, // 促销规则 ID
              storeId: this.storeId,
            });
          }
          const val = type === 2 ? value / 100 : value / 10; // 根据类型计算优惠值
          return {
            key: couponId, // 唯一标识
            title: name, // 优惠券标题
            isSelected: false, // 是否选中
            timeLimit: `${dayjs(+startTime).format('YYYY-MM-DD')}-${dayjs(
              +endTime,
            ).format('YYYY-MM-DD')}`, // 时间限制
            value: val, // 优惠值
            status: status === -1 ? 'useless' : 'default', // 状态
            desc: condition, // 描述
            type, // 类型
            tag: '', // 标签
          };
        });
      this.setData({
        selectedList, // 更新已选中列表
        couponsList, // 更新优惠券列表
        reduce, // 更新优惠金额
        selectedNum, // 更新已选中数量
      });
    },
    // 选择优惠券
    selectCoupon(e) {
      const { key } = e.currentTarget.dataset; // 获取点击的优惠券 key
      const { couponsList, selectedList } = this.data;
      couponsList.forEach((coupon) => {
        if (coupon.key === key) {
          coupon.isSelected = !coupon.isSelected; // 切换选中状态
        }
      });

      const couponSelected = couponsList.filter(
        (coupon) => coupon.isSelected === true,
      );

      this.setData({
        selectedList: [...selectedList, ...couponSelected], // 更新已选中列表
        couponsList: [...couponsList], // 更新优惠券列表
      });

      this.triggerEvent('sure', {
        selectedList: [...selectedList, ...couponSelected], // 触发事件，传递已选中列表
      });
    },
    // 隐藏优惠券弹窗
    hide() {
      this.setData({
        couponsShow: false,
      });
    },
    // 模拟获取优惠券数据
    coupons(coupon = {}) {
      return new Promise((resolve, reject) => {
        if (coupon?.selectedCoupons) {
          resolve({
            couponResultList: couponsData.couponResultList, // 返回优惠券结果列表
            reduce: couponsData.reduce, // 返回优惠金额
          });
        }
        return reject({
          couponResultList: [], // 返回空列表
          reduce: undefined, // 无优惠金额
        });
      });
    },
  },
});
