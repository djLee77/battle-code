import RecordCard from 'components/user/RecordCard';
import { useInfiniteQuery } from 'react-query';
import api from 'utils/axios';
import styles from 'styles/my-page/user.module.css';
import InfiniteScroll from 'react-infinite-scroller';

interface IMatchUsers {
  user: string;
  result: string;
}

interface IMatchResults {
  matchId: number;
  language: string;
  result: string;
  problemLevel: string;
  elapsedTime: string;
  date: string;
  usersResult: IMatchUsers[];
}
// 1페이지에 담을 데이터 양
const SIZE = 10;

const fetchPage = async (pageParam: number, userId: string | null) => {
  const response = await api.get(
    `v1/recodes/${userId}?pageNo=${pageParam}&size=${SIZE}`
  );

  return response.data.data;
};

const MyPage = () => {
  const userId = localStorage.getItem('id');
  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery<any>(
    ['recodes', userId], // queryKey에 userId 포함
    ({ pageParam = 1 }) => fetchPage(pageParam, userId),
    {
      getNextPageParam: (lastPage) => {
        return lastPage.currentPage !== lastPage.totalPage
          ? lastPage.currentPage + 1
          : undefined;
      },
      enabled: !!userId, // userId가 있을 때만 쿼리 실행
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
              <div className={styles.loader}>
                <div className={styles.spinner}></div>
              </div>
            }
            useWindow={false}
          >
            {data?.pages.map((page: any, index: any) => (
              <div key={index}>
                {page.matchRecodeList.map((record: IMatchResults) => (
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
