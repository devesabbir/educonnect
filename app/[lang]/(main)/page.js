"use client";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

function HomePage() {
  const { toast } = useToast();

  return (
    <div>
      <Button
        variant={"ghost"}
        onClick={() => {
          toast({
            title: "Scheduled: Catch up ",
            description: "Friday, February 10, 2023 at 5:57 PM",
            position: "top-right", // P
          });
        }}
      >
        Show Toast{" "}
      </Button>
    </div>
  );
}

export default HomePage;
