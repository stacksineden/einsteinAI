import axios from "axios";
// import { chatCompletionOpenAI, generateImageOpenAI } from "./lib/openAI/api";

//get live weather report

const openweatherApiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
const serperApiKey = import.meta.env.VITE_SERPER_API_KEY;
const rapidApiKey = import.meta.env.VITE_RAPIDAPI_KEY;
const apifyToken = import.meta.env.VITE_APIFY_API_TOKEN;

interface Weather {
  temperature: number;
  description: string;
}

export async function get_weather(location: string): Promise<Weather> {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${openweatherApiKey}&units=metric`
    );

    const weatherData = response.data;
    // Extract relevant information from the response and return it
    const temperature = weatherData.main.temp;
    const description = weatherData.weather[0].description;

    return {
      temperature,
      description,
    };
  } catch (error) {
    console.error("Error fetching weather:");
    throw new Error("Error fetching weather");
  }
}

export async function google_search(query: string) {
  const headers = {
    "X-API-KEY": serperApiKey,
    "Content-Type": "application/json",
  };
  const requestData = {
    q: query,
  };
  const url = "https://google.serper.dev/search";
  try {
    const response = await axios.post(url, requestData, {
      headers,
    });
    if (response) {
      // console.log(response, "response from serper api");
      return response?.data?.organic;
    } else {
      console.log("No response from serper");
    }
  } catch (err) {
    console.log(err);
  }
}

export async function get_stock_info(symbol: string) {
  const url = `https://yahoo-finance127.p.rapidapi.com/search/${symbol}`;
  const headers = {
    "X-RapidAPI-Key": rapidApiKey,
    "X-RapidAPI-Host": "yahoo-finance127.p.rapidapi.com",
  };
  try {
    const response = await axios.get(url, {
      headers,
    });
    if (response) {
      // console.log(response, "response from yahoo finance");
      return response?.data;
    } else {
      console.log("No response from rapid api");
    }
  } catch (err) {
    console.log(err);
  }
}

export async function youtube_q_and_a(url: string, message: string) {
  const request_url = `https://2z8fel.buildship.run/chat-with-youtube`;
  const request_data = {
    url,
    message,
  };
  try {
    const response = await axios.post(request_url, request_data);
    if (response) {
      return response?.data;
    } else {
      console.log("No response from youtube api");
    }
  } catch (err) {
    console.log(err);
  }
}

export async function get_latest_news_on_sahara() {
  const url = "https://2z8fel.buildship.run/latest-news-sahara-reporters";
  try {
    const response = await axios.get(url);
    if (response) {
      return response?.data;
    } else {
      console.log("No response from news");
    }
  } catch (err) {
    console.log(err);
  }
}
export async function get_amazon_finds() {
  const url = "https://2z8fel.buildship.run/llm-extract-ecommerce";
  try {
    const response = await axios.get(url);
    if (response) {
      return response?.data;
    } else {
      console.log("No response from amazon");
    }
  } catch (err) {
    console.log(err);
  }
}

export async function scrape_web_url(url: string) {
  const request_url = "https://2z8fel.buildship.run/scrape-web-url";
  const request_data = {
    url,
  };
  try {
    const response = await axios.post(request_url, request_data);
    if (response) {
      return response?.data;
    } else {
      console.log("No response");
    }
  } catch (err) {
    console.log(err);
  }
}

export async function google_search_apify(query: string) {
  const url = `https://api.apify.com/v2/actor-tasks/stacksineden~google-search-results-scraper-task/run-sync-get-dataset-items?token=${apifyToken}`;
  const request_data = {
    queries: query,
  };
  try {
    const response = await axios.post(url, request_data);
    if (response) {
      return response?.data[0]?.organicResults;
    } else {
      console.log("No response"); 
    }
  } catch (err) {
    console.log(err);
  }
}

export async function trip_advisor_search(location: string) {
  const url = `https://api.apify.com/v2/actor-tasks/stacksineden~tripadvisor-scraper-task/run-sync-get-dataset-items?token=${apifyToken}`;
  const request_data = {
    locationFullName: location,
  };
  try {
    const response = await axios.post(url, request_data);
    if (response) {
      return response?.data;
    } else {
      console.log("No response");
    }
  } catch (err) {
    console.log(err);
  }
}

export async function youtube_scrapper(keyword: string) {
  const url = `https://api.apify.com/v2/actor-tasks/stacksineden~youtube-scraper-task/run-sync-get-dataset-items?token=${apifyToken}`;
  const request_data = {
    searchKeywords: keyword,
  };
  try {
    const response = await axios.post(url, request_data);
    if (response) {
      return response?.data;
    } else {
      console.log("No response");
    }
  } catch (err) {
    console.log(err);
  }
}

