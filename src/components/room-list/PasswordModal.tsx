import { Box, Modal } from '@mui/material';
import RoomCustomButton from 'components/ui/RoomCustomButton';

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

const PasswordModal = (props: any) => {
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
          <h4>비밀번호 입력</h4>
          <input
            type="password"
            value={props.password}
            onChange={(e) => props.setPassword(e.target.value)}
          />
          <div>
            <RoomCustomButton onClick={props.handleEnterRoom}>
              입장
            </RoomCustomButton>
            <RoomCustomButton onClick={handleClose}>취소</RoomCustomButton>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default PasswordModal;
