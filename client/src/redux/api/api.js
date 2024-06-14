import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../../../server/constants/configure";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: `${server}/api/v1/` }),
  tagTypes: ["Chat", "User"],
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
      providesTags: ["Chat"],
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
} = api;
