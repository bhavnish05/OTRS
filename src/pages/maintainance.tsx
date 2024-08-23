import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function MaintainancePage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full w-full justify-center items-center">
      <p className="text-3xl font-extrabold">Server is under maintainance</p>
      <p className="text-muted-foreground">Check out after some time!</p>
      <Button onClick={() => navigate("/")} className="mt-4">Home</Button>
    </div>
  );
}
