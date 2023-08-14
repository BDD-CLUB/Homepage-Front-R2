import axios from 'axios';
import { useQuery, useMutation } from 'react-query';
import { BookInfo } from './dto';

const libraryKeys = {
  bookListContent: 'bookList',
};

interface getBookListProps {
  searchType?: 'title' | 'author' | 'all';
  search?: string;
  page?: number;
  size?: number;
}

const useGetBookListQuery = (param: getBookListProps) => {
  const fetcher = () =>
    axios.get('/books', { params: { ...param } }).then(({ data }) => {
      data.content.filter(({ currentQuantity, totalQuantity, ...rest }: BookInfo) => ({
        ...rest,
        bookQuantity: `${currentQuantity}/${totalQuantity}`,
      }));
      return { content: data.content, totalElement: data.totalElements };
    });

  return useQuery<{ content: BookInfo[]; totalElement: number }>([libraryKeys.bookListContent, param], () => fetcher());
};

const useRequestBorrowBookMutation = () => {
  const fetcher = (selectedBookId: number) => axios.post(`/books/${selectedBookId}/request-borrow`);

  return useMutation(fetcher);
};

export { useGetBookListQuery, useRequestBorrowBookMutation };
