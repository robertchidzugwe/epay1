"use client";
import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import Image from "next/image";
import axios from "axios";

const API_BASE_URL = "https://kwale-hris-api.onrender.com";

const HARDCODED_FEES = [
  { Id: "110", FeeName: "Branded Umbrella monthly charge per one", FFAFeeName: "Advertisement", FeeAmount: 500 },
  { Id: "111", FeeName: "VEHICLE BRANDING FEE", FFAFeeName: "Advertisement", FeeAmount: 8000 },
  { Id: "112", FeeName: "NAME PANNELS", FFAFeeName: "Advertisement", FeeAmount: 0 },
  { Id: "126", FeeName: "Auction Fees - Cattle per day", FFAFeeName: "Various Fees", FeeAmount: 120 },
  { Id: "127", FeeName: "Auction Fees Outside Auction Yard - Sheep/goat perday", FFAFeeName: "Various Fees", FeeAmount: 150 },
  { Id: "128", FeeName: "Fine for not displaying business permit", FFAFeeName: "Various Fees", FeeAmount: 2000 },
  { Id: "129", FeeName: "Impounded Vehicle Storage Charges", FFAFeeName: "Various Fees", FeeAmount: 500 },
  { Id: "130", FeeName: "Private garbage collectors disposing garbage at non-desgnated area", FFAFeeName: "Various Fees", FeeAmount: 100000 },
  { Id: "131", FeeName: "Sale of county minutes", FFAFeeName: "Various Fees", FeeAmount: 5 },
  { Id: "132", FeeName: "Sale of County Assembly resolution", FFAFeeName: "Various Fees", FeeAmount: 5 },
  { Id: "133", FeeName: "Reckless & careless throwing of garbage", FFAFeeName: "Various Fees", FeeAmount: 2000 },
  { Id: "134", FeeName: "Breakage of electric poles by reckless drivers", FFAFeeName: "Various Fees", FeeAmount: 60000 },
  { Id: "135", FeeName: "Impounding of non-P.S.V Vehicles", FFAFeeName: "Various Fees", FeeAmount: 3000 },
  { Id: "136", FeeName: "Impounding of defaulting P.S.V Vehicles", FFAFeeName: "Various Fees", FeeAmount: 5000 },
  { Id: "137", FeeName: "DeClamping fee - Defaulting Lorries of Cess", FFAFeeName: "Various Fees", FeeAmount: 7000 },
  { Id: "138", FeeName: "Music Band/ Live Disco Licence", FFAFeeName: "Various Fees", FeeAmount: 3000 },
  { Id: "139", FeeName: "Music Disco/ Live Band- Local", FFAFeeName: "Various Fees", FeeAmount: 1500 },
  { Id: "140", FeeName: "Impounding of tuk tuk", FFAFeeName: "Various Fees", FeeAmount: 1000 },
  { Id: "141", FeeName: "Lorries Up to 5 Tons", FFAFeeName: "Various Fees", FeeAmount: 150 },
  { Id: "142", FeeName: "Storage for Impounded Goods", FFAFeeName: "Various Fees", FeeAmount: 200 },
  { Id: "143", FeeName: "Charcoal per big bag", FFAFeeName: "CESS", FeeAmount: 50 },
  { Id: "144", FeeName: "Charcoal per small bag", FFAFeeName: "CESS", FeeAmount: 25 },
  { Id: "145", FeeName: "Sugarcane", FFAFeeName: "CESS", FeeAmount: 1 },
  { Id: "146", FeeName: "Eggs", FFAFeeName: "CESS", FeeAmount: 30 }
];

const ENTITY_CATEGORIES = ["vehicles", "hospital", "others", "advertisement"];

