const ATTR_VALUE_STATUS = {
  PICKED: 'picked', // 已选中
  UNPICKED: 'unpicked', // 未选中
  DISABLED: 'disabled', // 不可选
};

Component({
  options: {
    multipleSlots: true, // 启用多 slot 支持
    addGlobalClass: true, // 允许使用全局样式
  },

  properties: {
    title: String, // 弹窗标题
    show: {
      type: Boolean,
      value: false, // 控制弹窗显示状态
    },
    initProps: {
      type: Object,
      observer(initProps) {
        // 初始化属性监听器
        if (!initProps) {
          return;
        }
        const { skus, spu } = initProps;

        const attrValues = collectAttrValueSet(skus); // 收集属性值集合
        const attrList = initAttrList(attrValues); // 初始化属性列表

        this.calculateValue(attrList, skus); // 计算属性值状态

        this.setData({
          skus, // SKU 列表
          attrList, // 属性列表
          spu, // 商品信息
        });
      },
    },
    outOperateStatus: {
      type: String,
      value: 'no', // 外部操作状态（如加入购物车或立即购买）
    },
  },

  data: {
    price: 0, // 当前价格
    imgSrc: '', // 当前图片地址
    max: 1, // 最大购买数量

    skus: [], // SKU 列表
    attrList: [], // 属性列表
    spu: null, // 商品信息
    pickedSku: null, // 已选中的 SKU
    value: 1, // 当前购买数量
  },

  observers: {
    'spu, pickedSku': function (spu, pickedSku) {
      // 监听 spu 和 pickedSku 的变化，更新图片地址
      const imgSrc = pickedSku?.image ? pickedSku.image : spu.cover_image;
      this.setData({
        imgSrc,
      });
    },
    'skus, pickedSku': function (skus, pickedSku) {
      // 监听 skus 和 pickedSku 的变化，更新价格和最大购买数量
      let max;
      let price;
      if (pickedSku != null) {
        max = pickedSku.count;
        price = pickedSku.price;
      } else {
        price = skus.reduce((acc, cur) => Math.min(acc, cur.price), Infinity);
        max = 1;
      }
      this.setData({ price, max });
    },
    max: function (max) {
      // 监听最大购买数量的变化，调整当前购买数量
      const { value } = this.data;
      if (value > max) {
        this.setData({
          value: max,
        });
      }
    },
    'attrList, skus': function (attrList, skus) {
      // 监听属性列表和 SKU 的变化，重新计算属性值状态
      this.calculateValue(attrList, skus);
      const sku = this.pickOnlySku(attrList); // 尝试选中唯一 SKU
      sku && this.triggerEvent('picked'); // 触发选中事件
      this.setData({ pickedSku: sku });
    },
  },

  methods: {
    clickAttrValue({
      target: {
        dataset: { attrValueIndex, attrNameIndex },
      },
    }) {
      // 点击属性值事件处理
      const setAttrListWithCalculation = (attrList) => {
        const { skus } = this.data;
        this.calculateValue(attrList, skus); // 重新计算属性值状态
        const sku = this.pickOnlySku(attrList); // 尝试选中唯一 SKU
        this.setData({ attrList, pickedSku: sku });
      };
      const { attrList } = this.data;

      const attrName = attrList[attrNameIndex];
      const attrValue = attrName.values[attrValueIndex];

      switch (attrValue.status) {
        case ATTR_VALUE_STATUS.UNPICKED:
          // 选中当前属性值，并取消其他属性值的选中状态
          attrName.values.forEach((value) => {
            value.status = value === attrValue ? ATTR_VALUE_STATUS.PICKED : ATTR_VALUE_STATUS.UNPICKED;
          });
          setAttrListWithCalculation(attrList);
          break;
        case ATTR_VALUE_STATUS.DISABLED:
          // 不可选状态，忽略
          break;
        case ATTR_VALUE_STATUS.PICKED:
          // 取消选中当前属性值
          attrValue.status = ATTR_VALUE_STATUS.UNPICKED;
          setAttrListWithCalculation(attrList);
          break;
        default:
          // 无效状态，跳过
          return;
      }
    },

    /**
     *
     * @param {[]} attrList
     * @param {[]} skus
     */
    calculateValue(attrList, skus) {
      // 计算属性值的状态
      attrList.forEach((attrName, index) => {
        const restPickedValues = attrList
          .filter((_, i) => i !== index) // 排除当前行
          .map((x) => x.values.find((y) => y.status === ATTR_VALUE_STATUS.PICKED))
          .filter((x) => x != null);

        const filteredSkus = skus.filter(
          (sku) =>
            sku.count > 0 &&
            contains({
              container: sku.attrValues,
              arr: restPickedValues,
              eq: (a, b) => a._id === b._id,
            }),
        );
        const filteredAttrValues = collectAttrValueSet(filteredSkus);

        attrName.values.forEach((value) => {
          if (filteredAttrValues.find((x) => x._id === value._id) == null) {
            value.status = ATTR_VALUE_STATUS.DISABLED; // 设置为不可选
          } else {
            if (value.status === ATTR_VALUE_STATUS.DISABLED) {
              value.status = ATTR_VALUE_STATUS.UNPICKED; // 恢复为未选中状态
            }
          }
        });
      });
    },

    pickOnlySku(attrList) {
      // 尝试选中唯一 SKU
      const pickedAttrValues = attrList
        .map((x) => x.values.find((x) => x.status === ATTR_VALUE_STATUS.PICKED))
        .filter((x) => x != null);
      if (pickedAttrValues.length !== attrList.length) {
        return null; // 需要选中更多属性值
      }

      const { skus } = this.data;
      const pickedSku = skus.find(
        (sku) =>
          sku.attrValues.length === pickedAttrValues.length &&
          sku.attrValues.every((x) => pickedAttrValues.find((y) => y._id === x._id) != null),
      );
      if (pickedSku == null) {
        console.error('属性值已选中，但未找到匹配的 SKU:', pickedAttrValues);
        return null;
      }
      return pickedSku;
    },

    specsConfirm() {
      // 确认规格选择
      if (this.data.outOperateStatus === 'cart') {
        this.addCart(); // 加入购物车
      } else if (this.data.outOperateStatus === 'buy') {
        this.buyNow(); // 立即购买
      }
    },

    handlePopupHide() {
      // 隐藏弹窗
      this.triggerEvent('closeSpecsPopup', {
        show: false,
      });
    },

    addCart() {
      // 加入购物车
      const { pickedSku, max, value } = this.properties;
      if (pickedSku == null || value > max || value < 1) {
        return;
      }
      this.triggerEvent('addCart', { pickedSku, count: value });
    },

    buyNow() {
      // 立即购买
      const { pickedSku, max, value } = this.properties;
      if (pickedSku == null || value > max || value < 1) {
        return;
      }
      this.triggerEvent('buyNow', { pickedSku, count: value });
    },

    handleBuyNumChange({ detail: { value } }) {
      // 处理购买数量变化
      this.setData({ value });
    },
  },
  lifetimes: {},
});

