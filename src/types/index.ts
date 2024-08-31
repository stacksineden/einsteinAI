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
  id: string;
  subscription_type: string;
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
  tool_resources: {
    file_search: {
      vector_store_ids: string[];
    };
    code_interpreter: {
      file_ids: string[];
    };
  };
};

// "tool_resources": {
//   "file_search": {
//     "vector_store_ids": ["vs_abc"]
//   },
//   "code_interpreter": {
//     "file_ids": ["file-123", "file-456"]
//   }
// }
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
  tool_resources: {
    file_search: {
      vector_store_ids: string[];
    };
    code_interpreter: {
      file_ids: string[];
    };
  };
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

export type messageType = (
  | {
      type: "text";
      text: string;
    }
  | {
      type: "image_file";
      image_file: {
        file_id: string;
      };
    }
)[];

// Define a type for tools
export type ToolType = { type: "file_search" } | { type: "code_interpreter" };

// Define a type for attachments
export type Attachment = {
  file_id: string;
  tools: ToolType[];
};

export type ICreateMessage = {
  role?: string;
  content: messageType;
  // file_ids?: string[];
  attachments?: Attachment[];
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

type FileCounts = {
  in_progress: number;
  completed: number;
  failed: number;
  cancelled: number;
  total: number;
};

export interface CreateVectorStoresResponse {
  data: {
    id: string;
    object: string;
    created_at: string;
    name: string;
    bytes: number;
    vector_store_id: string;
    file_counts: FileCounts;
  };
}

export interface CreateVectorStoresFileBatchesResponse {
  data: {
    id: string;
    object: string;
    created_at: string;
    name: string;
    bytes: number;
    vector_store_id: string;
    file_counts: FileCounts;
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
  subscription_type: string;
};

export type IUpdateSubscription = {
  document_id: string;
  is_subscribed: boolean;
  currency: string;
  subscription_start_date: string;
  tx_ref: string;
  transaction_id: number;
  amount: number;
  subscription_type: string;
};

export type ICreateUserVectorStores = {
  user_id: string;
  name: string;
  vector_store_id: string;
};

export type ModelDataSet = {
  id: string;
  name: string;
  model: string;
  role: string;
  classifier: string;
  isHighlight: boolean;
  category: string;
  prompt: string;
  pitch: string;
  qoute: string;
  imageUrl: string;
  assistant_description: string;
  level: string;
};
