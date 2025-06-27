export interface ICategoryItem {
    id: number;
    name: string;
    slug: string;
    image: string;
    description: string;
}

export interface ICategoryCreate {
    name: string;
    slug: string;
    description: string;
    image: File;
}