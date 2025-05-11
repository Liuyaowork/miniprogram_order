export const USER_ID = 'USER_MOCK'; // 模拟用户 ID

/**
 * 生成唯一 ID。
 * @returns {String} - 返回生成的唯一 ID
 */
export function createId() {
  return Array.from({ length: 16 })
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join('');
}

// 模拟商品 SPU 数据
export const SPU = [
  {
    owner: '1856254275343773698', // 所有者 ID
    priority: 1, // 优先级
    swiper_images: ['https://qcloudimg.tencent-cloud.cn/raw/063123361b3a397f4ba6894591c3a006.png'], // 轮播图片
    createdAt: 1731488370922, // 创建时间
    createBy: '1856254275343773698', // 创建者 ID
    updateBy: '1856254275343773698', // 更新者 ID
    _openid: '1856254275343773698', // 用户 OpenID
    name: '腾讯QQ正版铜工艺品太空鹅全铜摆件', // 商品名称
    detail:
      '<p style="text-align: center"><span style="font-size: 32px"><strong><span style="color: #45818e"><i><span style="text-decoration: underline">腾讯QQ正版铜工艺品太空鹅全铜摆件</span></i></span></strong></span></p><p style="text-align: center"><span class="exeditor-picture"><img src="https://qcloudimg.tencent-cloud.cn/raw/063123361b3a397f4ba6894591c3a006.png" width="356" height="356"></span></p><p style="text-align: center">企鹅企鹅企鹅</p><p style="text-align: center"><span style="font-family: STKaiti, 华文楷体, serif">帅！</span></p>', // 商品详情（HTML 格式）
    cover_image: 'https://qcloudimg.tencent-cloud.cn/raw/063123361b3a397f4ba6894591c3a006.png', // 封面图片
    _id: 'P4_prod', // 商品 ID
    updatedAt: 1731488370922, // 更新时间
    status: 'ENABLED', // 商品状态
  },
  {
    owner: '1856254275343773698', // 所有者 ID
    priority: 2, // 优先级
    swiper_images: ['https://qcloudimg.tencent-cloud.cn/raw/62eb1d8d8ea3b05302c199636f787438.png'], // 轮播图片
    createdAt: 1731488370775, // 创建时间
    createBy: '1856254275343773698', // 创建者 ID
    updateBy: '1856254275343773698', // 更新者 ID
    _openid: '1856254275343773698', // 用户 OpenID
    name: '软底一脚蹬小白鞋女鞋休闲棉加绒显脚瘦', // 商品名称
    detail:
      '<p style="text-align: center"><span style="font-size: 32px"><span style="background-color: #00ff00"><strong><span style="color: #ea9999"><i>软底一脚蹬小白鞋女鞋休闲棉加绒显脚瘦</i></span></strong></span></span></p><p style="text-align: center"><span class="exeditor-picture"><img src="https://qcloudimg.tencent-cloud.cn/raw/62eb1d8d8ea3b05302c199636f787438.png" width="356" height="356"></span></p><p style="text-align: center">好穿</p>', // 商品详情（HTML 格式）
    cover_image: 'https://qcloudimg.tencent-cloud.cn/raw/62eb1d8d8ea3b05302c199636f787438.png', // 封面图片
    _id: 'P3_prod', // 商品 ID
    updatedAt: 1731488370775, // 更新时间
    status: 'ENABLED', // 商品状态
  },
  {
    owner: '1856254275343773698', // 所有者 ID
    priority: 1, // 优先级
    swiper_images: ['https://qcloudimg.tencent-cloud.cn/raw/7b2c975b21d24c43f1609e0b0328dccf.png'], // 轮播图片
    createdAt: 1731488370653, // 创建时间
    createBy: '1856254275343773698', // 创建者 ID
    updateBy: '1856254275343773698', // 更新者 ID
    _openid: '1856254275343773698', // 用户 OpenID
    name: '随身蓝牙无线音箱小型便携式迷你户外', // 商品名称
    detail:
      '<p style="text-align: center"><span style="font-size: 32px"><strong><span style="color: #ff9900"><i>随身蓝牙无线音箱小型便携式迷你户外</i></span></strong></span></p><p style="text-align: center"><span class="exeditor-picture"><img src="https://qcloudimg.tencent-cloud.cn/raw/7b2c975b21d24c43f1609e0b0328dccf.png" width="356" height="356"></span></p><p style="text-align: center">非常劲爆的音乐。</p>', // 商品详情（HTML 格式）
    cover_image: 'https://qcloudimg.tencent-cloud.cn/raw/7b2c975b21d24c43f1609e0b0328dccf.png', // 封面图片
    _id: 'P2_prod', // 商品 ID
    updatedAt: 1731488370653, // 更新时间
    status: 'ENABLED', // 商品状态
  },
  {
    owner: '1856254275343773698', // 所有者 ID
    priority: 1, // 优先级
    swiper_images: ['https://qcloudimg.tencent-cloud.cn/raw/ac3c9a255cae575661323fdcb8cae468.png'], // 轮播图片
    createdAt: 1731488370507, // 创建时间
    createBy: '1856254275343773698', // 创建者 ID
    updateBy: '1856254275343773698', // 更新者 ID
    _openid: '1856254275343773698', // 用户 OpenID
    name: '正版腾讯生肖祥龙Q版包包龙抬头', // 商品名称
    detail:
      '<p style="text-align: right"><span style="font-size: 32px"><span style="background-color: #434343"><strong><span style="color: #ffffff"><i><span style="text-decoration: underline">龙龙龙</span></i></span></strong></span></span></p><p style="text-align: right"><span class="exeditor-picture"><img src="https://qcloudimg.tencent-cloud.cn/raw/ac3c9a255cae575661323fdcb8cae468.png" width="356" height="356"></span></p><p style="text-align: right">每天带龙去上班。</p>', // 商品详情（HTML 格式）
    cover_image: 'https://qcloudimg.tencent-cloud.cn/raw/ac3c9a255cae575661323fdcb8cae468.png', // 封面图片
    _id: 'P1_prod', // 商品 ID
    updatedAt: 1731488370507, // 更新时间
    status: 'ENABLED', // 商品状态
  },
];

