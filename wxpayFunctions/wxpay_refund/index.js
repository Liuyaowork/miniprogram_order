/**
 * 微信支付 - 申请退款
 */
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

// 云函数入口函数
exports.main = async (event, context) => {
    const res = await cloud.callFunction({
        name: 'cloudbase_module',
        data: {
            name: 'wxpay_refund',
            data: {
                out_refund_no: '<商户系统内部的退款单号，商户系统内部唯一>',
                transaction_id: '<原支付交易对应的微信订单号>',
                amount: {
                    refund: '<退款金额>',
                    total: '<原订单金额>',
                    currency: 'CNY',
                },
            },
        },
    });
    return res.result;
};