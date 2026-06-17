import { BodyMedium, BodyText, Heading3 } from "../typography";
import { ArrowsClockwiseIcon, CopyIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";
import { cn, getPasswordStrength, type PasswordStrength } from "@/lib/utils";
import { Checkbox } from "./checkbox";
import { Slider } from "./slider";
import { Button } from "./button";

const LOWERCASE_CHARACTERS = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGIT_CHARACTERS = "0123456789";
const SYMBOL_CHARACTERS = "!@#$%^&*";

const getRandomIndex = (max: number) => {
  if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
    return window.crypto.getRandomValues(new Uint32Array(1))[0] % max;
  }

  return Math.floor(Math.random() * max);
};

const getRandomCharacter = (characters: string) => {
  return characters[getRandomIndex(characters.length)];
};

const shuffleCharacters = (characters: string[]) => {
  const shuffled = [...characters];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = getRandomIndex(index + 1);
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled.join("");
};

const buildPassword = (
  selectedCharacterSets: string[],
  selectedCharacterLength: number,
) => {
  const passwordCharacters = selectedCharacterSets.map((characters) =>
    getRandomCharacter(characters),
  );
  const allSelectedCharacters = selectedCharacterSets.join("");

  while (passwordCharacters.length < selectedCharacterLength) {
    passwordCharacters.push(getRandomCharacter(allSelectedCharacters));
  }

  return shuffleCharacters(passwordCharacters);
};

const getPasswordCharacterClassName = (character: string) => {
  if (SYMBOL_CHARACTERS.includes(character)) {
    return "text-[#c9523c]";
  }

  if (DIGIT_CHARACTERS.includes(character)) {
    return "text-[#82c46c]";
  }

  return "text-white";
};

