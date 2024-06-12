import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../../../server/constants/configure";

const api = createApi({
    reducerPath:"api",
    baseQuery:fetchBaseQuery({baseUrl:`${server}/api/v1/`}),
    tagTypes:["Chat"],
    endpoints:(builder)=>({
        myChats : builder.query({
            query:()=>({
                url:"chat/my",
                credentials:"include"
            }),
            providesTags:["Chat"],
            invalidatesTags:["Chat"]
        })
    })
});

export default api;
export const {useMyChatsQuery} = api