// 模拟商品 SKU 数据
export const SKU = [
  {
    owner: '1856254275343773698', // 所有者 ID
    image: 'https://qcloudimg.tencent-cloud.cn/raw/063123361b3a397f4ba6894591c3a006.png', // SKU 图片
    createdAt: 1731488370290, // 创建时间
    createBy: '1856254275343773698', // 创建者 ID
    updateBy: '1856254275343773698', // 更新者 ID
    price: 190, // 价格
    _openid: '1856254275343773698', // 用户 OpenID
    count: 100, // 库存数量
    description: '2 个太空鹅', // SKU 描述
    spu: { _id: 'P4_prod' }, // 关联的 SPU ID
    _id: 'K6_prod', // SKU ID
    updatedAt: 1731488370290, // 更新时间
  },
  {
    owner: '1856254275343773698', // 所有者 ID
    image: 'https://qcloudimg.tencent-cloud.cn/raw/063123361b3a397f4ba6894591c3a006.png', // SKU 图片
    createdAt: 1731488370145, // 创建时间
    createBy: '1856254275343773698', // 创建者 ID
    updateBy: '1856254275343773698', // 更新者 ID
    price: 100, // 价格
    _openid: '1856254275343773698', // 用户 OpenID
    count: 100, // 库存数量
    description: '1 个太空鹅', // SKU 描述
    spu: { _id: 'P4_prod' }, // 关联的 SPU ID
    _id: 'K5_prod', // SKU ID
    updatedAt: 1731488370145, // 更新时间
  },
  {
    owner: '1856254275343773698', // 所有者 ID
    image: 'https://qcloudimg.tencent-cloud.cn/raw/62eb1d8d8ea3b05302c199636f787438.png', // SKU 图片
    createdAt: 1731488369981, // 创建时间
    createBy: '1856254275343773698', // 创建者 ID
    updateBy: '1856254275343773698', // 更新者 ID
    price: 300, // 价格
    _openid: '1856254275343773698', // 用户 OpenID
    count: 100, // 库存数量
    description: '34 码小白鞋', // SKU 描述
    spu: { _id: 'P3_prod' }, // 关联的 SPU ID
    _id: 'K4_prod', // SKU ID
    updatedAt: 1731488369981, // 更新时间
  },
  {
    owner: '1856254275343773698', // 所有者 ID
    image: 'https://qcloudimg.tencent-cloud.cn/raw/62eb1d8d8ea3b05302c199636f787438.png', // SKU 图片
    createdAt: 1731488369817, // 创建时间
    createBy: '1856254275343773698', // 创建者 ID
    updateBy: '1856254275343773698', // 更新者 ID
    price: 300, // 价格
    _openid: '1856254275343773698', // 用户 OpenID
    count: 95, // 库存数量
    description: '33 码小白鞋', // SKU 描述
    spu: { _id: 'P3_prod' }, // 关联的 SPU ID
    _id: 'K3_prod', // SKU ID
    updatedAt: 1731488629039, // 更新时间
  },
  {
    owner: '1856254275343773698', // 所有者 ID
    image: 'https://qcloudimg.tencent-cloud.cn/raw/7b2c975b21d24c43f1609e0b0328dccf.png', // SKU 图片
    createdAt: 1731488369644, // 创建时间
    createBy: '1856254275343773698', // 创建者 ID
    updateBy: '1856254275343773698', // 更新者 ID
    price: 100, // 价格
    _openid: '1856254275343773698', // 用户 OpenID
    count: 100, // 库存数量
    description: '普通音箱', // SKU 描述
    spu: { _id: 'P2_prod' }, // 关联的 SPU ID
    _id: 'K2_prod', // SKU ID
    updatedAt: 1731488369644, // 更新时间
  },
  {
    owner: '1856254275343773698', // 所有者 ID
    image: 'https://qcloudimg.tencent-cloud.cn/raw/ac3c9a255cae575661323fdcb8cae468.png', // SKU 图片
    createdAt: 1731488369320, // 创建时间
    createBy: '1856254275343773698', // 创建者 ID
    updateBy: '1856254275343773698', // 更新者 ID
    price: 90, // 价格
    _openid: '1856254275343773698', // 用户 OpenID
    count: 100, // 库存数量
    description: '普通斜挎包', // SKU 描述
    spu: { _id: 'P1_prod' }, // 关联的 SPU ID
    _id: 'K1_prod', // SKU ID
    updatedAt: 1731488369320, // 更新时间
  },
];

