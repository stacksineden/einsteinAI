//fetch payment plans

import axios from "axios";
import { authHeaders, flutterWaveBaseUrl } from "./config";

export async function getFlutterwavePaymentPlans() {
  const url = "/api/payment-plans";

  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
    });

    if (response?.data) {
      return response.data?.data;
    } else {
      console.log("Failed to retrieve payment plans");
    }
  } catch (error) {
    console.error("An error occurred while fetching payment plans:", error);
  }
}

//whichever plan that is selected has the plan id passed into it

//charge the card

//upon sucessful payment ==> update user subcription status

//work with webhooks to handle subsequent charges
