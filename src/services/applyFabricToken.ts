import 'dotenv/config'
import axios from "axios";
import https from "https";
type Error = {
    message: string
}
async function applyFabricToken() {
    const baseUrl = process.env.TB_BASE_URL;
    const fabricAppId = process.env.FABRIC_APP_ID;
    const appSecret = process.env.APP_SECRET;

  try {
    const response = await axios.post(
      `${baseUrl}/payment/v1/token`,
      { appSecret: appSecret },
      {
        headers: {
          "Content-Type": "application/json",
          "X-APP-Key": fabricAppId,
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false }), // <--- ignore SSL errors

    
      }
    );

    return response.data;
  } catch (error: Error | any) {
    console.error("Error getting Fabric token:", error?.message);
    throw error;
  }
}

export default applyFabricToken;
