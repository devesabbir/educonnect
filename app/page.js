"use client";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main>
      <Button
        className={"text-blue-400 hover:text-red-500"}
        variant={"ghost"}
        onClick={() => alert("Hi")}
      >
        Click
      </Button>
    </main>
  );
}
