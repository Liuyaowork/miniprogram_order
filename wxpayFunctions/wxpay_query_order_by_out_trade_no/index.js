/**
 * 微信支付 - 根据商户订单号查询订单
 */
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

// 云函数入口函数
exports.main = async (event, context) => {
    const res = await cloud.callFunction({
        name: 'cloudbase_module',
        data: {
            name: 'wxpay_query_order_by_out_trade_no',
            data: {
                out_trade_no: '<商户订单号>',
            },
        },
    });
    return res.result;
};