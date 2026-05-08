import { Heading3 } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export const UnderDevelop = () => {
  const navigate = useNavigate();

  return (
    <div className="w-250 min-h-screen mx-auto flex flex-col gap-4 items-center justify-center">
      <Heading3>Oops, sedang dalam pengembangan :)</Heading3>
      <Button onClick={() => navigate(-1)} className="py-4 px-8 cursor-pointer">
        Kembali
      </Button>
    </div>
  );
};
