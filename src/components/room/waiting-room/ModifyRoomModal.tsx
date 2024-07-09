import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import CustomButton from '../../ui/CustomButton';
import styles from '../../../styles/room-list/create-room.module.css';
import React, { useState } from 'react';
import {
  langData,
  levelData,
  limitTImeData,
} from '../../../data/roomSettingData';
import { useForm } from 'react-hook-form';
import InputField from 'components/ui/InputField';
import SelectField from 'components/ui/SelectField';
import useWebSocketStore from 'store/useWebSocketStore';

// 모달 창 스타일
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 360,
  backgroundColor: '#2D2C2C',
  border: '1px solid #000',
  borderRadius: '24px',
  color: 'white',
  boxShadow: 24,
  p: 4,
};

type FormValues = {
  hostId: string;
  title: string;
  password: string;
  maxUserCount: number;
  problemLevel: string;
  language: string;
  maxSubmitCount: number;
  limitTime: number;
};

const ModifyRoomModal = React.memo(({ data }: any) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      hostId: data.hostId,
      title: data.title,
      password: data.password,
      maxUserCount: data.maxUserCount,
      problemLevel: data.problemLevel,
      maxSubmitCount: data.maxSubmitCount,
      limitTime: data.limitTime,
      language: data.language,
    },
  });
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { publishMessage } = useWebSocketStore();

  console.log(data);

  const levelSelectList = levelData;
  const langSelectList = langData;
  const limitTimeSelectList = limitTImeData;

  // 방 수정 함수
  const handleModifyRoom = async (inputData: any) => {
    console.log(inputData, inputData.problemLevel);

    publishMessage(`/app/rooms/${data.roomId}/update/room-status`, inputData);
    handleClose();
  };

  return (
    <div>
      <CustomButton type="button" onClick={handleOpen}>
        방 설정
      </CustomButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={handleSubmit(handleModifyRoom)}>
            <div className={styles.container}>
              <InputField
                label="방 제목"
                type="text"
                register={register('title', {
                  required: '방 제목을 입력해주세요',
                  maxLength: {
                    value: 10,
                    message: '방 제목은 10글자 이하여야합니다.',
                  },
                })}
                defaultValue=""
                error={errors.title}
              />
              <InputField
                label="비밀번호"
                type="password"
                register={register('password')}
                defaultValue=""
                error={errors.password}
              />

              <InputField
                label="인원 수"
                type="number"
                register={register('maxUserCount', {
                  required: '인원수는 필수 입력 항목입니다.',
                  min: { value: 2, message: '인원수는 최소 2명입니다.' },
                  max: { value: 4, message: '인원수는 최대 4명입니다.' },
                })}
                defaultValue={2}
                error={errors.maxUserCount}
              />

              <SelectField
                label="난이도"
                register={register('problemLevel')}
                options={levelSelectList}
              />
              <SelectField
                label="언어 설정"
                register={register('language')}
                options={langSelectList}
              />

              <InputField
                label="제출 횟수"
                type="number"
                register={register('maxSubmitCount', {
                  required: '제출 횟수는 필수 입력 항목입니다.',
                  min: {
                    value: 1,
                    message: '제출 횟수는 최소 1 이어야 합니다.',
                  },
                  max: {
                    value: 5,
                    message: '제출 횟수는 최대 5 이어야 합니다.',
                  },
                })}
                defaultValue={5}
                error={errors.maxSubmitCount}
              />
              <SelectField
                label="제한 시간"
                register={register('limitTime')}
                options={limitTimeSelectList}
              />
            </div>
            <div className={styles[`btn-group`]}>
              <CustomButton size="small" type="button" onClick={handleClose}>
                취소
              </CustomButton>
              <CustomButton type="submit" bgColor="#108ee9">
                수정
              </CustomButton>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
});

export default ModifyRoomModal;