// 模拟首页轮播图数据
export const HOME_SWIPER = [
  {
    images: ['https://qcloudimg.tencent-cloud.cn/raw/1e793c70bb4f521fe277b2c207ab81b4.png'], // 轮播图图片
    _id: 'A3QFLT6UVN', // 轮播图 ID
  },
];

// 模拟分类数据
export const CATEGORY = [
  {
    owner: '1856254275343773698', // 所有者 ID
    createdAt: 1731488367747, // 创建时间
    createBy: '1856254275343773698', // 创建者 ID
    updateBy: '1856254275343773698', // 更新者 ID
    _openid: '1856254275343773698', // 用户 OpenID
    name: '数码', // 分类名称
    spu: [], // 关联的 SPU 列表
    _id: 'C3_prod', // 分类 ID
    child_cate: [
      {
        image: 'https://qcloudimg.tencent-cloud.cn/raw/7b2c975b21d24c43f1609e0b0328dccf.png', // 子分类图片
        name: '音箱', // 子分类名称
        _id: 'ACGNME9W2U', // 子分类 ID
      },
    ],
    updatedAt: 1731488367747, // 更新时间
  },
  {
    owner: '1856254275343773698', // 所有者 ID
    createdAt: 1731488367429, // 创建时间
    createBy: '1856254275343773698', // 创建者 ID
    updateBy: '1856254275343773698', // 更新者 ID
    _openid: '1856254275343773698', // 用户 OpenID
    name: '周边', // 分类名称
    spu: [], // 关联的 SPU 列表
    _id: 'C2_prod', // 分类 ID
    child_cate: [
      {
        image: 'https://qcloudimg.tencent-cloud.cn/raw/063123361b3a397f4ba6894591c3a006.png', // 子分类图片
        name: '摆件', // 子分类名称
        _id: 'ACGNMD7TRS', // 子分类 ID
      },
    ],
    updatedAt: 1731488367429, // 更新时间
  },
  {
    owner: '1856254275343773698', // 所有者 ID
    createdAt: 1731488366964, // 创建时间
    createBy: '1856254275343773698', // 创建者 ID
    updateBy: '1856254275343773698', // 更新者 ID
    _openid: '1856254275343773698', // 用户 OpenID
    name: '服饰', // 分类名称
    spu: [], // 关联的 SPU 列表
    _id: 'C1_prod', // 分类 ID
    child_cate: [
      {
        image: 'https://qcloudimg.tencent-cloud.cn/raw/ac3c9a255cae575661323fdcb8cae468.png', // 子分类图片
        name: '箱包', // 子分类名称
        _id: 'ACGNMBTP4L', // 子分类 ID
      },
      {
        image: 'https://qcloudimg.tencent-cloud.cn/raw/62eb1d8d8ea3b05302c199636f787438.png', // 子分类图片
        name: '鞋子', // 子分类名称
        _id: 'ACGNMCB9N8', // 子分类 ID
      },
    ],
    updatedAt: 1731488366964, // 更新时间
  },
  {
    owner: '1856254275343773698', // 所有者 ID
    image: 'https://qcloudimg.tencent-cloud.cn/raw/7b2c975b21d24c43f1609e0b0328dccf.png', // 子分类图片
    createdAt: 1731488367913, // 创建时间
    createBy: '1856254275343773698', // 创建者 ID
    updateBy: '1856254275343773698', // 更新者 ID
    _openid: '1856254275343773698', // 用户 OpenID
    name: '音箱', // 分类名称
    spu: [{ _id: 'P2_prod' }], // 关联的 SPU 列表
    _id: 'ACGNME9W2U', // 分类 ID
    child_cate: [], // 子分类列表
    updatedAt: 1731488367913, // 更新时间
  },
  {
    owner: '1856254275343773698', // 所有者 ID
    image: 'https://qcloudimg.tencent-cloud.cn/raw/063123361b3a397f4ba6894591c3a006.png', // 子分类图片
    createdAt: 1731488367571, // 创建时间
    createBy: '1856254275343773698', // 创建者 ID
    updateBy: '1856254275343773698', // 更新者 ID
    _openid: '1856254275343773698', // 用户 OpenID
    name: '摆件', // 分类名称
    spu: [{ _id: 'P4_prod' }], // 关联的 SPU 列表
    _id: 'ACGNMD7TRS', // 分类 ID
    child_cate: [], // 子分类列表
    updatedAt: 1731488367571, // 更新时间
  },
  {
    owner: '1856254275343773698', // 所有者 ID
    image: 'https://qcloudimg.tencent-cloud.cn/raw/62eb1d8d8ea3b05302c199636f787438.png', // 子分类图片
    createdAt: 1731488367273, // 创建时间
    createBy: '1856254275343773698', // 创建者 ID
    updateBy: '1856254275343773698', // 更新者 ID
    _openid: '1856254275343773698', // 用户 OpenID
    name: '鞋子', // 分类名称
    spu: [{ _id: 'P3_prod' }], // 关联的 SPU 列表
    _id: 'ACGNMCB9N8', // 分类 ID
    child_cate: [], // 子分类列表
    updatedAt: 1731488367273, // 更新时间
  },
  {
    owner: '1856254275343773698', // 所有者 ID
    image: 'https://qcloudimg.tencent-cloud.cn/raw/ac3c9a255cae575661323fdcb8cae468.png', // 子分类图片
    createdAt: 1731488367108, // 创建时间
    createBy: '1856254275343773698', // 创建者 ID
    updateBy: '1856254275343773698', // 更新者 ID
    _openid: '1856254275343773698', // 用户 OpenID
    name: '箱包', // 分类名称
    spu: [{ _id: 'P1_prod' }], // 关联的 SPU 列表
    _id: 'ACGNMBTP4L', // 分类 ID
    child_cate: [], // 子分类列表
    updatedAt: 1731488367108, // 更新时间
  },
];

