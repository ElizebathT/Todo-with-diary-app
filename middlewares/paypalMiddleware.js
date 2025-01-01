const stripe = require('stripe')('sk_test_51QTz1XGGbS4GE0x1Jwn2GZx4Ka5ckF4W15jB2gEMwgpXv5twXZoQy6dQLjEVTqfmWKrP1dVnkg19aO2m2ty9ATG400K7Gm2qqD')

const paypalMiddleware=async(req,res)=>{
    try {
        const amount = 1000; 
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount, 
          currency: 'usd',
        });

        
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
}
module.exports=paypalMiddleware