/**
 * 初始化属性列表
 * @param {Array} attrValues
 * @returns {Array}
 */
function initAttrList(attrValues) {
  const list = attrValues.reduce((acc, cur) => {
    const item = acc.find((x) => x._id === cur.attr_name._id);
    if (item != null) {
      if (item.values.find((x) => x._id === cur._id) == null) {
        item.values.push({
          value: cur.value,
          _id: cur._id,
          status: ATTR_VALUE_STATUS.UNPICKED,
        });
      }
    } else {
      acc.push({
        ...cur.attr_name,
        values: [
          {
            value: cur.value,
            _id: cur._id,
            status: ATTR_VALUE_STATUS.UNPICKED,
          },
        ],
      });
    }
    return acc;
  }, []);
  return list;
}

/**
 * 检查数组是否包含所有指定元素
 * @param {{container: Array, arr: Array, eq: (a, b) => boolean}} param0
 * @returns {boolean}
 */
function contains({ container, arr, eq }) {
  return arr.every((itemInArr) => container.findIndex((x) => eq(x, itemInArr)) !== -1);
}

/**
 * 收集 SKU 的属性值集合
 * @param {Array} skus
 * @returns {Array}
 */
function collectAttrValueSet(skus) {
  const attrValues = skus.reduce((acc, sku) => {
    sku.attrValues.forEach((value) => {
      if (acc.find((x) => x._id === value._id) == null) {
        acc.push(Object.assign({}, value));
      }
    });
    return acc;
  }, []);
  return attrValues;
}
