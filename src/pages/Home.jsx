import Button from "../components/Button";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const nav = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>

      <Button text="Post a Task" onClick={() => nav("/post")} />

      <Card>
        <p>No active tasks yet</p>
      </Card>
    </div>
  );
}