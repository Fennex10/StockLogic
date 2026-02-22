import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "react-router";

interface Props {
    totalPage: number;
}

export const CustomPagination = ({totalPage}: Props) => {
     
    const [searchParams, setSearchParams] = useSearchParams()
    
    const queryPage = searchParams.get('page') ?? '1';
    const page = isNaN(+queryPage) ? 1 : +queryPage;
    
    const handlePageChange = (page: number) => {
      if (page < 1 || page > totalPage) return;

      searchParams.set('page', page.toString());

      setSearchParams(searchParams);
    }

    return (
    <>
       <div className="flex items-center justify-center space-x-2">
          <Button variant="outline" size="sm" disabled={page === 1}
           onClick={() => handlePageChange(page - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

         {Array.from({length: totalPage}).map((_, index) => (
         <Button 
            key={index} 
            variant={page === index + 1 ? 'default' : 'outline'}
            size="sm"
            onClick={() => handlePageChange(index + 1)}
            >
            {index + 1}
          </Button>
         ))}

          <Button variant="outline" size="sm" disabled={page === totalPage}
          onClick={() => handlePageChange(page + 1)}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
    </>
  )
}