export const specilizedFunctions = [
  {
    name: "get_weather",
    function: {
      name: "get_weather",
      description: "Determine weather in my location",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state e.g. San Francisco, CA",
          },
        },
        required: ["location"],
      },
    },
  },
  {
    name: "generate_image",
    function: {
      name: "generate_image",
      description: "Generate images from a given prompt",
      parameters: {
        type: "object",
        properties: {
          prompt: {
            type: "string",
            description: "The prompt needed for image generation",
          },
        },
        required: ["prompt"],
      },
    },
  },
  {
    name: "generate_content_for_a_given_prompt",
    function: {
      name: "generate_content_for_a_given_prompt",
      description:
        "Generates content based off a given prompt or topic by the user",
      parameters: {
        type: "object",
        properties: {
          prompt: {
            type: "string",
            description:
              "The prompt or the topic the user wants to generate contents for",
          },
        },
        required: ["prompt"],
      },
    },
  },
  {
    name: "google_search",
    function: {
      name: "google_search",
      description: "generate result from a reatime google search",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              "the search query which is what the user is searching for",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    name: "get_stock_info",
    function: {
      name: "get_stock_info",
      description: "get the latest information of the stocks market",
      parameters: {
        type: "object",
        properties: {
          symbol: {
            type: "string",
            description:
              "the symbol users want to get the last stock information for",
          },
        },
        required: ["symbol"],
      },
    },
  },
  {
    name: "youtube_q_and_a",
    function: {
      name: "youtube_q_and_a",
      description: "answer user questions based off a given youtube url",
      parameters: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description:
              "the youtube video url the user wants to ask question on",
          },
          message: {
            type: "string",
            description: "the user message or question about the youtube url",
          },
        },
        required: ["url", "message"],
      },
    },
  },
  // {
  //   name: "get_latest_news_on_sahara",
  //   function: {
  //     name: "get_latest_news_on_sahara",
  //     description: "get latest news on sahara",
  //     parameters: {}, //find out what to do if it is empty
  //   },
  // },
  // {
  //   name: "get_amazon_finds",
  //   function: {
  //     name: "get_amazon_finds",
  //     description: "get latest products on amazon",
  //     parameters: {}, //find out what to do if it is empty
  //   },
  // },
  {
    name: "scrape_web_url",
    function: {
      name: "scrape_web_url",
      description: "scrape a web url",
      parameters: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description: "the url to scrape",
          },
        },
        required: ["url"],
      },
    },
  },
  {
    name: "google_search_apify",
    function: {
      name: "google_search_apify",
      description: "generate result from a reatime google search",
      parameters: {
        type: "object",
        properties: {
          queries: {
            type: "string",
            description:
              "the search query which is what the user is searching for",
          },
        },
        required: ["queries"],
      },
    },
  },
  {
    name: "trip_advisor_search",
    function: {
      name: "trip_advisor_search",
      description:
        "generate trip advisor search results based on user location",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "the user request location",
          },
        },
        required: ["location"],
      },
    },
  },
  {
    name: "youtube_scrapper",
    function: {
      name: "youtube_scrapper",
      description:
        "get youtube video recommendation based on use search keyword",
      parameters: {
        type: "object",
        properties: {
          keyword: {
            type: "string",
            description: "the user search keyword",
          },
        },
        required: ["keyword"],
      },
    },
  },
];

export function findSpecializedfunctionByKeyWord(keyWord: string) {
  const foundFunction = specilizedFunctions.find(
    (specFunction) => specFunction.name === keyWord
  );

  return foundFunction?.function;
}

// export const functionMap: Record<string, Function> = {
//   get_weather,
//   // get_content_from_url,
//   generate_image,
//   generate_content_for_a_given_prompt,
// };

//tools to look at, convert natuaral language to API calls

//reseach on google search library

// get contents from a url

// export async function get_content_from_url(url: string) {
//   try {
//     const response = await axios.get(
//       `https://u9gjzc.buildship.run/get-url-content?url=${url}`
//     );
//     console.log(response, 'response from api');
//     return response;
//   } catch (err) {
//     console.log(err, "error getting contents from url");
//   }
// }

// create images from DALE-3

// export async function generate_image(prompt: string) {
//   try {
//     // const response = await axios.get(
//     //   `https://u9gjzc.buildship.run/generate-image-openai?prompt=${prompt}`
//     // );
//     const response = await generateImageOpenAI(prompt);
//     return response;
//   } catch (err) {
//     console.log(err, "error creating images");
//   }
// }

// export async function generate_content_for_a_given_prompt(prompt: string) {
//   try {
//     const response = await chatCompletionOpenAI(prompt);
//     return response;
//   } catch (err) {
//     console.log(err);
//   }
// }
