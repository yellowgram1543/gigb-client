import Button from "../components/Button";
import Card from "../components/Card";

export default function PostTask() {
  return (
    <div style={{ padding: "20px" }}>
      <Card>
        <h2>Post a Task</h2>

        <input placeholder="Title" />
        <textarea placeholder="Description" />
        <input placeholder="Location" />
        <input placeholder="Budget" />

        <Button text="Submit Task" />
      </Card>
    </div>
  );
}