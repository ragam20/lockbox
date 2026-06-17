import z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { LoadingScreen } from "@/components/effects/loading-screen";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ApiError } from "@/types/response";
import { getErrorMessage } from "@/lib/errors/messages";
import {
  useGetArgonConfigQuery,
  useGetUserQuery,
  useGetVaultQuery,
  useLogout,
} from "@/lib/auth";
import { getProtectionKeys } from "../api/get-protection-keys";
import {
  arrayBufferToBase64,
  base64ToArrayBuffer,
  base64ToUint8Array,
  createHKDFBaseKey,
  deriveAuthKey,
  deriveVaultKey,
  generateAuthVerifier,
  unwrapDataEncryptionKey,
  wrapDataEncryptionKey,
} from "@/lib/crypto/keys";
import { hashArgon2id } from "@/lib/crypto/argon-config";
import { useAppStore } from "@/lib/store";
import { useUpdateArgonConfig } from "../api/update-argon-config";
import { useNavigate } from "react-router";
import { paths } from "@/config/paths";

const argonConfigSchema = z.object({
  memory: z.number().int().min(1024).max(65536),
  time: z.number().int().min(3).max(8),
  parallelism: z.number().int().min(3).max(7),
});

type EditTuningArgonValues = z.output<typeof argonConfigSchema>;

