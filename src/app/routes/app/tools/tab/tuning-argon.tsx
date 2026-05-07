import { BodyText } from "@/components/typography";
import { PasswordTuning } from "@/features/tools/component/set-tuning-argon";
export const TuningArgon = () => {
  return (
    <div className="w-full md:w-200 mx-auto px-4">
      <BodyText>Argon2id</BodyText>
      <p className="text-gray-400 text-sm">
        Atur argon2id agar password lebih kuat
      </p>
      <PasswordTuning />
    </div>
  );
};
