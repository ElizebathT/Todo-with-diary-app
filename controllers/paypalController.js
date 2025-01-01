// const paypal = require('@paypal/checkout-server-sdk');
// require('dotenv').config();
// const clientId = process.env.PAYPAL_CLIENT_ID;
// const clientSecret = process.env.PAYPAL_SECRET_KEY;
// const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
// const client = new paypal.core.PayPalHttpClient(environment);
// const asynHandler=require("express-async-handler")

// const paypalController={
//     createPayment : asynHandler(async (req, res) => {
//         try {
//             const request = new paypal.orders.OrdersCreateRequest();
//             request.prefer('return=representation');
//             request.requestBody({
//               intent: 'CAPTURE',
//               purchase_units: [{
//                 amount: {
//                   currency_code: 'EUR',
//                   value: '10.00',
//                 },
//               }],
//             });
        
//             const order = await client.execute(request);
        
//             // Extract the approval URL
//             const approvalUrl = order.result.links.find(link => link.rel === 'approve').href;
        
//             // Send the approval URL to the client (Postman or frontend)
//             res.json({
//               id: order.result.id,  // Order ID
//               approvalUrl: approvalUrl  // Redirect the user to this URL for approval
//             });
//           } catch (err) {
//             console.error('Error creating payment:', err);
//             res.status(500).send('Error creating PayPal payment');
          
//         }
//     }),
//     capturePayment :asynHandler(async (req, res) => {
//         const { orderId } = req.body;  // The order ID you received after approval

//         const request = new paypal.orders.OrdersCaptureRequest(orderId);
//         request.requestBody({});
      
//         try {
//           // Capture the payment after approval
//           const capture = await client.execute(request);
//           res.json({
//             status: capture.result.status,  // SUCCESS or other statuses
//             transactionId: capture.result.id,  // PayPal transaction ID
//           });
//     } catch (err) {
//         console.error('Error capturing payment:', err);
//         res.status(500).send('Error capturing PayPal payment');
//     }
// })
// }

// module.exports = paypalController


const stripe = require('stripe')('sk_test_51QTz1XGGbS4GE0x1Jwn2GZx4Ka5ckF4W15jB2gEMwgpXv5twXZoQy6dQLjEVTqfmWKrP1dVnkg19aO2m2ty9ATG400K7Gm2qqD')
const asynHandler=require("express-async-handler");
const Users = require('../models/userScehema');

const paypalController={
    createPayment :asynHandler(async (req, res) => {
        try {
          const { amount } = req.body; 
          const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, 
            currency: 'usd',
          });
      
          res.status(200).send({
            clientSecret: paymentIntent.client_secret,
          });
        } catch (error) {
          res.status(500).send({ error: error.message });
        }
      }),
      payment_sucess:asynHandler(async(req,res)=>{
        const {pay_id}=req.body
        const currentUser=req.user
        const paymentIntent = await stripe.paymentIntents.retrieve(pay_id);
        
        if (paymentIntent.status === 'succeeded') {
            const setPremium=await Users.updateOne({_id:currentUser.id},{premium:true})
            if(!setPremium){
                res.send("Error in setting account to premium")
            }        
            res.send("Congratulations you are a premium memeber now.")
        }
        res.send("Payment was not successful")
      })
    }

    module.exports=paypalController