import ProgressBar from '@ramonak/react-progress-bar';

export default function ProgressBarComponent() {
  return (
    <ProgressBar
      completed={75}
      bgColor="#f11946"
      height="20px"
      borderRadius="10px"
      isLabelVisible={false}
    />
  );
}
