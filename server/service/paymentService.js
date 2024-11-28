import sortObject from "../utils/sortObject.js";
import * as crypto from "crypto";
import queryString from "qs";
import moment from "moment";

const vnp_HashSecret = process.env.vnp_HashSecret;
const vnp_TmnCode = process.env.vnp_TmnCode;
const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

// route được gọi lại khi thanh toán thành công
const return_url = "http://localhost:3000/payment/return";

const generateSignature = (queryString) => {
  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  hmac.update(new Buffer(queryString, "utf-8"));
  return hmac.digest("hex");
};

const paymentService = {
  createPayment: (data) => {
    try {
      const { orderInfo, amount } = data;
      const date = new Date();
      const createDate = moment(date).format("YYYYMMDDHHmmss");

      const vnpParams = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: vnp_TmnCode,
        vnp_Amount: amount * 100,
        vnp_CreateDate: createDate,
        vnp_CurrCode: "VND",
        vnp_IpAddr: "127.0.0.1",
        vnp_Locale: "vn",
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: "billpayment",
        vnp_ReturnUrl: return_url,
        vnp_TxnRef: moment(date).format("DDHHmmss"),
      };

      const sortedKeys = sortObject(vnpParams);
      let signData = queryString.stringify(sortedKeys, { encode: false });
      const signature = generateSignature(signData);

      const paymentUrl = `${vnp_Url}?${queryString.stringify(sortedKeys, {
        encode: false,
      })}&vnp_SecureHash=${signature}`;
      return paymentUrl;
    } catch (error) {
      console.log("🚀 ~ error:", error.message);
    }
  },
};

export default paymentService;