// 模拟属性值数据
export const ATTR_VALUE = [
  {
    owner: '1856254275343773698', // 所有者 ID
    createdAt: 1731488369101, // 创建时间
    createBy: '1856254275343773698', // 创建者 ID
    updateBy: '1856254275343773698', // 更新者 ID
    attr_name: { name: '数量', _id: 'N2_prod' }, // 属性名称
    _openid: '1856254275343773698', // 用户 OpenID
    _id: 'V4_prod', // 属性值 ID
    sku: [{ _id: 'K6_prod' }], // 关联的 SKU 列表
    value: '2 个', // 属性值
    updatedAt: 1731488369101, // 更新时间
  },
  {
    owner: '1856254275343773698', // 所有者 ID
    createdAt: 1731488368972, // 创建时间
    createBy: '1856254275343773698', // 创建者 ID
    updateBy: '1856254275343773698', // 更新者 ID
    attr_name: { name: '数量', _id: 'N2_prod' }, // 属性名称
    _openid: '1856254275343773698', // 用户 OpenID
    _id: 'V3_prod', // 属性值 ID
    sku: [{ _id: 'K5_prod' }], // 关联的 SKU 列表
    value: '1 个', // 属性值
    updatedAt: 1731488368972, // 更新时间
  },
  {
    owner: '1856254275343773698', // 所有者 ID
    createdAt: 1731488368836, // 创建时间
    createBy: '1856254275343773698', // 创建者 ID
    updateBy: '1856254275343773698', // 更新者 ID
    attr_name: { name: '尺码', _id: 'N1_prod' }, // 属性名称
    _openid: '1856254275343773698', // 用户 OpenID
    _id: 'V2_prod', // 属性值 ID
    sku: [{ _id: 'K4_prod' }], // 关联的 SKU 列表
    value: '34 码', // 属性值
    updatedAt: 1731488368836, // 更新时间
  },
  {
    owner: '1856254275343773698', // 所有者 ID
    createdAt: 1731488368490, // 创建时间
    createBy: '1856254275343773698', // 创建者 ID
    updateBy: '1856254275343773698', // 更新者 ID
    attr_name: { name: '尺码', _id: 'N1_prod' }, // 属性名称
    _openid: '1856254275343773698', // 用户 OpenID
    _id: 'V1_prod', // 属性值 ID
    sku: [{ _id: 'K3_prod' }], // 关联的 SKU 列表
    value: '33 码', // 属性值
    updatedAt: 1731488368490, // 更新时间
  },
];

