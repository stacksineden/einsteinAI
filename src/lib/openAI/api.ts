import axios from "axios";
import { authHeaders } from "./config";
import { FileWithPath } from "react-dropzone";
import {
  ChatCompletionResponse,
  CreateVectorStoresFileBatchesResponse,
  CreateVectorStoresResponse,
  ICreateAssistantOpenAI,
  ICreateMessage,
  ICreateRun,
  IupdateAssistantOpenAI,
  ToolDetails,
} from "@/types";

// Upload file to OpenAI
export async function uploadFileToOpenAI(acceptedFiles: FileWithPath[]) {
  try {
    const url = "https://api.openai.com/v1/files";

    const file = acceptedFiles[0];

    const requestData = new FormData();

    const mimeType = file.type;
    const purpose = mimeType.startsWith("image/") ? "vision" : "assistants";
    requestData.append("file", file);
    requestData.append("purpose", purpose);

    const response = await axios.post(url, requestData, {
      headers: authHeaders,
    });
    // You might want to do something with the response here
    return response.data; // Adjust this based on what you want to return from the function
  } catch (error) {
    console.error("Error uploading file to OpenAI:", error);
    throw error; // Rethrow the error so that the calling code can handle it
  }
}

//delete file from Openai
export async function deleteFileFromOpenAI(fileId: string) {
  try {
    const url = `https://api.openai.com/v1/files/${fileId}`;

    const response = await axios.delete(url, {
      headers: authHeaders,
    });
    // console.log(response, "response from deleting");
    return response;
  } catch (err) {
    console.log("Error deleting file from OpenAI", err);
  }
}

//create assistant openai

export async function createAssistantOpenAI(payload: ICreateAssistantOpenAI) {
  try {
    const url = "https://api.openai.com/v1/assistants";
    const response = await axios.post(url, payload, {
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2",
      },
    });
    // console.log(response, "api level response");
    if (response.status >= 200 && response.status < 300) {
      return response?.data;
    } else {
      throw new Error(`Failed to create assistant. Status: ${response.status}`);
    }
  } catch (err) {
    console.log("Error creating assistant", err);
  }
}

//retrive assistant details

export async function retrieveAssistantOpenAI(assistant_id: string) {
  try {
    const url = `https://api.openai.com/v1/assistants/${assistant_id}`;
    const response = await axios.get(url, {
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2",
      },
    });
    // console.log(response, "api assistant response");
    if (response.status >= 200 && response.status < 300) {
      return response?.data;
    } else {
      throw new Error(`Failed to create assistant. Status: ${response.status}`);
    }
  } catch (err) {
    console.log("Error retrieving assistant", err);
  }
}

//update assistant
export async function updateAssistantOpenAI(
  assistant_id: string,
  payload: IupdateAssistantOpenAI 
) {
  try {
    const url = `https://api.openai.com/v1/assistants/${assistant_id}`;
    const response = await axios.post(url, payload, {
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2",
      },
    });
    if (response.status >= 200 && response.status < 300) {
      return response?.data;
    } else {
      throw new Error(`Failed to update assistant. Status: ${response.status}`);
    }
  } catch (err) {
    console.log("Error updating assistant", err);
  }
}

//delete assistant
export async function deleteAssistantOpenAI(assistant_id: string) {
  try {
    const url = `https://api.openai.com/v1/assistants/${assistant_id}`;
    const response = await axios.delete(url, {
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2",
      },
    });
    if (response.status >= 200 && response.status < 300) {
      return response?.data;
    } else {
      throw new Error(`Failed to delete assistant. Status: ${response.status}`);
    }
  } catch (err) {
    console.log("Error deleting assistant", err);
  }
}

// list assistant files

export async function listAssistantFilesOpenAI(assistant_id: string) {
  try {
    const url = `https://api.openai.com/v1/assistants/${assistant_id}/files`;
    const response = await axios.get(url, {
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2",
      },
    });
    if (response.status >= 200 && response.status < 300) {
      return response?.data;
    } else {
      throw new Error(`Failed to create assistant. Status: ${response.status}`);
    }
  } catch (err) {
    console.log("Error retrieving assistant", err);
  }
}

//create assistant thread

export async function createAssistantThreadOpenAI(decription: string) {
  try {
    const url = `https://api.openai.com/v1/threads`;
    const response = await axios.post(
      url,
      {
        metadata: {
          description: decription,
        },
      },
      {
        headers: {
          ...authHeaders,
          "Content-Type": "application/json",
          "OpenAI-Beta": "assistants=v2",
        },
      }
    );
    // console.log(response, "api assistant response");
    if (response.status >= 200 && response.status < 300) {
      return response?.data;
    } else {
      throw new Error(`Failed to create thread. Status: ${response.status}`);
    }
  } catch (err) {
    console.log("Error creating thread", err);
  }
}

//create message

export async function createMessageOpenAi(
  thread_id: string,
  payload: ICreateMessage
) {
  try {
    const url = `https://api.openai.com/v1/threads/${thread_id}/messages`;
    const response = await axios.post(url, payload, {
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2",
      },
    });
    if (response.status >= 200 && response.status < 300) {
      return response?.data;
    } else {
      throw new Error(`Failed to create thread. Status: ${response.status}`);
    }
  } catch (err) {
    console.log("Error sending message", err);
  }
}

//list messages
export async function listMessagesOpenAI(thread_id: string) {
  try {
    const url = `https://api.openai.com/v1/threads/${thread_id}/messages?limit=100`;
    const response = await axios.get(url, {
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2",
      },
    });
    if (response.status >= 200 && response.status < 300) {
      return response?.data;
    } else {
      throw new Error(`Failed to load messages. Status: ${response.status}`);
    }
  } catch (err) {
    console.log("Error getting messages", err);
  }
}

