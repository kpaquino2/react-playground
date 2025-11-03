import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationEllipsis,
  PaginationButton,
  PaginationNext,
} from "../ui/pagination";

interface ComponentsPaginationProps {
  page: number;
  limit: number;
  count: number;
  setPage: (p: number) => void;
}

export function ComponentsPagination({
  page,
  limit,
  count,
  setPage,
}: ComponentsPaginationProps) {
  const isFirstPage = page - 1 === 0;
  const isLastPage = page >= count / limit;
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            disabled={isFirstPage}
            onClick={() => setPage(page - 1)}
          />
        </PaginationItem>
        {page - 2 > 0 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {!isFirstPage && (
          <PaginationItem>
            <PaginationButton onClick={() => setPage(page - 1)}>
              {page - 1}
            </PaginationButton>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationButton isActive>{page}</PaginationButton>
        </PaginationItem>
        {!isLastPage && (
          <PaginationItem>
            <PaginationButton onClick={() => setPage(page + 1)}>
              {page + 1}
            </PaginationButton>
          </PaginationItem>
        )}
        {page + 2 <= Math.ceil(count / limit) && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            disabled={isLastPage}
            onClick={() => setPage(page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
