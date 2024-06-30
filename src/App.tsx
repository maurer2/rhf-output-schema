import { useState } from "react";
import "./App.css";
import FormFields from "./componentsd/form-fields/form-fields";

function App() {
  const [count, setCount] = useState(0);

  return (
    <main>
      <FormFields />
    </main>
  );
}

export default App;