export default function PaymentApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    userId: "",
    phoneNumber: "",
    customerName: "",
    emailAddress: "",
    plateNumber: "",
    idNumber: "",
    entityTopay: "",
    amountTopay: "",
    feeId: "",
    feeName: "",
    quantity: ""
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showReports, setShowReports] = useState(false);
  const [reportData, setReportData] = useState({
    collectors: "",
    dateFrom: "",
    dateTo: "",
    reportType: "pdf",
  });
  const [reportResponse, setReportResponse] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [authToken, setAuthToken] = useState("");

  const handleApiLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await axios.post(
        `${API_BASE_URL}/proxy/authenticate`,
        {
          username: loginData.username.trim(),
          password: loginData.password.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          timeout: 10000,
        }
      );
  
      const data = response.data;
  
      if (data?.responsecode === "1111") {
        setIsAuthenticated(true);
        setAuthToken(data.token || "");
        setFormData(prev => ({
          ...prev,
          userId: data.userid,
          employeename: data.employeename,
          admin_phone: data.admin_phone
        }));
        toast.success("Login successful!");
      } else {
        throw new Error("Invalid username or password");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Authentication failed";
      toast.error(`API Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    return handleApiLogin(e);
  };

  const formatPhoneNumber = (phoneNumber) => {
    let cleaned = phoneNumber.replace(/\D/g, "");
    if (cleaned.startsWith("0")) {
      cleaned = "254" + cleaned.slice(1);
    } else if (cleaned.startsWith("254")) {
      // Already in 254 format
    } else if (cleaned.startsWith("+254")) {
      cleaned = cleaned.slice(1);
    }
    return cleaned;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      if (name === "phoneNumber") {
        try {
          updatedData.phoneNumber = formatPhoneNumber(value);
        } catch (error) {
          toast.error(error.message);
          updatedData.phoneNumber = "";
        }
      }
      return updatedData;
    });
  };

  const handleProceed = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleFeeSelection = (e) => {
    const selectedFeeName = e.target.value;
    const selectedFee = HARDCODED_FEES.find(fee => fee.FeeName === selectedFeeName);

    if (selectedFee) {
      setFormData({
        ...formData,
        feeName: selectedFee.FeeName,
        feeId: selectedFee.Id,
        amountTopay: formData.quantity ? (selectedFee.FeeAmount * parseInt(formData.quantity)).toString() : "",
        entityTopay: selectedFee.FFAFeeName
      });
    }
  };

  const handleQuantityChange = (e) => {
    const quantity = e.target.value;
    const selectedFee = HARDCODED_FEES.find(fee => fee.FeeName === formData.feeName);
    
    setFormData({
      ...formData,
      quantity: quantity,
      amountTopay: selectedFee && quantity ? (selectedFee.FeeAmount * parseInt(quantity)).toString() : ""
    });
  };

  const handleReportChange = (e) => {
    setReportData({ ...reportData, [e.target.name]: e.target.value });
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "https://example.com/generate-report",
        reportData,
        {
          headers: { "Content-Type": "application/json" },
          timeout: 10000,
        }
      );

      const result = response.data;
      if (!response.data.success) throw new Error(result.message || "Failed to generate report");
      setReportResponse(result);
      toast.success("Report generated successfully!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                        error.message || 
                        "Report generation failed";
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const payload = {
        userId: formData.userId,
        phoneNumber: formData.phoneNumber,
        customerName: formData.customerName,
        emailAddress: formData.emailAddress,
        plateNumber: formData.plateNumber,
        idNumber: formData.idNumber,
        entityTopay: formData.entityTopay,
        amountTopay: formData.amountTopay,
        feeId: formData.feeId,
        feeName: formData.feeName,
        quantity: formData.quantity
      };
  
      const missingFields = Object.entries(payload)
        .filter(([_, val]) => !val)
        .map(([key]) => key);
  
      if (missingFields.length) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
  
      const billingResponse = await axios.post(
        `${API_BASE_URL}/Billing`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            ...(authToken && { "Authorization": `Bearer ${authToken}` })
          },
        }
      );
  
      const billingResult = billingResponse.data;
  
      const stkPayload = {
        Phone: formData.phoneNumber,
        Amount: billingResult.amount,
        AccountReference: billingResult.billRefNumber
      };
  
      const stkResponse = await axios.post(
        `https://kwale-hris-api.onrender.com/proxy/stkPush`,
        stkPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      const stkResult = stkResponse.data;
  
      alert(
        `✅ Billing & STK Push Successful\n\n` +
        `Billing Ref: ${billingResult.billRefNumber}\n` +
        `Amount: ${billingResult.amount}\n` +
        `Status: ${billingResult.status}\n\n` +
        `STK: ${stkResult[0]?.CustomerMessage || 'Request sent to phone'}`
      );
  
      setFormData({
        userId: formData.userId,
        phoneNumber: "",
        customerName: "",
        emailAddress: "",
        plateNumber: "",
        idNumber: "",
        entityTopay: "",
        amountTopay: "",
        feeId: "",
        feeName: "",
        quantity: ""
      });
  
      setStep(1);
  
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Payment submission failed";
  
      alert(`❌ Failed\n\n${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthToken("");
    setFormData({
      userId: "",
      phoneNumber: "",
      customerName: "",
      emailAddress: "",
      plateNumber: "",
      idNumber: "",
      entityTopay: "",
      amountTopay: "",
      feeId: "",
      feeName: "",
      quantity: ""
    });
    setStep(1);
    toast.success("Logged out successfully!");
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-400 to-indigo-600 p-6">
        <Toaster position="top-center" />
        <div className="w-full max-w-lg bg-white shadow-2xl rounded-3xl p-10 relative"
          style={{
            backgroundImage: "url('/back.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.9,
          }}>
          <div className="absolute inset-0 bg-white bg-opacity-70 rounded-3xl"></div>
          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <Image src="/logo.jpeg" alt="Logo" width={80} height={80} />
            </div>
            <h2 className="text-4xl font-bold text-indigo-700 text-center mb-6">E-Pay Mobile App</h2>
            <form onSubmit={handleLogin} className="space-y-6">
              <label className="block text-gray-800 font-semibold mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={loginData.username}
                onChange={handleLoginChange}
                required
                className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your username"
              />
              <label className="block text-gray-800 font-semibold mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
                className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your password"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition disabled:bg-gray-400"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
            <p className="text-center text-gray-700 mt-6 font-semibold">
              Powered by Kwale County Government
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-400 to-indigo-600 p-6">
      <Toaster position="top-center" />
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-3xl p-10 relative"
        style={{
          backgroundImage: "url('/back.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.9,
        }}>
        <div className="absolute inset-0 bg-white bg-opacity-70 rounded-3xl"></div>
        <div className="relative z-10">
          <button
            onClick={handleLogout}
            className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 transition"
          >
            Log Out
          </button>

          <div className="flex justify-center mb-4">
            <Image src="/logo.jpeg" alt="Logo" width={80} height={80} />
          </div>
          <h2 className="text-4xl font-bold text-indigo-700 text-center mb-6">E-Pay Mobile App</h2>
          
          {showReports ? (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-center text-gray-800">Generate Report</h3>
              <form onSubmit={handleReportSubmit} className="space-y-6">
                <label className="block text-gray-800 font-semibold mb-2">Collectors</label>
                <input
                  type="text"
                  name="collectors"
                  value={reportData.collectors}
                  onChange={handleReportChange}
                  required
                  className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter collectors"
                />
                <label className="block text-gray-800 font-semibold mb-2">Date From</label>
                <input
                  type="date"
                  name="dateFrom"
                  value={reportData.dateFrom}
                  onChange={handleReportChange}
                  required
                  className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500"
                />
                <label className="block text-gray-800 font-semibold mb-2">Date To</label>
                <input
                  type="date"
                  name="dateTo"
                  value={reportData.dateTo}
                  onChange={handleReportChange}
                  required
                  className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500"
                />
                <label className="block text-gray-800 font-semibold mb-2">Report Type</label>
                <select
                  name="reportType"
                  value={reportData.reportType}
                  onChange={handleReportChange}
                  required
                  className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="pdf">PDF</option>
                  <option value="csv">CSV</option>
                </select>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition disabled:bg-gray-400"
                >
                  {loading ? "Generating Report..." : "Generate Report"}
                </button>
              </form>
              {reportResponse && (
                <div className="mt-6 p-4 bg-gray-100 rounded-xl">
                  <h4 className="text-lg font-bold text-gray-800 mb-2">Report Output</h4>
                  <pre className="text-sm text-gray-700">{JSON.stringify(reportResponse, null, 2)}</pre>
                </div>
              )}
              <button
                onClick={() => setShowReports(false)}
                className="w-full bg-gray-500 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-gray-700 transition"
              >
                Back to Payment Method
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-center space-x-2 mb-4">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`w-8 h-8 rounded-full ${
                      s === step ? "bg-indigo-600" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
              
              {step === 1 && (
                <form onSubmit={handleProceed} className="space-y-6">
                  <label className="block text-gray-800 font-semibold mb-2">Payment Method</label>
                  <div className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500 bg-gray-100">
                    M-Pesa
                  </div>
                  <div className="text-center text-red-600 font-semibold text-sm mt-4">
                    <p>This system exclusively accepts M-Pesa as the authorized payment method for receipting.</p>
                    <p>Cash payments is strictly prohibited by the Kwale County Government.</p>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition"
                  >
                    Proceed
                  </button>
                </form>
              )}
              
              {step === 2 && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStep(3);
                  }}
                  className="space-y-6"
                >
                  <button
                    onClick={() => setStep(1)}
                    className="w-full bg-gray-500 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-gray-700 transition"
                  >
                    Back
                  </button>

                  <label className="block text-gray-800 font-semibold mb-2">User ID</label>
                  <input
                    type="text"
                    name="userId"
                    value={formData.userId}
                    readOnly
                    className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500 bg-gray-100"
                  />

                  <label className="block text-gray-800 font-semibold mb-2">Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter phone number (e.g., 254722000000)"
                  />

                  <label className="block text-gray-800 font-semibold mb-2">Customer Name</label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                    className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter customer name"
                  />

                  <label className="block text-gray-800 font-semibold mb-2">Email Address</label>
                  <input
                    type="email"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter email address"
                  />

                  <label className="block text-gray-800 font-semibold mb-2">Plate Number</label>
                  <input
                    type="text"
                    name="plateNumber"
                    value={formData.plateNumber}
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter vehicle plate number"
                  />

                  <label className="block text-gray-800 font-semibold mb-2">ID Number</label>
                  <input
                    type="text"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter national ID/passport number"
                  />

                  <div className="relative">
                    <label className="block text-gray-800 font-semibold mb-2">Fee Name</label>
                    <input
                      type="text"
                      placeholder="Search by fee name or category (e.g. 'CESS')"
                      className="w-full p-2 border border-gray-300 rounded-lg mb-1"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                      name="feeName"
                      onChange={handleFeeSelection}
                      value={formData.feeName}
                      className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select Fee</option>
                      {HARDCODED_FEES
                        .filter(fee => 
                          fee.FeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          fee.FFAFeeName.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map(fee => (
                          <option key={fee.Id} value={fee.FeeName}>
                            {fee.FeeName} ({fee.FFAFeeName})
                          </option>
                        ))}
                    </select>
                  </div>

                  <label className="block text-gray-800 font-semibold mb-2">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    min="0"
                    value={formData.quantity}
                    onChange={handleQuantityChange}
                    className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter quantity (0 or more)"
                  />

                  <label className="block text-gray-800 font-semibold mb-2">Entity to Pay</label>
                  <select
                    name="entityTopay"
                    value={formData.entityTopay}
                    onChange={handleChange}
                    required
                    className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select entity to pay</option>
                    <option value="vehicles">Vehicles</option>
                    <option value="hospital">Hospital</option>
                    <option value="others">Others</option>
                    <option value="advertisement">Advertisement</option>
                  </select>

                  <label className="block text-gray-800 font-semibold mb-2">Fee ID</label>
                  <input
                    type="text"
                    name="feeId"
                    value={formData.feeId}
                    readOnly
                    className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500 bg-gray-100"
                  />

                  <label className="block text-gray-800 font-semibold mb-2">Amount to Pay</label>
                  <input
                    type="text"
                    name="amountTopay"
                    value={formData.amountTopay}
                    readOnly
                    className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-indigo-500 bg-gray-100"
                  />

                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-green-700 transition"
                  >
                    Review
                  </button>
                </form>
              )}
              
              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-center text-gray-800">Review Your Details</h3>
                  <p><strong>User ID:</strong> {formData.userId}</p>
                  <p><strong>Phone Number:</strong> {formData.phoneNumber}</p>
                  <p><strong>Customer Name:</strong> {formData.customerName}</p>
                  <p><strong>Email Address:</strong> {formData.emailAddress || 'N/A'}</p>
                  <p><strong>Plate Number:</strong> {formData.plateNumber || 'N/A'}</p>
                  <p><strong>ID Number:</strong> {formData.idNumber || 'N/A'}</p>
                  <p><strong>Entity to Pay:</strong> {formData.entityTopay}</p>
                  
                  <p><strong>Amount to Pay:</strong> {formData.amountTopay}</p>
                  <p><strong>Fee ID:</strong> {formData.feeId}</p>
                  
                  <button
                    onClick={() => setStep(2)}
                    className="w-full bg-yellow-600 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-yellow-700 transition"
                  >
                    Back to Edit
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-green-600 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-green-700 transition disabled:bg-gray-400"
                  >
                    {loading ? "Submitting..." : "Submit Payment"}
                  </button>

                  {apiResponse && (
                    <div className="mt-6 p-4 bg-gray-100 rounded-xl">
                      <h4 className="text-lg font-bold text-gray-800 mb-2">API Response</h4>
                      <pre className="text-sm text-gray-700 overflow-auto">
                        {JSON.stringify(apiResponse, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          
          <p className="text-center text-gray-700 mt-6 font-semibold">
            Powered by Kwale County Government
          </p>
        </div>
      </div>
    </div>
  );
}