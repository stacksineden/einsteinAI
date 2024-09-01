export enum QUERY_KEYS {
  // AUTH KEYS
  CREATE_USER_ACCOUNT = "createUserAccount",

  // USER KEYS
  GET_CURRENT_USER = "getCurrentUser",
  GET_USERS = "getUsers",
  GET_USER_BY_ID = "getUserById",

  //FILES KEYS
  GET_USER_FILES = "getUserFiles",
  GET_ASSISTANTS_FOR_USER = "getAssistantForUsers",

  //THREAD KEYS
  GET_ASSISTANT_THREADS = "getAssistantThreads",

  //LOAD OPENAI MESSGAES 
  LOAD_OPENAI_MESSAGES = "loadOpenAIMessages",

  //RETREIVE RUN STATUS 
  RETREIVE_RUN_STATUS = "retreiveRunStatus",

  //GET FLUTTERWAVE PAYMENT PLANS 
  GET_FLUTTERWAVE_PLANS = "getFlutterwavePlans",

  //GET USER SUBSCRIPTION  DETAILS
  GET_USER_SUBSCRIPTION_DETAILS = "getUserSubscriptionDetails",

  //GET USER VECTOR STORE DETAILS 
  GET_USER_VECTOR_STORE_DETAILS = "getUserVectorStoreDetails"
}

