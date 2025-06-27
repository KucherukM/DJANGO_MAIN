import {createApi} from "@reduxjs/toolkit/query/react";
import type {ICategoryCreate, ICategoryItem} from "./types.ts";
import {createBaseQuery} from "../utils/createBaseQuery.ts";

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
                    const formData = new FormData();
                    formData.append('name', newCategory.name);
                    formData.append('slug', newCategory.slug);
                    formData.append('description', newCategory.description);
                    
                    if (newCategory.image) {
                        formData.append('image', newCategory.image);
                    }
                    
                    return {
                        url: '/',
                        method: 'POST',
                        body: formData
                    }
                }
                catch (error) {
                    console.error('Error creating FormData:', error);
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