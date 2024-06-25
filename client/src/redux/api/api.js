import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/configure";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: `${server}/api/v1/` }),
  tagTypes: ["Chat", "User", "Message"],
  endpoints: (builder) => ({
    myChats: builder.query({
      query: () => ({
        url: "chat/my",
        credentials: "include",
      }),
      providesTags: ["Chat"],
    }),

    searchUser: builder.query({
      query: (name) => ({
        url: `user/search?name=${name}`,
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    getNotification: builder.query({
      query: () => ({
        url: `user/getnotifications`,
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),

    getMessages: builder.query({
      query: ({ chatId, page }) => ({
        url: `chat/message/${chatId}?page=${page}`,
        credentials: "include",
      }),
      keepUnusedDataFor:0,
    }),

    sendFriendRequest: builder.mutation({
      query: (data) => ({
        url: `user/sendrequest`,
        credentials: "include",
        body: data,
        method: "PUT",
      }),
    }),
    acceptFriendRequest: builder.mutation({
      query: (data) => ({
        url: `user/acceptrequest`,
        credentials: "include",
        body: data,
        method: "PUT",
      }),
    }),
    chatDetails: builder.query({
      query: ({ chatId, populate = false }) => {
        let url = `chat/${chatId}`;
        if (populate) url += `?populate=true`;
        return {
          url: url,
          credentials: "include",
        };
      },
      providesTags: ["Chat"],
    }),
    sendAttachments: builder.mutation({
      query: (data) => ({
        url: `chat/message`,
        credentials: "include",
        body: data,
        method: "POST",
      }),
    }),
  }),
});

export default api;
export const {
  useMyChatsQuery,
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
  useGetNotificationQuery,
  useAcceptFriendRequestMutation,
  useChatDetailsQuery,
  useSendAttachmentsMutation,
  useGetMessagesQuery,
} = api;