// 模拟评论数据
export const COMMENTS = [
  {
    owner: '1788891669799862274', // 所有者 ID
    createdAt: 1728899184779, // 创建时间
    createBy: '1788891669799862274', // 创建者 ID
    updateBy: '1788891669799862274', // 更新者 ID
    order_item: {
      _id: 'A6JRQ0YB2G', // 关联的订单项 ID
    },
    spu: {
      _id: 'A3QFLUSAK2', // 关联的 SPU ID
    },
    _openid: '1788891669799862274', // 用户 OpenID
    rating: 5, // 评分
    _id: 'A6JRGRT6U8', // 评论 ID
    reply: '', // 回复内容
    content: '好好好', // 评论内容
    updatedAt: 1728899339993, // 更新时间
  },
];
COMMENTS.pop(); // 默认没有数据，先添加后移除以便编辑器提示

// 模拟购物车项数据
export const CART_ITEM = [
  {
    count: 8, // 商品数量
    _id: 'A6JQYSJJSL', // 购物车项 ID
    sku: {
      _id: 'A3QFLRCZFW', // 关联的 SKU ID
    },
  },
];
CART_ITEM.pop(); // 默认没有数据

// 模拟配送信息数据
export const DELIVERY_INFO = [
  {
    name: '客人a', // 收件人姓名
    address: '深圳湾一号', // 收件地址
    _id: 'A6JRPE3NYG', // 配送信息 ID
    phone: '13858585858', // 联系电话
  },
];
DELIVERY_INFO.pop(); // 默认没有数据

// 模拟订单数据
export const ORDER = [
  {
    status: '', // 订单状态
    delivery_info: {
      _id: '', // 配送信息 ID
    },
    _id: '', // 订单 ID
  },
];
ORDER.pop(); // 默认没有数据

// 模拟订单项数据
export const ORDER_ITEM = [
  {
    count: 0, // 商品数量
    sku: {
      _id: '', // 关联的 SKU ID
    },
    order: {
      _id: '', // 关联的订单 ID
    },
    _id: '', // 订单项 ID
  },
];
ORDER_ITEM.pop(); // 默认没有数据
