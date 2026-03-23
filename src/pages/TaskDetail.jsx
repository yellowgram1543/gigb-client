import { useParams } from "react-router-dom";
import Card from "../components/Card";

export default function TaskDetail() {
  const { id } = useParams();

  return (
    <div style={{ padding: "20px" }}>
      <Card>
        <h2>Task #{id}</h2>
        <p>Description of the task...</p>
        <p>Budget: ₹500</p>
      </Card>
    </div>
  );
}