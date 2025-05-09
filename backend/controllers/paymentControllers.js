const order = require("../models/order");
const user = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const { Cashfree } = require("cashfree-pg");
const {sequelize} = require('sequelize');



Cashfree.XClientId = process.env.CASHFREE_CLIENT_ID;
Cashfree.XClientSecret = process.env.CASHFREE_CLIENT_SECRET;
Cashfree.XEnvironment = "SANDBOX";

exports.createPremiumOrder = async (req, res) => {
  console.log("inside createpremium order");
  try {
    const userId = req.user.userId;

    const orderId = "order_" + uuidv4();

    const request = {
      order_amount: 1.0,
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: `user_${userId}`,
        customer_phone: "9871167101", // optional, can be dynamic
      },
      order_meta: {
        return_url: `http://localhost:3000/expense.html`,
      },
    };

    const response = await Cashfree.PGCreateOrder("2023-08-01", request);
    const paymentSessionId = response.data.payment_session_id;
    console.log("payment_session_id: ", paymentSessionId);
    await order.create({
      id: orderId,
      paymentSessionId,
      userId,
      status: "PENDING",
    });

    res
      .status(200)
      .json({ order_id: orderId, payment_session_id: paymentSessionId });
  } catch (err) {
    console.error("Error at createOrder:", err.response?.data || err.message);
    res.status(500).json({ message: "Order creation failed" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  console.log("inside the updateOrderSTatus");
  try {
    const { order_Id , payment_session_id} = req.params;
    console.log("payment_session_id in update order: ", payment_session_id, order_Id);

    const response = await Cashfree.PGOrderFetchPayments("2023-08-01", order_Id, payment_session_id);
    const payments = response.data;
  
    console.log("payments", response.data);
    let orderStatus = "FAILED";
    if (payments.some(p => p.payment_status === "SUCCESS")) {
      orderStatus = "SUCCESSFUL";
    } else if (payments.some(p => p.payment_status === "PENDING")) {
      orderStatus = "PENDING";
    }
    console.log(orderStatus);

    
      await order.update(
        { status: orderStatus }, 
        { where: { id: order_Id }}
      );
      
      if (orderStatus === "SUCCESSFUL") {
        await user.update(
          { isPremium: true }, 
          { where: { id: req.user.userId } }
        );
      }
    

    res.status(200).json({ status: orderStatus });
  } catch (err) {
    console.error("Error at updateOrderStatus:", err.response?.data || err.message);
    res.status(500).json({ message: "Order status update failed" });
  }
};