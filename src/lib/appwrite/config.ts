import { Client, Account, Databases, Storage, Avatars } from "appwrite";

export const appwriteConfig = {
  url: import.meta.env.VITE_APPWRITE_URL,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
  userCollectionId: import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID,
  filesCollectionId: import.meta.env.VITE_APPWRITE_FILES_COLLECTION_ID,
  agentCollectionId: import.meta.env.VITE_APPWRITE_AGENTS_COLLECTION_ID,
  threadCollectionId: import.meta.env.VITE_APPWRITE_THREADS_COLLECTION_ID,
  userSubscriptionCollectionId: import.meta.env
    .VITE_APPWRITE_USER_SUBSCRIPTION_COLLECTION_ID,
  userVectorStoresCollectionId: import.meta.env
    .VITE_APPWRITE_USER_VECTOR_STORES_DETAILS,
};

export const client = new Client();

client.setEndpoint(appwriteConfig.url);
client.setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
