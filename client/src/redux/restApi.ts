// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Player } from "../../../lib";

const baseUrl = import.meta.env.DEV ? `http://localhost:3001/api/v1/` : `${window.location.host}/api/v1/`;

// Define a service using a base URL and expected endpoints
export const RestApi = createApi({
  reducerPath: "RestApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["Players"],
  endpoints: (builder) => ({
    getPlayersInRoom: builder.query<Player[], string>({
      query: (roomId: string) => {
        return `room/${roomId}/players`;
      },
      providesTags: (result, error, roomId: string) => [{ type: "Players", roomId }],
    }),
  }),
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const { useGetPlayersInRoomQuery, useLazyGetPlayersInRoomQuery } = RestApi;