export const PasswordTuning = () => {
  const router = useNavigate();
  const [password, setPassword] = useState<string | null>(null);
  const [formData, setFormData] = useState<EditTuningArgonValues | null>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const argonConfigQuery = useGetArgonConfigQuery();
  const userQuery = useGetUserQuery();
  const vaultQuery = useGetVaultQuery();
  const argonConfig = argonConfigQuery.data;
  const appStore = useAppStore();
  const updateArgonConfigMutation = useUpdateArgonConfig();

  const logout = useLogout();

  const defaultValues = {
    memory: argonConfig?.memory,
    time: argonConfig?.iteration,
    parallelism: argonConfig?.parallelism,
  };

  const handleEditArgon = (data: EditTuningArgonValues) => {
    setFormData(data);
    setOpenConfirmDialog(true);
  };

  const compareVerifier = async (inputPassword: string): Promise<boolean> => {
    if (!userQuery.data) {
      return false;
    }
    const argonOptions = {
      time: argonConfig?.iteration,
      mem: argonConfig?.memory,
      parallelism: argonConfig?.parallelism,
    };
    const masterKeySalt = userQuery.data.masterKeySalt;
    const masterKey = await hashArgon2id(
      inputPassword,
      base64ToUint8Array(masterKeySalt),
      argonOptions,
    );

    const baseKey = await createHKDFBaseKey(masterKey.hash);

    const verifierSalt = userQuery.data.authVerifierSalt;
    const authKey = await deriveAuthKey(
      baseKey,
      base64ToArrayBuffer(verifierSalt),
    );
    const authVerifier = await generateAuthVerifier(authKey);

    return authVerifier === appStore.appCrypto.authVerifier;
  };

  const confirmSubmit = async () => {
    if (!formData || !password) {
      toast.error("Cek password apakah sudah benar!");
      return;
    }
    setOpenConfirmDialog(false);

    try {
      if (
        !argonConfig ||
        !appStore.appCrypto.authVerifier ||
        argonConfigQuery.data === undefined ||
        userQuery.data === undefined ||
        vaultQuery.data === undefined
      ) {
        throw new Error("Terjadi kesalahan saat konfigurasi");
      }

      const isValid = await compareVerifier(password);

      if (!isValid) {
        toast.error("kesalahan pada password");
        setPassword("");
        return;
      }

      const argonOptions = {
        time: argonConfig.iteration,
        mem: argonConfig.memory,
        parallelism: argonConfig.parallelism,
      };

      const masterKeySalt = userQuery.data.masterKeySalt;
      const oldMasterKey = await hashArgon2id(
        password,
        base64ToUint8Array(masterKeySalt),
        argonOptions,
      );

      const oldBaseKey = await createHKDFBaseKey(oldMasterKey.hash);
      const oldVaultKey = await deriveVaultKey(
        oldBaseKey,
        base64ToArrayBuffer(vaultQuery.data.vaultKeySalt),
      );

      const newArgonConfig = {
        time: formData.time,
        mem: formData.memory,
        parallelism: formData.parallelism,
      };
      const newMasterKey = await hashArgon2id(
        password,
        base64ToUint8Array(userQuery.data.masterKeySalt),
        newArgonConfig,
      );

      const newBaseKey = await createHKDFBaseKey(newMasterKey.hash);

      // new auth keys
      const authKey = await deriveAuthKey(
        newBaseKey,
        base64ToArrayBuffer(userQuery.data.authVerifierSalt),
      );
      const newAuthVerifier = await generateAuthVerifier(authKey);

      // new vault keys
      const protectionKeys = await getProtectionKeys();
      const newVaultKey = await deriveVaultKey(
        newBaseKey,
        base64ToArrayBuffer(vaultQuery.data.vaultKeySalt),
      );

      for (let i = 0; i < protectionKeys.length; i++) {
        const iv = protectionKeys[i].ivProtectionKey;
        const encryptedProtectionKey = protectionKeys[i].protectionKey;
        const unwrapProtectionKey = await unwrapDataEncryptionKey(
          oldVaultKey,
          base64ToArrayBuffer(iv),
          base64ToArrayBuffer(encryptedProtectionKey),
        );

        const newEncryptedProtectionKey = await wrapDataEncryptionKey(
          unwrapProtectionKey,
          newVaultKey,
        );

        protectionKeys[i].protectionKey = arrayBufferToBase64(
          newEncryptedProtectionKey.wrappedKey,
        );
        protectionKeys[i].ivProtectionKey = arrayBufferToBase64(
          newEncryptedProtectionKey.iv,
        );
      }

      await updateArgonConfigMutation.mutateAsync(
        {
          authVerifier: newAuthVerifier,
          argonConfig: {
            id: argonConfig.id,
            iterations: newArgonConfig.time,
            memory: newArgonConfig.mem,
            parallelism: newArgonConfig.parallelism,
          },
          protectionKeys,
        },
        {
          onSuccess: async () => {
            await logout.logout(() => {
              router(paths.landing.path, { replace: true });
              toast.success("Berhasil! Silahkan login ulang");
            });
          },
        },
      );
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(getErrorMessage(err.code));
      } else {
        toast.error("Gagal mengatur konfigurasi");
      }
    } finally {
      setPassword("");
      setFormData(null);
    }
  };

  if (
    argonConfigQuery.isLoading ||
    userQuery.isLoading ||
    vaultQuery.isLoading
  ) {
    return (
      <div className="w-full h-100 flex items-center justify-center">
        <LoadingScreen label="Mengatur konfigurasi ..." />
      </div>
    );
  }

  return (
    <>
      <Dialog open={openConfirmDialog} onOpenChange={setOpenConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <p className="text-red-700">
              Mengubah konfigurasi membutuhkan waktu lama
            </p>

            <Input
              type="password"
              placeholder="Masukan password"
              value={password ?? ""}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              variant={"outline"}
              className="cursor-pointer py-4 px-8"
              onClick={() => setOpenConfirmDialog(false)}
            >
              Tidak
            </Button>
            <Button
              onClick={confirmSubmit}
              className="cursor-pointer py-4 px-8"
            >
              Ya
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Form
        id="argon2id-tuning-form"
        defaultValues={defaultValues}
        onSubmit={handleEditArgon}
        schema={argonConfigSchema}
      >
        {({ register, errors }) => (
          <>
            <FormField label="Memori" error={errors.memory}>
              <Input
                placeholder={`${argonConfigQuery.data?.memory ?? "0"}`}
                className="py-4"
                {...register("memory", { valueAsNumber: true })}
              />
            </FormField>

            <FormField label="Iterations" error={errors.time}>
              <Input
                placeholder={`${argonConfigQuery.data?.iteration ?? "0"}`}
                className="py-4"
                {...register("time", { valueAsNumber: true })}
              />
            </FormField>

            <FormField label="Paralel" error={errors.parallelism}>
              <Input
                placeholder={`${argonConfigQuery.data?.parallelism ?? "0"}`}
                className="py-4"
                {...register("parallelism", { valueAsNumber: true })}
              />
            </FormField>
          </>
        )}
      </Form>

      <Button
        form="argon2id-tuning-form"
        type="submit"
        className="rounded-md my-4 cursor-pointer"
      >
        Ubah
      </Button>
    </>
  );
};
