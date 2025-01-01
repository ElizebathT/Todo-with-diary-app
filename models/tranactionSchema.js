const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user_id: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        require:true
      },
    transactionId: {
    type:String,
    require:true
    },
    amount: {
        type:Number,
        require:true
    },
    status: {
        type:Boolean,
        default:false,
        require:true
    }
},{timestamps});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;