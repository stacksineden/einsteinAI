import { ID, Query } from "appwrite";
import { account, appwriteConfig, avatars, databases } from "./config";

import {
  IAssistant,
  IFile,
  INewUser,
  ISavedAssistant,
  IUserSubscription,
  Ithread,
} from "@/types";

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );
    if (!newAccount) throw Error;
    //create session to verify user
    const session = await account.createEmailSession(user.email, user.password);

    if (session) {
      const verifyUser = await account.createVerification(
        "http://localhost:5173/verify-user"
      );
      if (verifyUser) {
        const avatarUrl = avatars.getInitials(user.name);
        const newUser = await saveUserToDB({
          accountId: newAccount.$id,
          email: newAccount.email,
          name: newAccount.name,
          imageUrl: avatarUrl,
        });
        return newUser;
      }
      if (!verifyUser) {
        console.log("error sending email");
      }
    }
  } catch (err) {
    console.log(err, "");
  }
}

export async function updateUserVerification(userId: string, secret: string) {
  try {
    const verifiedAccount = await account.updateVerification(userId, secret);
    if (verifiedAccount) {
      return verifiedAccount;
    } else {
      console.log("verification failed");
    }
  } catch (err) {
    console.log(err, "");
  }
}

export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
}) {
  const newUser = await databases.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    ID.unique(),
    user
  );
  return newUser;
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password);
    return session;
  } catch (err) {
    console.log(err);
  }
}

export async function forgotPassword(email: string) {
  try {
    const response = await account.createRecovery(
      email,
      "http://localhost:5173/reset-password"
    );
    if (response) {
      return response;
    } else {
      console.log("reset password failed");
    }
  } catch (err) {
    console.log(err);
  }
}

export async function resetPassword(
  userId: string,
  secret: string,
  new_password: string,
  confirm_password: string
) {
  try {
    const response = await account.updateRecovery(
      userId,
      secret,
      new_password,
      confirm_password
    );
    if (response) {
      return response;
    } else {
      console.log("reset password failed");
    }
  } catch (err) {}
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    const userObject = {
      currentUser: currentUser.documents[0],
      currentAccount,
    };
    return userObject;
  } catch (err) {
    console.log(err, "here it is");
  }
}

export async function saveFileToDB(file: IFile) {
  try {
    const newFile = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      ID.unique(),
      {
        creator: file?.userId,
        fileId: file?.fileId,
        fileName: file?.fileName,
        fileSize: file?.fileSize,
        dateUploaded: file?.dateUploaded,
      }
    );

    if (!newFile) throw Error;
    //also i want to delete the file from open ai DB

    return newFile;
  } catch (err) {
    console.log(err);
  }
}

export async function saveAssistantToDB(assistant: IAssistant) {
  try {
    const newAssistant = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.agentCollectionId,
      ID.unique(),
      {
        //i mean user id
        users: assistant.id,
        assistant_id: assistant.assistant_id,
        instructions: assistant.instructions,
        assistant_pretraining_name: assistant.assistant_pretraining_name,
        name: assistant.name,
        role: assistant.role,
      }
    );

    if (!newAssistant) throw new Error();
    return newAssistant;
  } catch (err) {}
}

export async function updateAssistantInDB(assistant: ISavedAssistant) {
  try {
    const updatedAssistant = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.agentCollectionId,
      assistant?.id,
      {
        instructions: assistant.instructions,
        name: assistant.name,
      }
    );

    if (!updatedAssistant) throw new Error();
    return updatedAssistant;
  } catch (err) {
    // Handle errors here
    console.error("Error updating assistant:", err);
    throw err; // You might want to handle or log the error based on your application's requirements
  }
}

export async function deleteAssistantInDB(assistant_id: string) {
  try {
    const deletedAssistant = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.agentCollectionId,
      assistant_id
    );
    if (!deletedAssistant) throw Error;
    return deletedAssistant;
  } catch (err) {
    console.error("Error deleting assistant:", err);
    throw err;
  }
}

export async function deleteUserFiles(fileId: string) {
  //write logic to delete files
  try {
    const deletedFile = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId
    );
    if (!deletedFile) throw Error;
    return deletedFile;
  } catch (err) {
    console.log(err);
  }
}

export async function getUserFiles(userId?: string) {
  if (!userId) return;

  const files = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.filesCollectionId,
    [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
  );
  if (!files) throw new Error();
  return files;
}

export async function getUserAssistants(userId?: string) {
  if (!userId) return;
  const assistants = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.agentCollectionId,
    [Query.equal("users", userId), Query.orderDesc("$createdAt")]
  );
  if (!assistants) throw new Error();
  return assistants;
}

export async function saveThreadToDB(thread: Ithread) {
  try {
    const newThread = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.threadCollectionId,
      ID.unique(),
      {
        description: thread.description,
        thread_id: thread.thread_id,
        assistant_id: thread.assistant_id,
      }
    );
    if (!newThread) throw Error;
    return newThread;
  } catch (err) {
    console.log(err);
  }
}

export async function getAssistantThreads(assistant_id: string) {
  if (!assistant_id) return;
  const threads = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.threadCollectionId,
    [Query.equal("assistant_id", assistant_id), Query.orderDesc("$createdAt")]
  );
  if (!threads) throw new Error();
  return threads;
}

//user subcriptions

//create user subcription status
export async function createUserSubcription(payload: IUserSubscription) {
  if (!payload) return;
  try {
    const userSubscription = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userSubscriptionCollectionId,
      ID.unique(),
      {
        user_id: payload?.user_id,
        is_subscribed: payload?.is_subscribed,
        amount: payload?.amount,
        currency: payload?.currency,
        subscription_start_date: payload?.subscription_start_date,
        user_email: payload?.user_email,
        transaction_id: payload?.transaction_id,
        tx_ref: payload?.tx_ref,
      }
    );
    if (!userSubscription) throw new Error("Failed to add User Subscription");
    return userSubscription;
  } catch (err) {
    console.log(err);
  }
}

//get user subscription status
export async function getUserSubcriptionStatus(user_id: string) {
  if (!user_id) return;
  const userSubscriptionDetails = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.userSubscriptionCollectionId,
    [Query.equal("user_id", user_id), Query.orderDesc("$createdAt")]
  );
  if (!userSubscriptionDetails)
    throw new Error("No User Subscription Details Found");
  return userSubscriptionDetails;
}

//update user subcritption

export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    console.log(error);
  }
}
