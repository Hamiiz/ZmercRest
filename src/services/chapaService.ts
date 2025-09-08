import { Chapa } from "chapa-nodejs";
const chapa = new Chapa({
  secretKey: String(process.env.CHAPA_SECRET_KEY),
});
export interface Payee {
  fname: string;
  lname: string;
  email: string;
  phone: string;
  amount: string;
  Pids: number[]


}

export async function initializePayment(PayeeData: Payee) {
  const tx_ref = await chapa.genTxRef();
  const { fname, lname, email, phone, amount,Pids } = PayeeData;
  const pids = Pids.map(String)
  const jp = pids.length > 1 ? pids.join(" "):pids[0]
  console.log(PayeeData)
  console.log(jp)
 
  
  try{

      const response = await chapa.initialize({
          first_name: fname,
    last_name: lname,
    email: email,
    phone_number: phone,
    currency: "ETB",
    amount: amount,
    tx_ref: tx_ref,
    callback_url: `${process.env.API_BASE_URL}/payment/callback`,
    return_url: `${process.env.FRONTEND_URL}/payments/success/${tx_ref}`,
    customization: {
        title: jp,
        description: "Description",
    },
});
console.log(response)
return response
}
catch(err){
    const {status, data, message}:any = err
    console.log(message)
    throw {status, message, data}
}
}


export async function verifyTxn(tx_ref: string) {
    const response = await chapa.verify({
        tx_ref: tx_ref,
      });
    return response
}