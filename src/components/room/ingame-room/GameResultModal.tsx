import { Editor } from '@monaco-editor/react';
import { Box, Modal } from '@mui/material';
import RoomCustomButton from 'components/ui/RoomCustomButton';
import { useState } from 'react';

interface IProps {
  winner: string;
  winnerCode: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  setIsGameStart: (isStart: boolean) => void;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: '#2D2C2C',
  border: '1px solid #000',
  borderRadius: '24px',
  color: 'white',
  boxShadow: 24,
  p: 4,
};

const childStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  backgroundColor: '#2D2C2C',
  border: '1px solid #000',
  borderRadius: '24px',
  color: 'white',
  boxShadow: 24,
  p: 4,
};

function ChildModal(props: any) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <RoomCustomButton onClick={handleOpen}>코드 보기</RoomCustomButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={childStyle}>
          <Editor value={props.winnerCode} theme="vs-dark" height={600} />
          <RoomCustomButton onClick={handleClose}>닫기</RoomCustomButton>
        </Box>
      </Modal>
    </div>
  );
}

const GameResultModal = (props: IProps) => {
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

  const handleClose = () => props.setOpen(false);

  return (
    <div>
      <Modal
        open={props.open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div>
            <h2>Winner!</h2>
            <h3>{props.winner}</h3>
            <div style={{ display: 'flex' }}>
              <ChildModal winnerCode={props.winnerCode} />
              <RoomCustomButton
                onClick={() => {
                  props.setIsGameStart(false);
                  props.setOpen(false);
                }}
              >
                닫기
              </RoomCustomButton>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default GameResultModal;
