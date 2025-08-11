"use client";
import { useState } from "react";
export default function ClientComponet() {
  const [count, setCount] = useState(0);
  console.log("ClientComponet rendered");
  return (
    <div>
      client
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
    </div>
  );
}
