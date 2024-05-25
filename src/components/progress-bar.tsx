import ProgressBar from '@ramonak/react-progress-bar';

interface IProps {
  completed: number;
  roundedValue: number;
}

export default function ProgressBarComponent(props: IProps) {
  const calculateColor = (completed: number): string => {
    const r = Math.floor((100 - completed) * 2.55); // 255에서 0으로
    const g = Math.floor(completed * 2.55); // 0에서 255로
    return `rgb(${r},${g},0)`; // 빨간색에서 녹색으로
  };

  const bgColor = calculateColor(props.completed);

  return (
    <div>
      <div>
        <ProgressBar
          completed={props.completed}
          bgColor="#f11946"
          height="15px"
          width="150px"
          borderRadius="10px"
          transitionDuration="0.3s"
          customLabel={`${props.roundedValue}%`}
          isLabelVisible={true}
        />
      </div>
    </div>
  );
}
