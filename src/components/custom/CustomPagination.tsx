import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router";
import { cn } from "@/lib/utils";

interface Props {
  totalPage: number;
}

export const CustomPagination = ({ totalPage }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Obtener página actual de la URL
  const queryPage = searchParams.get('page') ?? '1';
  const currentPage = isNaN(+queryPage) ? 1 : +queryPage;

  const onPageChange = (page: number) => {
    if (page < 1 || page > totalPage) return;
    searchParams.set('page', page.toString());
    setSearchParams(searchParams);
  };

  // Lógica para decidir qué números mostrar
  const getPages = () => {
    const pages: (number | string)[] = [];
    if (totalPage <= 5) {
      return Array.from({ length: totalPage }, (_, i) => i + 1);
    }

    pages.push(1);
    if (currentPage > 3) pages.push("...");
    
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPage - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) pages.push(i);
    }

    if (currentPage < totalPage - 2) pages.push("...");
    if (totalPage > 1 && !pages.includes(totalPage)) pages.push(totalPage);

    return pages;
  };

  if (totalPage <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-2 mt-6">
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 border-slate-200"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-1">
        {getPages().map((p, i) => (
          p === "..." ? (
            <div key={`dots-${i}`} className="px-2 text-slate-400">
              <MoreHorizontal className="h-4 w-4" />
            </div>
          ) : (
            <Button
              key={p}
              variant={currentPage === p ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-9 w-9 p-0 font-medium transition-all",
                currentPage === p 
                  ? "bg-slate-900 text-white shadow-md" 
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
              onClick={() => onPageChange(p as number)}
            >
              {p}
            </Button>
          )
        ))}
      </div>

      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 border-slate-200"
        disabled={currentPage >= totalPage}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
};

// import { ChevronLeft, ChevronRight } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { useSearchParams } from "react-router";

// interface Props {
//     totalPage: number;
// }

// export const CustomPagination = ({totalPage}: Props) => {
     
//     const [searchParams, setSearchParams] = useSearchParams()
    
//     const queryPage = searchParams.get('products') ?? '1';
//     const page = isNaN(+queryPage) ? 1 : +queryPage;
    
//     const handlePageChange = (page: number) => {
//       if (page < 1 || page > totalPage) return;

//       searchParams.set('page', page.toString());

//       setSearchParams(searchParams);
//     }

//     return (
//     <>
//        <div className="flex items-center justify-center space-x-2">
//           <Button variant="outline" size="sm" disabled={page === 1}
//            onClick={() => handlePageChange(page - 1)}
//           >
//             <ChevronLeft className="h-4 w-4" />
//             Anterior
//           </Button>

//          {Array.from({length: totalPage}).map((_, index) => (
//          <Button 
//             key={index} 
//             variant={page === index + 1 ? 'default' : 'outline'}
//             size="sm"
//             onClick={() => handlePageChange(index + 1)}
//             >
//             {index + 1}
//           </Button>
//          ))}

//           <Button variant="outline" size="sm" disabled={page === totalPage}
//           onClick={() => handlePageChange(page + 1)}
//           >
//             Siguiente 
//             <ChevronRight className="h-4 w-4" />
//           </Button>
//         </div>
//     </>
//   )
// }