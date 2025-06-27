import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "../utils/createBaseQuery";

interface IAuthResponse {
  access: string;
  refresh: string;
}

interface IUser {
  id: number;
  username: string;
  photo?: string;
  phone?: string;
}

interface IUpdateUserData {
  username: string;
  phone: string;
  photo?: File;
}

export const apiAuth = createApi({
  reducerPath: "apiAuth",
  baseQuery: createBaseQuery(""),
  endpoints: (builder) => ({
    login: builder.mutation<IAuthResponse, { username: string; password: string }>({
      query: (body) => ({
        url: "token/",
        method: "POST",
        body,
      }),
    }),
    refreshToken: builder.mutation<{ access: string }, { refresh: string }>({
      query: (body) => ({
        url: "token/refresh/",
        method: "POST",
        body,
      }),
    }),
    register: builder.mutation<IUser, FormData>({
      query: (formData) => ({
        url: "register/",
        method: "POST",
        body: formData,
      }),
    }),
    getUser: builder.query<IUser, void>({
      query: () => ({
        url: "user/",
        method: "GET",
      }),
    }),
    updateUser: builder.mutation<IUser, IUpdateUserData>({
      query: (data) => {
        if (data.photo) {
          const formData = new FormData();
          formData.append('username', data.username);
          formData.append('phone', data.phone);
          formData.append('photo', data.photo);
          
          return {
            url: "user/",
            method: "PATCH",
            body: formData,
          };
        } else {
          return {
            url: "user/",
            method: "PATCH",
            body: {
              username: data.username,
              phone: data.phone,
            },
          };
        }
      },
    }),
    testAuth: builder.query<any, void>({
      query: () => ({
        url: "test-auth/",
        method: "GET",
      }),
    }),
  }),
});

export const { useLoginMutation, useRefreshTokenMutation, useRegisterMutation, useGetUserQuery, useUpdateUserMutation, useTestAuthQuery } = apiAuth; 