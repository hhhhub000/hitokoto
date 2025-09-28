import React from 'react';
import Button from '../common/Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}) => {
  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // 最初のページ
    if (startPage > 1) {
      pages.push(
        <Button
          key={1}
          size="sm"
          variant={1 === currentPage ? 'primary' : 'outline'}
          onClick={() => onPageChange(1)}
          disabled={isLoading}
        >
          1
        </Button>
      );
      
      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="px-2 text-gray-500">
            ...
          </span>
        );
      }
    }

    // 中間のページ番号
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          size="sm"
          variant={i === currentPage ? 'primary' : 'outline'}
          onClick={() => onPageChange(i)}
          disabled={isLoading}
        >
          {i}
        </Button>
      );
    }

    // 最後のページ
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="px-2 text-gray-500">
            ...
          </span>
        );
      }
      
      pages.push(
        <Button
          key={totalPages}
          size="sm"
          variant={totalPages === currentPage ? 'primary' : 'outline'}
          onClick={() => onPageChange(totalPages)}
          disabled={isLoading}
        >
          {totalPages}
        </Button>
      );
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      <Button
        size="sm"
        variant="outline"
        onClick={handlePrevious}
        disabled={currentPage <= 1 || isLoading}
      >
        前へ
      </Button>

      <div className="flex items-center space-x-1">
        {renderPageNumbers()}
      </div>

      <Button
        size="sm"
        variant="outline"
        onClick={handleNext}
        disabled={currentPage >= totalPages || isLoading}
      >
        次へ
      </Button>
    </div>
  );
};

export default Pagination;