import React, { useState } from 'react';
import styles from 'styles/room-list/room-entry.module.css';

const SearchRoom = (props: any) => {
  const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 숫자만 저장
    const validInputValue = e.target.value.replace(/[^0-9]/g, '');
    props.onChange(validInputValue);
  };
  return (
    <div className={styles[`room-entry-container`]}>
      <input
        placeholder="방 번호로 검색"
        value={props.value}
        onChange={(e) => handleInputValue(e)}
      />
    </div>
  );
};

export default SearchRoom;
