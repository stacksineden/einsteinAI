export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};

export type IUpdateUser = {
  userId: string;
  name: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
};

export type IUser = {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
};

export type ISubscription = {
  is_subscribed: boolean;
  subscription_start_date: string;
  amount: number;
};

export type INewUser = {
  name: string;
  email: string;
  password: string;
};

export type IFile = {
  fileId: string;
  fileName: string;
  fileSize: number;
  dateUploaded: number;
  userId: string;
};

export type Ithread = {
  description: string;
  thread_id: string;
  assistant_id: string;
};

export type IupdateAssistantOpenAI = {
  name: string;
  instructions: string;
  description: string;
  tools: Array<{
    type: string;
    function?: {
      name: string;
      description: string;
      parameters: {
        type: string;
        properties: Record<string, any>;
        required: string[];
      };
    };
  }>;
  file_ids: string[];
};

export type ICreateAssistantOpenAI = {
  model: string;
  name: string;
  description: string;
  instructions: string;
  tools: Array<{
    type: string;
    function?: {
      name: string;
      description: string;
      parameters: {
        type: string;
        properties: Record<string, any>;
        required: string[];
      };
    };
  }>;
  file_ids: string[]; // Assuming file_ids is an array of strings
  metadata: {
    userID?: string | null; // Assuming userID is an optional string or null
    assistant_pretraining_name: string;
    role?: string;
  };
};

export type IAssistant = {
  assistant_id: string;
  instructions: string;
  assistant_pretraining_name: string;
  name: string;
  role: string;
  id: string;
};

export type ISavedAssistant = {
  id: string;
  instructions: string;
  name: string;
};

export type ICreateMessage = {
  role?: string;
  content?: string;
  file_ids?: string[];
};

export type ICreateRun = {
  assistant_id: string;
};

export type ToolDetails = {
  tool_call_id: string;
  output: string;
};
export type IToolsOutput = {
  tool_call_id: ToolDetails[];
};

export interface ChatCompletionResponse {
  data: {
    choices: {
      role: string;
      message: {
        content: string;
      };
    }[];
  };
}

export interface PaymentDetails {
  email: string;
  phone_number: string;
  name: string;
  // Add other fields as needed
}

export type IUserSubscription = {
  user_id: string;
  is_subscribed: boolean;
  amount: number;
  currency: string;
  subscription_start_date: string;
  user_email: string;
  transaction_id: number;
  tx_ref: string;
};
