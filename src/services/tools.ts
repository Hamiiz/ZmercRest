// utils/sign-util.ts
import 'dotenv/config';
import { KJUR, hextob64 } from "jsrsasign";

interface BizContent {
  [key: string]: any;
}

interface RequestObject {
  timestamp?: string;
  nonce_str?: string;
  method?: string;
  version?: string;
  biz_content?: BizContent;
  [key: string]: any;
}

// Fields not participating in signature
const excludeFields: string[] = [
  "sign",
  "sign_type",
  "header",
  "refund_info",
  "openType",
  "raw_request",
  "biz_content",
];

/**
 * Signs a request object according to the API rules
 */
export function signRequestObject(requestObject: RequestObject): string {
  const fields: string[] = [];
  const fieldMap: Record<string, any> = {};

  // Include all fields except excluded ones
  for (const key in requestObject) {
    if (!excludeFields.includes(key)) {
      fields.push(key);
      fieldMap[key] = requestObject[key];
    }
  }

  // Include fields inside biz_content
  if (requestObject.biz_content) {
    const biz = requestObject.biz_content;
    for (const key in biz) {
      if (!excludeFields.includes(key)) {
        fields.push(key);
        fieldMap[key] = biz[key];
      }
    }
  }

  // Sort by ASCII
  fields.sort();

  // Build the signing string
  const signStrList = fields.map(key => `${key}=${fieldMap[key]}`);
  const signOriginStr = signStrList.join("&");

  console.log("signOriginStr", signOriginStr);
  const privateKey = process.env.TELEBIRR_PRIVATE_KEY as string;
  if (!privateKey) throw new Error("Private key not set in environment variables");

  return signString(signOriginStr, privateKey);
}

/**
 * Signs a string using RSA SHA256 with PSS
 */
export function signString(text: string, privateKey: string): string {
   privateKey = privateKey?.replace(/\\n/g, '\n');

const sig = new KJUR.crypto.Signature({ alg: "SHA256withRSAandMGF1" });
sig.init(privateKey); // must be proper PEM string
sig.updateString(text);
const signed = hextob64(sig.sign());
return signed

}

/**
 * Returns current UNIX timestamp as string
 */
export function createTimeStamp(): string {
  return Math.floor(Date.now() / 1000).toString();
}

/**
 * Creates a 32-character alphanumeric random string
 */
export function createNonceStr(): string {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let str = "";
  for (let i = 0; i < 32; i++) {
    const index = Math.floor(Math.random() * chars.length);
    str += chars[index];
  }
  return str;
}
