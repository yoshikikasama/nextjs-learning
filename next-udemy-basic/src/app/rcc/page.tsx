"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function ClientComponet() {
  const [count, setCount] = useState(0);
  console.log("ClientComponet rendered");
  const router = useRouter();
  return (
    <div>
      client
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <Link href="/about">About</Link>
      <button onClick={() => router.push("/about")}>Go to About</button>
    </div>
  );
}
