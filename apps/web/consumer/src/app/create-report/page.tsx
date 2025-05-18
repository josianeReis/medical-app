"use client";
import { useTranslations } from "next-intl";

import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  DatePicker,
  Input,
  Label,
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@packages/ui-components";

import React from "react";

const CreateReport = () => {
  const t = useTranslations("create_report");

  return (
    <div className="flex p-2">
      <div className="w-full max-w">
        <Card className="h-20 ">
          <CardHeader className="flex flex-row gap-3 top">
            <div>
              <Label className="ml-1 mb-2">{t("examDate")}</Label>
              <DatePicker />
            </div>
            <div>
              <Label className="ml-1">{t("examName")}</Label>
              <Input placeholder="Name" className="w-[300px] mt-2" />
            </div>
            <div>
              <Label className="ml-1">{t("patientName")}</Label>
              <Input placeholder="Name" className="w-[300px] mt-2" />
            </div>
            <div>
              <Label className="ml-1 mb-2">{t("dateOfBirth")}</Label>
              <DatePicker className="w-[150px]" />
            </div>
            <div>
              <Label className="ml-1">{t("age")}</Label>
              <Input placeholder="Idade" className="w-[65px] mt-2" />
            </div>
            <div>
              <Label className="mb-2 ml-1">{t("sex")}</Label>
              <Select>
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="sexo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">{t("male")}</SelectItem>
                  <SelectItem value="feminino">{t("female")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className=" flex flex-row mt-5 ml-25 gap-2">
              <Button>{t("salveButton")}</Button>
              <Button>{t("printButton")}</Button>
            </div>
          </CardHeader>
          <div className="flex flex-row gap-2">
            <CardContent className="w-110 h-150 p-0 rounded-md ">
              <Menubar>
                <MenubarMenu>
                  <MenubarTrigger>{t("myTemplates")}</MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem>
                      New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem>
                      New Window <MenubarShortcut>⌘N</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem disabled>New Incognito Window</MenubarItem>
                    <MenubarSeparator />
                    <MenubarSub>
                      <MenubarSubTrigger>Share</MenubarSubTrigger>
                      <MenubarSubContent>
                        <MenubarItem>Email link</MenubarItem>
                        <MenubarItem>Messages</MenubarItem>
                        <MenubarItem>Notes</MenubarItem>
                      </MenubarSubContent>
                    </MenubarSub>
                    <MenubarSeparator />
                    <MenubarItem>
                      Print... <MenubarShortcut>⌘P</MenubarShortcut>
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                  <MenubarTrigger>Fotos</MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem>
                      Undo <MenubarShortcut>⌘Z</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem>
                      Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarSub>
                      <MenubarSubTrigger>Find</MenubarSubTrigger>
                      <MenubarSubContent>
                        <MenubarItem>Search the web</MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem>Find...</MenubarItem>
                        <MenubarItem>Find Next</MenubarItem>
                        <MenubarItem>Find Previous</MenubarItem>
                      </MenubarSubContent>
                    </MenubarSub>
                    <MenubarSeparator />
                    <MenubarItem>Cut</MenubarItem>
                    <MenubarItem>Copy</MenubarItem>
                    <MenubarItem>Paste</MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                  <MenubarTrigger>?</MenubarTrigger>
                  <MenubarContent>
                    <MenubarCheckboxItem>
                      Always Show Bookmarks Bar
                    </MenubarCheckboxItem>
                    <MenubarCheckboxItem checked>
                      Always Show Full URLs
                    </MenubarCheckboxItem>
                    <MenubarSeparator />
                    <MenubarItem inset>
                      Reload <MenubarShortcut>⌘R</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem disabled inset>
                      Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem inset>Toggle Fullscreen</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem inset>Hide Sidebar</MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                  <MenubarTrigger>?</MenubarTrigger>
                  <MenubarContent>
                    <MenubarRadioGroup value="benoit">
                      <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
                      <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
                      <MenubarRadioItem value="Luis">Luis</MenubarRadioItem>
                    </MenubarRadioGroup>
                    <MenubarSeparator />
                    <MenubarItem inset>Edit...</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem inset>Add Profile...</MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>

              <ScrollArea className="w-105 h-138  mt-2 rounded-md border p-4">
                Jokester began sneaking into the castle in the middle of the
                night and leaving jokes all over the place: under the
                king&apos;s pillow, in his soup, even in the royal toilet. The
                king was furious, but he couldn&apos;t seem to stop Jokester.
                And then, one day, the people of the kingdom discovered that the
                jokes left by Jokester were so funny that they couldn&apos;t
                help but laugh. And once they started laughing, they
                couldn&apos;t stop. &gt; Jokester began sneaking into the castle
                in the middle of the night and leaving jokes all over the place:
                under the king&apos;s pillow, in his soup, even in the royal
                toilet. The king was furious, but he couldn&apos;t seem to stop
                Jokester. And then, one day, the people of the kingdom
                discovered that the jokes left by Jokester were so funny that
                they couldn&apos;t help but laugh. And once they started
                laughing, they couldn&apos;t stop. &gt; Jokester began sneaking
                into the castle in the middle of the night and leaving jokes all
                over the place: under the king&apos;s pillow, in his soup, even
                in the royal toilet. The king was furious, but he couldn&apos;t
                seem to stop Jokester. And then, one day, the people of the
                kingdom discovered that the jokes left by Jokester were so funny
                that they couldn&apos;t help but laugh. And once they started
                laughing, they couldn&apos;t stop. &gt; Jokester began sneaking
                into the castle in the middle of the night and leaving jokes all
                over the place: under the king&apos;s pillow, in his soup, even
                in the royal toilet. The king was furious, but he couldn&apos;t
                seem to stop Jokester. And then, one day, the people of the
                kingdom discovered that the jokes left by Jokester were so funny
                that they couldn&apos;t help but laugh. And once they started
                laughing, they couldn&apos;t stop. &gt; Jokester began sneaking
                into the castle in the middle of the night and leaving jokes all
                over the place: under the king&apos;s pillow, in his soup, even
                in the royal toilet. The king was furious, but he couldn&apos;t
                seem to stop Jokester. And then, one day, the people of the
                kingdom discovered that the jokes left by Jokester were so funny
                that they couldn&apos;t help but laugh. And once they started
                laughing, they couldn&apos;t stop. &gt; Jokester began sneaking
                into the castle in the middle of the night and leaving jokes all
                over the place: under the king&apos;s pillow, in his soup, even
                in the royal toilet. The king was furious, but he couldn&apos;t
                seem to stop Jokester. And then, one day, the people of the
                kingdom discovered that the jokes left by Jokester were so funny
                that they couldn&apos;t help but laugh. And once they started
                laughing, they couldn&apos;t stop. &gt;
              </ScrollArea>
            </CardContent>
            <CardContent className="w-284 rounded-md border">ia</CardContent>
          </div>
          <CardFooter>
            <Button className="ml-320 p-4">{t("cancelButton")}</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CreateReport;
