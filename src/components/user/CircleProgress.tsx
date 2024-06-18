import React from 'react';

interface CircleProgressProps {
  win: number;
  draw: number;
  lose: number;
  total: number;
  size: number; // 프로그레스 바의 크기 (너비와 높이가 같음)
  strokeWidth: number; // 프로그레스 바의 선 두께
  winColor: string; // 승리 상태의 색상
  drawColor: string; // 무승부 상태의 색상
  loseColor: string; // 패배 상태의 색상
}

const CircleProgress = (props: CircleProgressProps) => {
  // 원의 중심 좌표와 반지름 계산
  const radius = (props.size - props.strokeWidth) / 2;
  const centerX = props.size / 2;
  const centerY = props.size / 2;

  // 원의 둘레 길이 계산
  const circumference = 2 * Math.PI * radius;

  // 각 상태의 비율 계산
  const winRatio = props.win / props.total;
  const drawRatio = props.draw / props.total;
  const loseRatio = props.lose / props.total;

  // 각 상태의 offset 계산
  const winOffset = circumference * (1 - winRatio);
  const drawOffset = winOffset - circumference * drawRatio;
  const loseOffset = drawOffset - circumference * loseRatio;

  return (
    <svg
      width={props.size}
      height={props.size}
      viewBox={`0 0 ${props.size} ${props.size}`}
    >
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        stroke={props.loseColor}
        strokeWidth={props.strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={loseOffset}
        strokeLinecap="butt"
      />
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        stroke={props.drawColor}
        strokeWidth={props.strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={drawOffset}
        strokeLinecap="butt"
        transform={`rotate(-90 ${centerX} ${centerY})`}
      />
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        stroke={props.winColor}
        strokeWidth={props.strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={winOffset}
        strokeLinecap="butt"
        transform={`rotate(-90 ${centerX} ${centerY})`}
      />
      <text
        x={centerX}
        y={centerY}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="12"
        fill="gray"
      >
        {`승: ${Math.round(winRatio * 100)}%, 무: ${Math.round(
          drawRatio * 100
        )}%, 패: ${Math.round(loseRatio * 100)}%`}
      </text>
    </svg>
  );
};

export default CircleProgress;
