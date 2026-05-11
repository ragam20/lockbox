import { useNavigate } from "react-router";
import { Head } from "@/components/seo/head";
import { Heading3, BodyText } from "@/components/typography";
import { Button } from "@/components/ui/button";

export const NotFoundRoute = () => {
  const navigate = useNavigate();

  return (
    <div className="w-250 min-h-screen mx-auto flex flex-col gap-4 items-center justify-center">
      <Head title="404" description="Halaman tidak ditemukan" />
      <Heading3>404 — Halaman tidak ditemukan</Heading3>
      <BodyText>Halaman yang kamu cari tidak tersedia atau telah dipindahkan.</BodyText>
      <Button onClick={() => navigate(-1)} className="py-4 px-8 cursor-pointer">
        Kembali
      </Button>
    </div>
  );
};
