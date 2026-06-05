import { Dialog, DialogContent } from "../dialog";

type PhotoViewProps = {
  url: string;
  open: boolean;
  setOpen: (state: boolean) => void;
};

export const PhotoView = ({ open, setOpen, url }: PhotoViewProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-1">
        <img src={url} className="w-full rounded-md" />
      </DialogContent>
    </Dialog>
  );
};
