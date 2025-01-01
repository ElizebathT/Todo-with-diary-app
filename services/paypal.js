// require('dotenv').config();
// const axios=require("axios")

// async function generateAccessToken(){
//     const response=await axios({
//         url:process.env.PAYPAL_BASE_URL+'/v1/oauth2/token',
//         method:'post',
//         data:'grant_type=client_credentials',
//         auth:{
//             username:process.env.PAYPAL_CLIENT_ID,
//             password:process.env.PAYPAL_SECRET_KEY
//         }
//     })
//     // console.log(response.data);
//     return response.data.access_token
// }

// // generateAccessToken()

// async function createOrder(){
//     const accessToken=await generateAccessToken()
//     const response=await axios({
//         url:process.env.PAYPAL_BASE_URL+'/v2/checkout/orders',
//         method:'post',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer'+ accessToken
//         },
//         data:JSON.stringify({
//             intent:'CAPTURE',
//             purchase_units:[
//                 {
//                     items:[
//                         {
//                             name:'PREMIUM SUBCRIPTION',
//                             description:'Subcription to get premium service',
//                             quantity:1,
//                             unit_amount:{
//                                 currency_code:'USD',
//                                 value:'2.00'
//                             }
//                         }
//                     ],
//                     amount:{
//                         currency_code:'USD',
//                         value:'2.00',
//                         breakdown:{
//                             item_total:{
//                                 currency_code:'USD',
//                                 value:'2.00'
//                             }
//                         }
//                     }
//                 }
//             ],
//             application_context:{
//                 return_url:'http://localhost:3004/complete_order',
//                 cancel_url:'http://localhost:3004/cancel_order'
//             }
//         })
//     })
//     console.log(response.data);
    
// }
// createOrder()