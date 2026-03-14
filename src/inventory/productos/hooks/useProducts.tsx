import { useQuery } from "@tanstack/react-query"
import { getProductAction } from "@/inventory/productos/action/get-products-action"
import { useSearchParams } from "react-router";

export const useProducts = () => {
    
    const [searchParams] = useSearchParams();

    const limit = searchParams.get('limit') || 9;
    const page = searchParams.get('page') || 1;
    const query = searchParams.get('query') || undefined;

    const offset = (Number(page) - 1) * Number(limit);

    const price = searchParams.get('price') || 'any';
    let minPrice = undefined;
    let maxPrice = undefined;

    switch (price) {
        case 'any':
        //
        break;
        case '0-50':
        minPrice = 0;
        maxPrice = 50;
        break;

        case '50-100':
        minPrice = 50;
        maxPrice = 100;
        break;

        case '100-200':
        minPrice = 100;
        maxPrice = 200;
        break;

        case '200+':
        minPrice = 200;
        maxPrice = undefined;
        break;
    }

    return useQuery({
    queryKey: ['products', {offset, limit, minPrice, maxPrice, query}],
    queryFn: () => getProductAction({
        limit: isNaN(+limit) ? 9 : limit,
        offset: isNaN(offset) ? 0 : offset,
        minPrice,
        maxPrice,
        query
    }),
    staleTime: 1000 * 60 * 5,
  })
}
