const makeOrder = require('./wxpay_order/index');
const queryOrderByOutTradeNo = require('./wxpay_query_order_by_out_trade_no/index');
const queryOrderByTransactionId = require('./wxpay_query_order_by_transaction_id/index');
const refund = require('./wxpay_refund/index');
const refundQuery = require('./wxpay_refund_query/index');

// 云函数入口函数
exports.main = async (event, context) => {
    // 假设问题出现在某个数组调用 sort 的地方
    const someArray = data.someArray || []; // 确保 someArray 是一个数组
    someArray.sort((a, b) => a - b); // 对数组进行排序

    switch (event.type) {
        case 'wxpay_order':
            return await makeOrder.main(event, context);
        case 'wxpay_query_order_by_out_trade_no':
            return await queryOrderByOutTradeNo.main(event, context);
        case 'wxpay_query_order_by_transaction_id':
            return await queryOrderByTransactionId.main(event, context);
        case 'wxpay_refund':
            return await refund.main(event, context);
        case 'wxpay_refund_query':
            return await refundQuery.main(event, context);
        default:
            return {
                code: -1,
                msg: 'Unimplemented method'
            };
    }
};

