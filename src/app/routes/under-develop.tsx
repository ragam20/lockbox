import { LoadingScreen } from "@/components/effects/loading-screen";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export const UnderDevelop = () => {
  const navigate = useNavigate();

  return (
    <div className="w-250 min-h-screen mx-auto flex flex-col gap-4 items-center justify-center">
      <LoadingScreen>
        <p className="text-md">Oops, sedang dalam pengembangan :)</p>
        <Button
          onClick={() => navigate(-1)}
          className="py-4 px-8 cursor-pointer"
        >
          Kembali
        </Button>
      </LoadingScreen>
    </div>
  );
};
