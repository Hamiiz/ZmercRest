import * as Brevo from '@getbrevo/brevo';
import 'dotenv/config'
const apiInstance = new Brevo.TransactionalEmailsApi();

export default async function SendEmail(to_email:string,to_name:string='',otp:number){
apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO||'');
console.log(to_email)
const email: Brevo.SendSmtpEmail = {
    subject: "{{params.subject}}",
    templateId:1,
    sender: { name: "Cybernova", email: "hmmhsd37@gmail.com" },
    to: [{ email: to_email, name: "Hamza Name" }],
    replyTo:{ email:to_email, name: to_name },
    headers: { "X-Custom-Header": "header-value" },
    params: { 
    subject: "Zmercado Email verification",
    otp:otp},
};

        await apiInstance.sendTransacEmail(email)
        .then((response) => {
            return response
        })
        .catch((error) => {
            console.error('Failed to send email:', error.response?.body || error);
            return error})
    
}
