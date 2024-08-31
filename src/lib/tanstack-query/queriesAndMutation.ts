import {
  IAssistant,
  ICreateUserVectorStores,
  IFile,
  INewUser,
  ISavedAssistant,
  IUpdateSubscription,
  IUserSubscription,
  Ithread,
} from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createUserAccount,
  createUserSubcription,
  createUserVectorStore,
  deleteAssistantInDB,
  deleteUserFiles,
  getAssistantThreads,
  getUserAssistants,
  getUserFiles,
  getUserSubcriptionStatus,
  getUserVectoreStoresDetails,
  saveAssistantToDB,
  saveFileToDB,
  saveThreadToDB,
  signInAccount,
  signOutAccount,
  updateAssistantInDB,
  updateUserSubscriptionDetails,
} from "../appwrite/api";
import { QUERY_KEYS } from "./queryKeys";
import { listMessagesOpenAI } from "../openAI/api";
import { getFlutterwavePaymentPlans } from "../flutterwave/client";

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user), 
  });
};

export const useSaveFileToDB = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: IFile) => saveFileToDB(file),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_FILES],
      }),
  });
};

export const useSaveThreadToDB = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (thread: Ithread) => saveThreadToDB(thread),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ASSISTANT_THREADS],
      }),
  });
};

export const useSaveAssistantToDB = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (assistant: IAssistant) => saveAssistantToDB(assistant),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ASSISTANTS_FOR_USER],
      }),
  });
};

export const useUpdateAssistantToDB = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (assistant: ISavedAssistant) => updateAssistantInDB(assistant),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ASSISTANTS_FOR_USER],
      }),
  });
};

export const useDeleteAssistantInDB = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (assistant_id: string) => deleteAssistantInDB(assistant_id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ASSISTANTS_FOR_USER],
      }),
  });
};

export const useDeleteUserFiles = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fileId: string) => deleteUserFiles(fileId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_FILES],
      }),
  });
};

export const useGetUserFiles = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_FILES, userId],
    queryFn: () => getUserFiles(userId),
    enabled: !!userId,
  });
};

export const useGetAssistantThreads = (assistant_id?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ASSISTANT_THREADS, assistant_id],
    queryFn: () => getAssistantThreads(assistant_id!),
    enabled: !!assistant_id,
  });
};

export const useGetUserAssistants = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ASSISTANTS_FOR_USER, userId],
    queryFn: () => getUserAssistants(userId),
    enabled: !!userId,
  });
};

//write the queries and query keys for listing messsages
export const useLoadMessgaeOpenAI = (thread_id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.LOAD_OPENAI_MESSAGES, thread_id],
    queryFn: () => listMessagesOpenAI(thread_id),
    enabled: !!thread_id,
  });
};

// get payment plans from flutterwave
export const useGetFlutterwavePaymentPlans = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_FLUTTERWAVE_PLANS],
    queryFn: () => getFlutterwavePaymentPlans(),
  });
};

// create user subscription
export const useCreateUserSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IUserSubscription) => createUserSubcription(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ASSISTANTS_FOR_USER],
      }),
  });
};

export const useGetUserSubscriptionDetails = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_SUBSCRIPTION_DETAILS, userId],
    queryFn: () => getUserSubcriptionStatus(userId!),
    enabled: !!userId,
  });
};

export const useUpdateUserSubscriptionDetails = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IUpdateSubscription) =>
      updateUserSubscriptionDetails(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_SUBSCRIPTION_DETAILS],
      }),
  });
};

// export const useDeleteSubscription = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (id: string) => deleteUserSubciptionStatus(id!),
//     onSuccess: () =>
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_USER_SUBSCRIPTION_DETAILS],
//       }),
//   });
// };

export const useCreateUserVectorStores = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICreateUserVectorStores) =>
      createUserVectorStore(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_FILES],
      }),
  });
};

export const useGetUserVectorStoreDetails = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_VECTOR_STORE_DETAILS, userId],
    queryFn: () => getUserVectoreStoresDetails(userId!),
    enabled: !!userId,
  });
};

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: () => signOutAccount(),
  });
};