export const PasswordGeneratorBox = () => {
  const minTotalCharacters = 0;
  const defaultTotalCharacters = 6;
  const [checkLower, setCheckLower] = useState(true);
  const [checkUpper, setCheckUpper] = useState(true);
  const [checkDigit, setCheckDigit] = useState(true);
  const [checkSymbol, setCheckSymbol] = useState(true);
  const [totalCharacters, setTotalCharacters] = useState([
    defaultTotalCharacters,
  ]);
  const [password, setPassword] = useState(() =>
    buildPassword(
      [
        LOWERCASE_CHARACTERS,
        UPPERCASE_CHARACTERS,
        DIGIT_CHARACTERS,
        SYMBOL_CHARACTERS,
      ],
      defaultTotalCharacters,
    ),
  );
  const hasNoSelection =
    !checkLower && !checkUpper && !checkDigit && !checkSymbol;
  const hasSymbolOnly =
    checkSymbol && !checkLower && !checkUpper && !checkDigit;
  const hasInvalidSelection = hasNoSelection || hasSymbolOnly;
  const showSelectionError = hasInvalidSelection;
  const highlightAllOptions = showSelectionError && hasNoSelection;
  const selectedCharacterLength = totalCharacters[0];
  const [passwordStrength, setPasswordStrength] =
    useState<PasswordStrength | null>(null);

  const characterOptions = [
    {
      checked: checkLower,
      label: "a-z",
      onCheckedChange: setCheckLower,
      characters: LOWERCASE_CHARACTERS,
      highlightError: highlightAllOptions,
    },
    {
      checked: checkUpper,
      label: "A-Z",
      onCheckedChange: setCheckUpper,
      characters: UPPERCASE_CHARACTERS,
      highlightError: highlightAllOptions,
    },
    {
      checked: checkDigit,
      label: "0-9",
      onCheckedChange: setCheckDigit,
      characters: DIGIT_CHARACTERS,
      highlightError: highlightAllOptions,
    },
    {
      checked: checkSymbol,
      label: "!@#$%^&*",
      onCheckedChange: setCheckSymbol,
      characters: SYMBOL_CHARACTERS,
      highlightError:
        highlightAllOptions || (showSelectionError && hasSymbolOnly),
    },
  ];

  const generatePassword = () => {
    if (selectedCharacterLength < 6) {
      toast.error("Karakter minimal 6 untuk generate password.");
      return;
    }

    if (hasInvalidSelection) {
      setPassword("");
      return;
    }

    const selectedCharacterSets = characterOptions
      .filter((option) => option.checked)
      .map((option) => option.characters);

    const password = buildPassword(
      selectedCharacterSets,
      selectedCharacterLength,
    );
    setPassword(password);
    setPasswordStrength(getPasswordStrength(password));
  };

  const copyPassword = async () => {
    if (!password) {
      toast.error("Belum ada password untuk disalin.");
      return;
    }

    try {
      await navigator.clipboard.writeText(password);
      toast.success("Password berhasil disalin.");
    } catch {
      toast.error("Gagal menyalin password.");
    }
  };

  return (
    <div className="py-4 flex flex-col gap-4 xl:flex-none border border-white rounded-md mx-auto">
      <div className="p-6 flex flex-col gap-4">
        <Heading3 className="text-pistachio text-center">
          Password Generator
        </Heading3>
        <BodyText className="text-center text-(--shade40)">
          Tingkatkan keamanan akun kamu dengan password kuat. Gunakan Password
          Generator dari Lockbox untuk membuatnya secara instan.
        </BodyText>
      </div>

      <div className="px-5">
        <BodyText
          className={cn(
            "m-auto min-h-14 text-center break-all",
            !password && "text-muted",
          )}
        >
          {password
            ? password.split("").map((character, index) => (
                <span
                  key={`${character}-${index}`}
                  className={getPasswordCharacterClassName(character)}
                >
                  {character}
                </span>
              ))
            : "Password akan muncul di sini setelah diacak."}
        </BodyText>
      </div>

      <div
        id="pass-config"
        className="mx-auto md:mx-14 flex flex-col gap-4 items-center xl:flex-row xl:gap-0 md:justify-between "
      >
        <div className="flex gap-4 w-full md:w-xl">
          <BodyText>Karakter: {selectedCharacterLength}</BodyText>
          <Slider
            value={totalCharacters}
            max={128}
            min={minTotalCharacters}
            step={2}
            onValueChange={(v) => setTotalCharacters(v)}
            className="
              w-full
              **:data-[slot=slider-track]:bg-pistachio
              **:data-[slot=slider-range]:bg-neon-green
              **:data-[slot=slider-thumb]:border-dark-forest
              **:data-[slot=slider-thumb]:bg-dark-forest
            "
          />
        </div>

        <div className="flex gap-4 ">
          {characterOptions.map((option) => (
            <div key={option.label} className="flex gap-2 items-center">
              <Checkbox
                className={cn(
                  "border-neon-green data-checked:border-neon-green data-checked:bg-neon-green data-checked:text-dark-forest",
                  option.highlightError &&
                    "border-red-500 data-checked:border-red-500 data-checked:bg-red-500 data-checked:text-white",
                )}
                checked={option.checked}
                onCheckedChange={(checked) => {
                  option.onCheckedChange(checked === true);
                }}
              />
              <BodyMedium
                className={cn(option.highlightError && "text-red-500")}
              >
                {option.label}
              </BodyMedium>
            </div>
          ))}
        </div>
      </div>

      <div className="my-4 mx-auto flex flex-col md:flex-row gap-18 items-center">
        <BodyText>
          Kekuatan password:{" "}
          <span style={{ color: passwordStrength?.color }}>
            {passwordStrength ? passwordStrength.label : "-"}
          </span>
        </BodyText>
        <BodyText>
          Estimasi crack:{" "}
          <span style={{ color: passwordStrength?.color }}>
            {passwordStrength ? passwordStrength.estimation : "-"}
          </span>
        </BodyText>
      </div>

      <div className="w-full px-6 flex gap-4 items-center justify-center">
        <Button
          className="cursor-pointer rounded-md py-4 px-8"
          onClick={copyPassword}
        >
          <CopyIcon data-icon="inline-start" />
          Salin password
        </Button>
        <Button
          variant={"outline"}
          className="cursor-pointer rounded-md py-4 px-8"
          onClick={generatePassword}
        >
          <ArrowsClockwiseIcon data-icon="inline-start" />
          Acak password
        </Button>
      </div>
    </div>
  );
};
