import ClientComponet from "@/components/ClientComponent";
import Link from "next/link";

export default function ServerComponent() {
  console.log("ServerComponent rendered");
  return (
    <div>
      サーバー
      <ClientComponet />
      <Link href="/about">About</Link>
    </div>
  );
}
