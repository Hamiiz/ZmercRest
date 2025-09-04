// services/createOrderService.ts
import 'dotenv/config'
import axios, { AxiosRequestConfig } from "axios";
import applyFabricToken from "./applyFabricToken";
import { Request, Response } from "express";
import {signRequestObject, signString, createNonceStr, createTimeStamp} from "./tools";
import https from "https";

interface BizContent {
  notify_url: string;
  appid: string;
  merch_code: string;
  merch_order_id: string;
  trade_type: string;
  title: string;
  total_amount: number | string;
  trans_currency: string;
  timeout_express: string;
  business_type: string;
  payee_identifier: string;
  payee_identifier_type: string;
  payee_type: string;
  callback_info: string;
  redirect_url: string;
}

interface CreateOrderRequest {
  timestamp: string;
  nonce_str: string;
  method: string;
  version: string;
  biz_content: BizContent;
  sign: string;
  sign_type: string;
}

let webBaseUrl = process.env.WEB_BASE_URL
let appid:string =String( process.env.TELEBIRR_MERCHANT_ID)
let merchantCode = process.env.SHORT_CODE


export const createOrder = async (req: Request, res: Response) => {

  try {

    const {  amount } = req.body;
    const applyFabricTokenResult = await applyFabricToken();
    const fabricToken = applyFabricTokenResult.token;
    const createOrderResult = await requestCreateOrder(fabricToken, 'payment for products', amount);

    const prepayId = createOrderResult.biz_content.prepay_id;
    const rawRequest = createRawRequest(prepayId);

    const checkoutUrl = `${webBaseUrl}${rawRequest}&version=1.0&trade_type=Checkout`;

    res.json({ checkoutUrl });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).send({ error: "Failed to create order" });
  }
};

export const requestCreateOrder = async (
  fabricToken: string,
  title: string,
  amount: number | string
) => {
  const reqObject = createRequestObject(title, amount);

  const axiosConfig: AxiosRequestConfig = {
    method: "POST",
    url: `${process.env.TB_BASE_URL}/payment/v1/merchant/preOrder`,
    headers: {
      "Content-Type": "application/json",
      "X-APP-Key": process.env.FABRIC_APP_ID,
      Authorization: fabricToken,
    },
    data: reqObject,
    httpsAgent: new https.Agent({ rejectUnauthorized: false }), // <--- ignore SSL errors


  };

  const response = await axios(axiosConfig);
  return response.data;
};

export const createRequestObject = (title: string, amount: number | string): CreateOrderRequest => {
  const bizContent: BizContent = {
    notify_url: `${process.env.API_BASE_URL}/payment/callback`,
    appid: appid,
    merch_code: String(merchantCode),
    merch_order_id: createMerchantOrderId(),
    trade_type: "Checkout",
    title,
    total_amount: amount,
    trans_currency: "ETB",
    timeout_express: "10m",
    business_type: "BuyGoods",
    payee_identifier: String(merchantCode),
    payee_identifier_type: "04",
    payee_type: "5000",
    redirect_url: `${process.env.FRONTEND_URL}/`,
    callback_info: "From web",
  };

  const req: CreateOrderRequest = {
    timestamp: createTimeStamp(),
    nonce_str: createNonceStr(),
    method: "payment.preorder",
    version: "1.0",
    biz_content: bizContent,
    sign: "",
    sign_type: "SHA256WithRSA",
  };

  req.sign = signRequestObject(req);
  return req;
};

export const createMerchantOrderId = (): string => {
  return Date.now().toString();
};

export const createRawRequest = (prepayId: string): string => {
  const map = {
    appid: appid,
    merch_code: merchantCode,
    nonce_str: createNonceStr(),
    prepay_id: prepayId,
    timestamp: createTimeStamp(),
  };

  const sign = signRequestObject(map);

  const rawRequest = [
    `appid=${map.appid}`,
    `merch_code=${map.merch_code}`,
    `nonce_str=${map.nonce_str}`,
    `prepay_id=${map.prepay_id}`,
    `timestamp=${map.timestamp}`,
    `sign=${sign}`,
    `sign_type=SHA256WithRSA`,
  ].join("&");

  return rawRequest;
};
