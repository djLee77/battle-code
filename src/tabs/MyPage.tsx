import RecordCard from 'components/user/RecordCard';
import { useInfiniteQuery } from 'react-query';
import api from 'utils/axios';
import styles from 'styles/my-page/user.module.css';
import InfiniteScroll from 'react-infinite-scroller';

interface UsersResult {
  user: string;
  result: string;
}

interface UserTestData {
  matchId: number;
  language: string;
  result: string;
  problemLevel: string;
  elapsedTime: string;
  date: string;
  usersResult: UsersResult[];
}

const SIZE = 10;
const fetchPage = async (pageParam: number, userId: string | null) => {
  if (userId) {
    const response = await api.get(
      `v1/recodes/${userId}?pageNo=${pageParam}&size=${SIZE}`
    );

    return response.data.data;
  }
};

const MyPage = () => {
  const userId = localStorage.getItem('id');
  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery<any>(
    ['recodes', userId], // queryKey에 userId 포함
    ({ pageParam = 1 }) => fetchPage(pageParam, userId),
    {
      getNextPageParam: (lastPage) => {
        // lastPage의 데이터 개수를 기반으로 다음 페이지 존재 여부 확인
        console.log(lastPage);
        return lastPage.currentPage !== lastPage.totalPage
          ? lastPage.currentPage + 1
          : undefined;
      },
      cacheTime: 600000, // 10분
      staleTime: 1000, // 10초
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <div className={styles[`user-container`]}>
      <div className={styles[`user-info`]}>
        <h2>{userId}</h2>
      </div>
      <div className={styles[`record-container`]}>
        <div className={styles[`circle-box`]}></div>
        <div
          className={styles[`record-box`]}
          style={{ height: '80vh', overflowY: 'auto' }}
        >
          <InfiniteScroll
            loadMore={() => fetchNextPage()}
            hasMore={hasNextPage}
            loader={
              <div className="loader" key={0}>
                Loading ...
              </div>
            }
            useWindow={false}
          >
            {data?.pages.map((page: any, index: any) => (
              <div key={index}>
                {page.matchRecodeList.map((record: UserTestData) => (
                  <RecordCard key={record.matchId} record={record} />
                ))}
              </div>
            ))}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
