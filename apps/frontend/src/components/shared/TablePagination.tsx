import { Button } from "@/components/ui/button";

interface TablePaginationProps {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function TablePagination({
  page,
  totalPages,
  onPrev,
  onNext,
}: TablePaginationProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 text-sm border-t border-gray-100 bg-gray-50/50">
      <span className="text-gray-500">
        Página {page} de {totalPages || 1}
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={onPrev}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={onNext}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
