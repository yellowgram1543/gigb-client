import Card from "../components/Card";
import { useNavigate } from "react-router-dom";

export default function TaskList() {
  const nav = useNavigate();

  const tasks = [
    { id: 1, title: "Fix fan" },
    { id: 2, title: "Clean house" }
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Tasks</h2>

      {tasks.map(task => (
        <Card key={task.id}>
          <p>{task.title}</p>
          <button onClick={() => nav(`/task/${task.id}`)}>
            View
          </button>
        </Card>
      ))}
    </div>
  );
}