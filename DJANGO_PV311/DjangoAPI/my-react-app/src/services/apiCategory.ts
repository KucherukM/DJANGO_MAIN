import {createApi} from "@reduxjs/toolkit/query/react";
import type {ICategoryCreate, ICategoryItem} from "./types.ts";
import {createBaseQuery} from "../utils/createBaseQuery.ts";
import {serialize} from "object-to-formdata";

export const apiCategory = createApi({
    reducerPath: "api",
    baseQuery: createBaseQuery('categories'),
    tagTypes: ['Categories'],
    endpoints: (builder) => ({
        getAllCategories: builder.query<ICategoryItem[], void>({
            query: () => '',
            providesTags: ['Categories'],
        }),
        createCategory: builder.mutation<ICategoryItem, ICategoryCreate>({
            query: (newCategory) => {
                try {
                    const formData = serialize(newCategory);
                    return {
                        url: '/',
                        method: 'POST',
                        body: formData
                    }
                }
                catch {
                    throw new Error('Error create category');
                }
            },
            invalidatesTags: ['Categories'],
        }),
    })
});

export const {
    useGetAllCategoriesQuery,
    useCreateCategoryMutation
} = apiCategory;