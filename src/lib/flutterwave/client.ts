//fetch payment plans

import axios from "axios";
import { authHeaders } from "./config";

export async function getFlutterwavePaymentPlans() {
  let url;

  if (import.meta.env.MODE === "development") {
    url = "/api/payment-plans"; // Use local development URL
  } else {
    url = "https://api.flutterwave.com/v3/api/payment-plans"; // Use production URL
  }

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

// export async function cancelFlutterwavePaymentPlan(plan_id: string) {
//   const url = `/api/payment-plans/${plan_id}/cancel`;
//   try {
//     const response = await axios.put(
//       url,
//       {},
//       {
//         headers: {
//           "Content-Type": "application/json",
//           ...authHeaders,
//         },
//       }
//     );

//     if (response?.data) {
//       return response.data?.data;
//     } else {
//       console.log("Failed cancel plan");
//     }
//   } catch (error) {
//     console.error("An error occurred while cancellling plan:", error);
//   }
// }

//whichever plan that is selected has the plan id passed into it

//charge the card

//upon sucessful payment ==> update user subcription status

//work with webhooks to handle subsequent charges
