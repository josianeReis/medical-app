import { deleteOrganization } from "@/services/organization";
import { redirect, RedirectType } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Separator,
} from "@packages/ui-components";
import { useTranslations } from "next-intl";
import { UserWithDetails } from "@packages/auth-config/plugins/user-session-details-client";

interface DeadZoneProps {
  organization: Organization | undefined;
  user: UserWithDetails;
}

const DeadZone = ({ organization, user }: DeadZoneProps) => {
  const t = useTranslations("settings.organization.dead-zone");
  const handleDeleteOrganization = async () => {
    if (!organization?.id) {
      toast.error("Organização não encontrada");
      return;
    }
    const result = await deleteOrganization(organization.id);

    if (result.success) {
      toast.success("Organização excluida com sucesso");
      redirect(`/organizations`, RedirectType.replace);
    } else {
      console.error("Erro ao atualizar:", result.error);
    }
  };
  return (
    <div>
      <p>Zona de perigo</p>
      <div className="border bg-white rounded-sm px-4 mt-4">
        <div className="flex items-center gap-2 py-4">
          <div className="w-full">
            <Label>Apagar organização</Label>
            <p className="text-xs text-gray-600 mt-1">
              Essa ação é irreversivel
            </p>
          </div>

          <Dialog>
            <form>
              <DialogTrigger asChild>
                <Button variant="destructive">{t("delete-organization")}</Button>
              </DialogTrigger>
              <DialogContent className="p-0">
                <DialogHeader>
                  <DialogTitle className="p-4">{t("title")}</DialogTitle>
                  <Separator />
                </DialogHeader>

                <div className="px-4 space-y-4">
                  <p className="text-muted-foreground text-sm">
                    {t("deletion-warning-1")}{" "}
                    <b className="text-black">{organization?.name}</b>,{" "}
                    {t("deletion-warning-2")}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {t("irreversible-operation")}
                  </p>

                  <p className="text-muted-foreground text-sm">
                    {t("data-deletion-details")}
                  </p>

                  <div className="grid gap-3">
                    <Label htmlFor="name-1">
                      {t("enter-code-label")}{" "}
                      <span className="bg-gray-100 border p-0.5 rounded-sm font-mono text-xs text-gray-600 tracking-wide">
                        {user?.email}
                      </span>
                    </Label>
                    <Input id="name-1" name="name" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms">{t("acknowledge-checkbox")}</Label>
                  </div>
                </div>

                <DialogFooter className="p-4">
                  <Button
                    variant="destructive"
                    className="w-full h-12"
                    onClick={handleDeleteOrganization}
                  >
                    {t("delete-organization")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default DeadZone;
