import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import ProgressBar from '@ramonak/react-progress-bar';

interface IProps {
  completed: number;
  roundedValue: number;
  result: string;
}

const shake_success = keyframes`
  
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
`;

const shake_fail = keyframes`
0% { transform: translate(0, 0); }
25% { transform: translate(-1px, -1px); }
50% { transform: translate(1px, 1px); }
75% { transform: translate(-1px, 1px); }
100% { transform: translate(0, 0); }
`;

// styled-component로 ProgressBarContainer 정의
const ProgressBarContainer = styled.div<{ result: string; completed: Number }>`
  ${({ result, completed }) =>
    result === 'PASS' &&
    completed === 100 &&
    css`
      animation: ${shake_success} 0.5s ease-in-out;
    `}

  ${({ result }) =>
    result === 'FAIL' &&
    css`
      animation: ${shake_fail} 0.5s ease-in;
    `}
`;

export default function ProgressBarComponent(props: IProps) {
  const calculateColor = (result: string): string => {
    return result === 'FAIL' ? `rgb(255,0,0)` : `rgb(0,215,0)`;
  };

  const bgColor = calculateColor(props.result);

  return (
    <div>
      <ProgressBarContainer result={props.result} completed={props.completed}>
        <ProgressBar
          completed={props.completed}
          bgColor={bgColor}
          height="15px"
          width="150px"
          borderRadius="10px"
          transitionDuration="0.25s"
          isLabelVisible={false}
        />
      </ProgressBarContainer>
    </div>
  );
}
