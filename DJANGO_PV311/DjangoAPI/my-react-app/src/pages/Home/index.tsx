import * as React from "react";
import {useGetAllCategoriesQuery} from "../../services/apiCategory.ts";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import LoadingOverlay from "../../components/ui/loading/LoadingOverlay.tsx";

const HomePage: React.FC = () => {

    const {data: list, isLoading, error} = useGetAllCategoriesQuery();

    if (error) return "<span>У нас проблеми хюстон</span>";
    return (
        <>
            <header className="bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Категорії</h1>
                </div>
            </header>

            {isLoading && <LoadingOverlay />}

            {/*<div className="relative overflow-x-auto shadow-md sm:rounded-lg">*/}

                <Table>
                    <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                        <TableRow>
                            <TableCell isHeader className="py-3 text-start">Назва</TableCell>
                            <TableCell isHeader className="py-3 text-start">Фото</TableCell>
                            <TableCell isHeader className="py-3 text-start">Слаг</TableCell>
                            <TableCell isHeader className="py-3 text-start">Опис</TableCell>
                        </TableRow>
                    </TableHeader>


                    <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {list?.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell className="py-3 font-medium text-gray-800 dark:text-white/90">
                                    {category.name}
                                </TableCell>

                                <TableCell className="py-3 text-gray-500 dark:text-gray-400">
                                    <img src={category.image} alt="" width={75}/>
                                </TableCell>

                                <TableCell className="py-3 text-gray-500 dark:text-gray-400">
                                    {category.slug}
                                </TableCell>

                                <TableCell className="py-3">
                                    {category.description}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>


        </>
    )
}

export default HomePage;