"use client";
import React, { useEffect, useState } from "react";
import { usePaystackPayment } from "react-paystack";

interface PaystackReference {
  message: string;
  reference: string;
  status: "success" | "failure";
  trans: string;
  transaction: string;
  trxref: string;
}

interface PaystackButtonProps {
  email: string;
  amount: number;
  onSuccess: (reference: PaystackReference) => void;
  onClose: () => void;
  disabled?: boolean;
}

const PaystackButton: React.FC<PaystackButtonProps> = ({
  email,
  amount,
  onSuccess,
  onClose,
  disabled,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string>("");

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  // Check if Paystack is properly configured
  useEffect(() => {
    if (!publicKey) {
      setError("Paystack configuration missing");
      console.error("NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY not found in environment variables");
      return;
    }

    if (!email) {
      setError("Email is required");
      return;
    }

    if (amount <= 0) {
      setError("Invalid amount");
      return;
    }

    setIsReady(true);
    setError("");
  }, [email, amount, publicKey]);

  const config = {
    reference: new Date().getTime().toString(),
    email,
    amount: amount * 100, // Amount in kobo
    publicKey: publicKey || "",
  };

  const initializePayment = usePaystackPayment(config);

  const handleClick = () => {
    if (disabled || !isReady || error) {
      return;
    }

    try {
      initializePayment({ 
        onSuccess: (reference) => {
          onSuccess(reference);
        }, 
        onClose: () => {
          onClose();
        }
      });
    } catch (err) {
      console.error('Error initializing Paystack:', err);
      setError("Failed to initialize payment");
    }
  };

  // Show error state
  if (error) {
    return (
      <div className="text-center">
        <button
          disabled
          className="bg-red-500 text-white font-bold py-4 px-8 rounded-lg text-xl opacity-75 cursor-not-allowed"
        >
          Payment Error
        </button>
        <p className="text-red-500 text-sm mt-2">{error}</p>
        {process.env.NODE_ENV === 'development' && (
          <p className="text-xs text-gray-500 mt-1">
            Check console for details
          </p>
        )}
      </div>
    );
  }

  // Show loading state
  if (!isReady) {
    return (
      <button
        disabled
        className="bg-gray-400 text-white font-bold py-4 px-8 rounded-lg text-xl opacity-75 cursor-not-allowed"
      >
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading Payment...
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || !isReady}
      className={`font-bold py-4 px-8 rounded-lg text-xl transition-all duration-300 ${
        disabled || !isReady
          ? 'bg-gray-400 text-gray-200 opacity-75 cursor-not-allowed'
          : 'bg-chambray-700 hover:bg-chambray-800 text-white cursor-pointer hover:scale-105'
      }`}
    >
      {disabled ? 'Complete Form First' : 'ENROLL NOW - ₦50,000'}
    </button>
  );
};

export default PaystackButton; 