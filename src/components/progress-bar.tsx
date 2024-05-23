import ProgressBar from '@ramonak/react-progress-bar';

interface IProps {
  completed: number;
  roundedValue: number;
}

export default function ProgressBarComponent(props: IProps) {
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
