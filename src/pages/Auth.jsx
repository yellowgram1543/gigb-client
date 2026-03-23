import Button from "../components/Button";
import Card from "../components/Card";

export default function Auth() {
  return (
    <div style={{ padding: "20px" }}>
      <Card>
        <h2>Welcome to GigB</h2>
        <input placeholder="Email" />
        <input placeholder="Password" type="password" />
        <Button text="Login" />
        <Button text="Signup" type="secondary" />
      </Card>
    </div>
  );
}