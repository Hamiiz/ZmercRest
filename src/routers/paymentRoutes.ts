import express, { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import { createOrder } from "../services/requestCreateOrder";
import { initializePayment } from "../services/chapaService";
import { Payee } from "../services/chapaService";
let paymentRouter = express.Router();
import validateToken from "../middlewares/jwtVerify";

let prisma = new PrismaClient();
paymentRouter.use(express.json());
paymentRouter
  .route("/payment/telebirr/create")
  .post(validateToken, createOrder);

paymentRouter.use(express.json())
paymentRouter
  .route("/payment/chapa/create")
  .post(validateToken, async (req, res): Promise<any> => {
    const { name, email, address, phone, amount, productIds } = req.body;
    const paymentIds: number[] = [];
    if (!req.user?.id) return res.status(401).send("unauthorized");
    try {
      if (productIds.length > 1) {
        const pr = productIds.split(",");
        // Correct way
        let payments = await Promise.all(
          pr.map(async (id: any) => {
            let product = await prisma.product.findUnique({
              where: { id: parseInt(id) },
            });
            if (!product) return null;
            return {
              PayerId: req.user!.id,
              OwnerId: product.OwnerId,
              amount: product.price,
              ProductId: parseInt(id),
            };
          })
        );
        payments = payments.filter((payment) => payment != null);
        const p = await Promise.all(
          payments.map(async (payment) => {
            let p = await prisma.payment.create({
              data: payment,
            });
            paymentIds.push(p.id);
          })
        )
        
     
      } else {
        const product = await prisma.product.findUnique({
          where: { id: parseInt(productIds) },
        });
        if (!product) return res.status(404).send("product not found");
        const p = await Promise.all(
          [1].map(async () => {
            const payment = await prisma.payment.create({
              data: {
                PayerId: req.user!.id,
                OwnerId: product.OwnerId,
                amount: product.price,
                ProductId: parseInt(productIds),
              },
            });
            paymentIds.push(payment.id);
          }
        ))
        
      
        
        
      }
      const names = name.split(" ");
      const payee: Payee = {
        fname: names[0],
        lname: names[1],
        email: email,
        phone: phone,
        amount: amount,
        Pids: paymentIds,
      };
      try {
        const result = await initializePayment(payee);
        return res.json(result);
      } catch (err: Error | any) {
        return res.status(err.status).json(err.message);
      }
    } catch (error: Error | any) {
      console.log(error);
      return res.status(error.status || 500).send("error creating payment");
    }
  });

paymentRouter.route("/payment/callback").post(async (req, res): Promise<any> => {
  const event = req.body;
  const user = req.user;
  console.log(event);
  let pids = event.customization.title;
  const isPaid = event.status === "success";

  pids = pids.split(" ");
  pids = pids.map(Number);
  console.log('pidds',pids)
  try {
    if (isPaid) {
      
        await prisma.payment.updateMany({
          where: {
            id: {
              in: pids,
            },
          },
          data: {
            Completed: true,
            txn_ref: event.tx_ref,
          },
        });
        return res.status(200).send("success");
      
    }

  } catch (error) {
    console.log(error);
  }
});
export default paymentRouter;
