const express = require("express");
const bodyParser = require("body-parser");
const Daraja = require("daraja");

const app = express();
app.use(bodyParser.json());

// Safaricom Daraja credentials
const daraja = new Daraja({
  consumerKey: "YOUR_CONSUMER_KEY", // Replace with your Consumer Key
  consumerSecret: "YOUR_CONSUMER_SECRET", // Replace with your Consumer Secret
  environment: "sandbox", // Use "production" for live environment
});

// STK Push endpoint
app.post("https://kwale-hris-api.onrender.com/RobertSTKPush", async (req, res) => {
  const { phoneNumber, amount, description } = req.body;

  try {
    // Initiate STK Push
    const response = await daraja.stkPush({
      BusinessShortCode: "338500", // Your PayBill number
      Password: daraja.generatePassword("338500"), // Generate password
      Timestamp: daraja.generateTimestamp(), // Generate timestamp
      TransactionType: "CustomerPayBillOnline", // Transaction type
      Amount: amount, // Amount to be paid
      PartyA: phoneNumber, // Customer's phone number
      PartyB: "338500", // PayBill number
      PhoneNumber: phoneNumber, // Customer's phone number
      CallBackURL: "https://kwale-hris-api.onrender.com/RobertSTKPush", // Callback URL
      AccountReference: "kwale county", // Account number
      TransactionDesc: description, // Transaction description
    });

    // Send response to client
    res.status(200).json({
      success: true,
      message: "STK Push initiated successfully",
      data: response,
    });
  } catch (error) {
    console.error("STK Push Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to initiate STK Push",
      error: error.message,
    });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});