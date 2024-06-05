import styles from 'styles/room.module.css';

interface IProblem {
  id: number;
  title: string;
  algorithmClassification: string;
  problemLevel: string;
  problemDescription: string;
  inputDescription: string;
  outputDescription: string;
  hint: string;
}

interface IProps {
  problem: IProblem;
}

const Problem = (props: IProps) => {
  return (
    <div key={props.problem.id} className={styles.problem}>
      <h3>{props.problem.title}</h3>
      <p>
        <strong>Algorithm Classification:</strong>{' '}
        {props.problem.algorithmClassification}
      </p>
      <p>
        <strong>Level:</strong> {props.problem.problemLevel}
      </p>
      <div className={styles.description}>
        <h4>Description</h4>
        <p>{props.problem.problemDescription}</p>
      </div>
      <div className={styles.description}>
        <h4>Input</h4>
        <p>{props.problem.inputDescription}</p>
      </div>
      <div className={styles.description}>
        <h4>Output</h4>
        <p>{props.problem.outputDescription}</p>
      </div>
      {props.problem.hint && (
        <div className={styles.description}>
          <h4>Hint</h4>
          <p>{props.problem.hint}</p>
        </div>
      )}
    </div>
  );
};

export default Problem;
