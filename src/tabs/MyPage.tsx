import RecordCard from 'components/user/RecordCard';
import { useInfiniteQuery, useQuery } from 'react-query';
import api from 'utils/axios';
import styles from 'styles/my-page/user.module.css';
import InfiniteScroll from 'react-infinite-scroller';
import CircleProgress from 'components/user/CircleProgress';

interface IMatchUsers {
  user: string;
  result: string;
}

interface IMatchHistory {
  matchId: number;
  language: string;
  result: string;
  problemLevel: string;
  elapsedTime: string;
  date: string;
  usersResult: IMatchUsers[];
}

// 1페이지에 담을 데이터  양
const SIZE = 10;

const fetchMatchHistory = async (pageParam: number, userId: string | null) => {
  const response = await api.get(
    `v1/recodes/${userId}?pageNo=${pageParam}&size=${SIZE}`
  );

  return response.data.data;
};

const fetchOverAlls = async (userId: string | null) => {
  const response = await api.get(`v1/recodes/${userId}/overalls`);

  return response.data.data;
};

const MyPage = () => {
  const userId = localStorage.getItem('id');
  const {
    data: matchHistory,
    fetchNextPage,
    hasNextPage,
    isLoading: matchHistoryIsLoading,
  } = useInfiniteQuery<any>(
    ['matchHistory', userId], // queryKey에 userId 포함
    ({ pageParam = 0 }) => fetchMatchHistory(pageParam, userId),
    {
      getNextPageParam: (lastPage) => {
        return lastPage.currentPage !== lastPage.totalPage
          ? lastPage.currentPage + 1
          : undefined;
      },
      enabled: !!userId, // userId가 있을 때만 쿼리 실행
      cacheTime: 600000, // 10분
      staleTime: 60000, // 1분
    }
  );

  const { data: overAlls, isLoading } = useQuery(
    ['overAlls', userId],
    () => fetchOverAlls(userId),
    {
      enabled: !!userId, // userId가 있을 때만 쿼리 실행
      cacheTime: 600000, // 10분
      staleTime: 60000, // 1분
    }
  );

  if (matchHistoryIsLoading) return <div className="loading">Loading...</div>;
  if (isLoading) return <div className="loading">Loading...</div>;

  console.log(matchHistory);

  return (
    <div className={styles[`user-container`]}>
      <div className={styles[`user-info`]}>
        <h2>{userId}</h2>
      </div>
      <div className={styles[`record-container`]}>
        <div className={styles[`circle-box`]}>
          <h4>
            {overAlls.total}전 {overAlls.win}승 {overAlls.draw}무{' '}
            {overAlls.lose}패
          </h4>
          <CircleProgress
            win={overAlls.win}
            draw={overAlls.draw}
            lose={overAlls.lose}
            total={overAlls.total}
            size={300}
            strokeWidth={40}
            winColor="#3278FF"
            drawColor="#555555"
            loseColor="#FF5F58"
          />
        </div>
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
            {matchHistory?.pages.map((page: any, index: any) => (
              <div key={index}>
                {page.matchRecodeList.map((record: IMatchHistory) => (
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
