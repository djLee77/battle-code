import React, { useState } from 'react';
import RecordCard from 'components/user/RecordCard';
import { useInfiniteQuery, useQuery } from 'react-query';
import api from 'utils/axios';
import styles from 'styles/my-page/user.module.css';
import InfiniteScroll from 'react-infinite-scroller';
import CircleProgress from 'components/user/CircleProgress';
import InputField from 'components/ui/InputField';
import { useForm } from 'react-hook-form';

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

// 데이터 크기 설정
const SIZE = 10;

const fetchMatchHistory = async (pageParam: number, userId: string | null) => {
  try {
    const response = await api.get(
      `v1/recodes/${userId}?pageNo=${pageParam}&size=${SIZE}`
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        `Error ${error.response.status}: ${error.response.data.message}`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

const fetchOverAlls = async (userId: string | null) => {
  try {
    const response = await api.get(`v1/recodes/${userId}/overalls`);
    return response.data.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        `Error ${error.response.status}: ${error.response.data.message}`
      );
    } else {
      throw new Error(error.message);
    }
  }
};

type FormValue = {
  userId: string;
};

const MyPage = () => {
  const [searchedUserId, setSearchedUserId] = useState<string | null>(
    localStorage.getItem('id')
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValue>();

  const {
    data: matchHistory,
    fetchNextPage,
    hasNextPage,
    isLoading: matchHistoryIsLoading,
    isError: matchHistoryIsError,
  } = useInfiniteQuery<any>(
    ['matchHistory', searchedUserId],
    ({ pageParam = 0 }) => fetchMatchHistory(pageParam, searchedUserId),
    {
      getNextPageParam: (lastPage) => {
        return lastPage.currentPage !== lastPage.totalPage
          ? lastPage.currentPage + 1
          : undefined;
      },
      enabled: !!searchedUserId, // userId가 있을 때만 쿼리 실행
      cacheTime: 600000, // 10분
      staleTime: 60000, // 1분
    }
  );

  const {
    data: overAlls,
    isLoading: overAllsIsLoading,
    isError: overAllsIsError,
  } = useQuery(
    ['overAlls', searchedUserId],
    () => fetchOverAlls(searchedUserId),
    {
      enabled: !!searchedUserId, // userId가 있을 때만 쿼리 실행
      cacheTime: 600000, // 10분
      staleTime: 60000, // 1분
    }
  );

  const onSubmit = (data: FormValue) => {
    setSearchedUserId(data.userId);
  };

  return (
    <div className={styles[`user-container`]}>
      <div className={styles[`search-box`]}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputField
            placeholder="유저 검색"
            type="text"
            register={register('userId', { required: true })}
          />
        </form>
      </div>
      {matchHistoryIsLoading && <div>Loading...</div>}
      {matchHistoryIsError && <div>존재하지 않는 사용자입니다.</div>}
      {!matchHistoryIsLoading && !matchHistoryIsError && (
        <>
          <div className={styles[`user-info`]}>
            <h2>{searchedUserId}</h2>
            <div className={styles.search}></div>
          </div>
          {overAlls?.total ? (
            <div className={styles[`record-container`]}>
              <div className={styles[`circle-box`]}>
                <h4>
                  {overAlls?.total}전 {overAlls?.win}승 {overAlls?.draw}무{' '}
                  {overAlls?.lose}패
                </h4>
                <CircleProgress
                  win={overAlls?.win}
                  draw={overAlls?.draw}
                  lose={overAlls?.lose}
                  total={overAlls?.total}
                  size={300}
                  strokeWidth={40}
                  winColor="#3278FF"
                  drawColor="#555555"
                  loseColor="#FF5F58"
                />
              </div>
              <div
                className={styles[`record-box`]}
                style={{ overflowY: 'auto' }}
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
          ) : (
            <div className={styles.emptyRecords}>전적 기록이 없습니다.</div>
          )}
        </>
      )}
    </div>
  );
};

export default MyPage;
