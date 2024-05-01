import React from "react";
interface CircleProgressProps {
  progress: number; // 진행 상태 (0 ~ 100)
  size: number; // 프로그레스 바의 크기 (너비와 높이가 같음)
  strokeWidth: number; // 프로그레스 바의 선 두께
  circleColor: string; // 원의 색상
  progressColor: string; // 진행 상태의 색상
}
const CircleProgress = ({ progress, size, strokeWidth, circleColor, progressColor }: CircleProgressProps) => {
  // 원의 중심 좌표와 반지름 계산
  const radius = (size - strokeWidth) / 2;
  const centerX = size / 2;
  const centerY = size / 2;

  // 원의 둘레 길이 계산
  const circumference = 2 * Math.PI * radius;

  // 진행상태를 퍼센트로 변환하여 stroke-dashoffset 계산
  const progressOffset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke={circleColor} strokeWidth={strokeWidth} />
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        stroke={progressColor}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={progressOffset}
        strokeLinecap="butt"
        transform={`rotate(-90 ${centerX} ${centerY})`}
      />
      <text
        x={centerX}
        y={centerY}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="16"
        fill={progressOffset > 50 ? "#3278FF" : "#FF5F58"}
      >
        {progress}%
      </text>
    </svg>
  );
};

export default CircleProgress;
