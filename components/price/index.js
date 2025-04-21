Component({
  externalClasses: ['wr-class', 'symbol-class', 'decimal-class'], // 外部样式类
  useStore: [], // 组件使用的全局状态

  properties: {
    priceUnit: {
      type: String,
      value: 'fen', // 价格单位，默认值为分（fen），可选值为元（yuan）
    },
    price: {
      type: null,
      value: '',
      observer(price) {
        // 当 price 属性变化时，调用 format 方法格式化价格
        this.format(price);
      },
    },
    type: {
      type: String,
      value: ' main', // 价格显示样式，默认值为 main（粗体）
    },
    symbol: {
      type: String,
      value: '¥', // 货币符号，默认值为人民币符号 ¥
    },
    fill: Boolean, // 是否自动补齐两位小数
    decimalSmaller: Boolean, // 小数字号是否小一点
    lineThroughWidth: {
      type: null,
      value: '0.12em', // 划线价线条的高度
    },
  },

  data: {
    pArr: [], // 存储格式化后的价格数组
  },

  methods: {
    // 格式化价格
    format(price) {
      price = parseFloat(`${price}`); // 将价格转换为浮点数
      const pArr = [];
      if (!isNaN(price)) {
        const isMinus = price < 0; // 判断价格是否为负数
        if (isMinus) {
          price = -price; // 如果是负数，取绝对值
        }
        if (this.properties.priceUnit === 'yuan') {
          // 如果价格单位为元
          const priceSplit = price.toString().split('.');
          pArr[0] = priceSplit[0]; // 整数部分
          pArr[1] = !priceSplit[1]
            ? '00' // 如果没有小数部分，补齐两位小数
            : priceSplit[1].length === 1
            ? `${priceSplit[1]}0` // 如果只有一位小数，补齐一位
            : priceSplit[1];
        } else {
          // 如果价格单位为分
          price = Math.round(price * 10 ** 8) / 10 ** 8; // 恢复精度丢失
          price = Math.ceil(price); // 向上取整
          pArr[0] = price >= 100 ? `${price}`.slice(0, -2) : '0'; // 整数部分
          pArr[1] = `${price + 100}`.slice(-2); // 小数部分
        }
        if (!this.properties.fill) {
          // 如果 fill 为 false，不显示小数末尾的 0
          if (pArr[1] === '00') pArr[1] = '';
          else if (pArr[1][1] === '0') pArr[1] = pArr[1][0];
        }
        if (isMinus) {
          pArr[0] = `-${pArr[0]}`; // 如果是负数，加上负号
        }
      }
      this.setData({ pArr }); // 更新格式化后的价格数组
    },
  },
});