//create a run

export async function createRunOpenAI(thread_id: string, payload: ICreateRun) {
  try {
    const url = `https://api.openai.com/v1/threads/${thread_id}/runs`;
    const response = await axios.post(url, payload, {
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2",
      },
    });
    if (response.status >= 200 && response.status < 300) {
      return response?.data;
    } else {
      throw new Error(`Failed to create thread. Status: ${response.status}`);
    }
  } catch (err) {
    console.log("Error creating run", err);
  }
}

//retrieve a run

export async function retrieveRunOpenAI(thread_id: string, run_id: string) {
  try {
    const url = `https://api.openai.com/v1/threads/${thread_id}/runs/${run_id}`;
    const response = await axios.get(url, {
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2",
      },
    });
    if (response.status >= 200 && response.status < 300) {
      return response?.data;
    } else {
      throw new Error(`Failed to create thread. Status: ${response.status}`);
    }
  } catch (err) {
    console.log("Error creating run", err);
  }
}

//cancel a run
export async function cancelRunOpenAI(thread_id: string, run_id: string) {
  try {
    const url = `https://api.openai.com/v1/threads/${thread_id}/runs/${run_id}/cancel`;
    const response = await axios.post(
      url,
      {},
      {
        headers: {
          ...authHeaders,
          "Content-Type": "application/json",
          "OpenAI-Beta": "assistants=v2",
        },
      }
    );
    if (response.status >= 200 && response.status < 300) {
      return response?.data;
    } else {
      throw new Error(`Failed to cancel run. Status: ${response.status}`);
    }
  } catch (err) {
    console.log("Error Canceling Run", err);
  }
}

//submit tools output

export async function submitToolsOutputOpenAI(
  thread_id: string,
  run_id: string,
  toolOutputs: ToolDetails[]
) {
  try {
    const url = `https://api.openai.com/v1/threads/${thread_id}/runs/${run_id}/submit_tool_outputs`;
    const payload = {
      tool_outputs: toolOutputs.map(({ tool_call_id, output }) => ({
        tool_call_id,
        output,
      })),
    };

    const response = await axios.post(url, payload, {
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2",
      },
    });
    if (response.status >= 200 && response.status < 300) {
      return response?.data;
    } else {
      throw new Error(`Failed to create thread. Status: ${response.status}`);
    }
  } catch (err) {
    console.log("Error submiting tools", err);
  }
}

//functions for openai specialised calls

export async function generateImageOpenAI(prompt: string) {
  const url = "https://api.openai.com/v1/images/generations";
  const requestPayload = {
    prompt,
    model: "dall-e-3",
    n: 1,
    response_format: "url",
    size: "1024x1024",
  };
  try {
    const response = await axios.post(url, requestPayload, {
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
      },
    });
    // console.log(response, "api response image generation");
    if (response?.data) {
      return response?.data?.data[0]?.url;
    } else {
      throw new Error(`Failed to create thread. Status: ${response.status}`);
    }
  } catch (err) {
    console.log(err);
  }
}

export async function chatCompletionOpenAI(prompt: string) {
  if (!prompt) return;
  const url = "https://api.openai.com/v1/chat/completions";
  const requestPayload = {
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant. Help the user with writing on the supplied",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  };
  try {
    const response: ChatCompletionResponse = await axios.post(
      url,
      requestPayload,
      {
        headers: {
          ...authHeaders,
          "Content-Type": "application/json",
        },
      }
    );

    if (
      response &&
      response?.data?.choices &&
      response?.data?.choices.length > 0
    ) {
      const messageContent = response?.data?.choices[0]?.message?.content;
      if (messageContent) {
        return messageContent;
      } else {
        console.log("Message content is undefined or null");
      }
    } else {
      console.log("Message content is undefined or null");
    }
  } catch (err) {
    console.log(err);
  }
}

// create vector store file batches

export async function createVectorStoreFileBatchesOpenAI(
  vector_store_id: string,
  file_ids: string[]
) {
  // console.log(vector_store_id, "vector_store_id");
  const url = `https://api.openai.com/v1/vector_stores/${vector_store_id}/file_batches`;

  const requestPayload = {
    file_ids,
  };
  try {
    const response: CreateVectorStoresFileBatchesResponse = await axios.post(
      url,
      requestPayload,
      {
        headers: {
          ...authHeaders,
          "Content-Type": "application/json",
          "OpenAI-Beta": "assistants=v2",
        },
      }
    );
    // console.log(response);
    return response;
  } catch (err) {
    console.log(err);
  }
}
//create vector store
export async function createVectorStoreOpenAI(fileIds: string[], name: string) {
  //arguments needed file ids, Property for name
  //create vector store
  const url = `https://api.openai.com/v1/vector_stores`;
  const requestPayload = {
    name,
  };

  try {
    const response: CreateVectorStoresResponse = await axios.post(
      url,
      requestPayload,
      {
        headers: {
          ...authHeaders,
          "Content-Type": "application/json",
          "OpenAI-Beta": "assistants=v2",
        },
      }
    );
    // console.log(response?.data);
    if (response?.data?.id) {
      const fileBatchUpload = await createVectorStoreFileBatchesOpenAI(
        response?.data?.id,
        fileIds
      );
      return fileBatchUpload;
    }
    return response;
  } catch (err) {
    console.log(err);
  }
}

export async function retrieveVectorStore(vector_id: string) {
  try {
    const url = `https://api.openai.com/v1/vector_stores/${vector_id}`;
    const response = await axios.get(url, {
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2",
      },
    });
    // console.log(response, "response");
    return response;
  } catch (err) {
    console.log(err);
  }
}
