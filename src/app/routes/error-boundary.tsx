import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router";
import { Head } from "@/components/seo/head";
import { Heading3, BodyText } from "@/components/typography";
import { Button } from "@/components/ui/button";

export const ErrorBoundaryRoute = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  const isNotFound = isRouteErrorResponse(error) && error.status === 404;
  const message = isNotFound
    ? "Halaman yang kamu cari tidak ditemukan."
    : "Opss, terjadi kesalahan.";

  return (
    <div className="w-250 min-h-screen mx-auto flex flex-col gap-4 items-center justify-center">
      <Head title="Error" description="Terjadi kesalahan" />
      <Heading3>{isNotFound ? "404" : "500"}</Heading3>
      <BodyText>{message}</BodyText>
      <Button onClick={() => navigate(-1)} className="py-4 px-8 cursor-pointer">
        Kembali
      </Button>
    </div>
  );
};
