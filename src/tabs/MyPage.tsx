import RecordCard from 'components/user/RecordCard';
import { useInfiniteQuery } from 'react-query';
import api from 'utils/axios';
import styles from 'styles/my-page/user.module.css';
import { useMemo } from 'react';
import CircleProgress from 'components/user/CircleProgress';
import { Typography } from '@mui/material';

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

const fetchPage = async ({ pageParam = 0 }) => {
  const userId = localStorage.getItem('id');
  const response = await api.get(
    `v1/recodes/${userId}?pageNo=${pageParam}&size=${SIZE}`
  );
  return response.data;
};

const MyPage = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery<any>('recodes', fetchPage, {
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined;
    },

    cacheTime: 1000 * 60 * 10, // 10분 동안 캐시에 유지
    staleTime: 1000 * 60 * 1, // 1분 동안 신선하게 유지
  });

  const userId = localStorage.getItem('id');

  // 스크롤 이벤트 핸들러
  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const { scrollHeight, scrollTop, clientHeight } = e.currentTarget;
    if (
      scrollHeight - scrollTop <= clientHeight * 1.5 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading data</div>;
  }

  console.log(data);

  return (
    <div className={styles[`user-container`]}>
      <div className={styles[`user-info`]}>
        <h2>{userId}</h2>
      </div>
      <div className={styles[`record-container`]}>
        <div className={styles[`circle-box`]}>
          {/* <h4>
            {userTestData.battleRecordList.length}전 {winCount}승 {drawCount}무{' '}
            {lossCount}패
          </h4>
          <CircleProgress
            progress={(winCount / userTestData.battleRecordList.length) * 100}
            size={300}
            strokeWidth={40}
            circleColor="#FF5F58"
            progressColor="#3278FF"
          /> */}
        </div>
        <div
          className={styles[`record-box`]}
          onScroll={handleScroll}
          style={{ height: '80vh', overflowY: 'auto' }}
        >
          {data?.pages.map((page, index) => (
            <div key={index}>
              {page.data.map((record: UserTestData) => (
                <RecordCard key={record.matchId} record={record} />
              ))}
            </div>
          ))}
          {isFetchingNextPage && <div>Loading more...</div>}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
