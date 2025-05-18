"use client";

import { CheckIcon } from "lucide-react";
import { NoOptionIcon } from "../icons/no-option";
import { Button } from "./button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Kbd } from "./kbd";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { useHotkeys } from "../../hooks/use-hot-keys";
import React from "react";
import { cn } from "../../libs/utils";

export type SearchComboboxData = {
  value: string;
  label: string;
  icon: React.ReactNode;
};
type SearchComboboxProps = {
  name: string;
  placeholder?: string;
  data: SearchComboboxData[];
};

export const SearchCombobox = ({
  name,
  data,
  placeholder,
}: SearchComboboxProps) => {
  const [openPopover, setOpenPopover] = React.useState(false);
  const [openTooltip, setOpenTooltip] = React.useState(false);

  const [selectedOption, setSelectedOption] =
    React.useState<SearchComboboxData | null>(null);

  const [searchValue, setSearchValue] = React.useState("");

  const isSearching = searchValue.length > 0;

  useHotkeys([
    [
      "p",
      () => {
        setOpenTooltip(false);
        setOpenPopover(true);
      },
    ],
  ]);

  return (
    <Popover open={openPopover} onOpenChange={setOpenPopover}>
      <Tooltip
        delayDuration={500}
        open={openTooltip}
        onOpenChange={setOpenTooltip}
      >
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              aria-label={name}
              variant="ghost"
              size="sm"
              className="w-fit border-1 px-2 h-8 text-[0.8125rem] leading-normal font-medium text-primary"
            >
              {selectedOption && selectedOption.value !== "no-priority" ? (
                <>
                  <div
                    className={cn(
                      "mr-2 size-4",
                      selectedOption.value !== "urgent" && "fill-primary"
                    )}
                    aria-hidden="true"
                  >
                    {selectedOption.icon}
                  </div>
                  {selectedOption.label}
                </>
              ) : (
                <>
                  <NoOptionIcon
                    className="mr-2 size-4 fill-primary"
                    aria-hidden="true"
                  />
                  <p>{name}</p>
                </>
              )}
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent
          hideWhenDetached
          side="bottom"
          align="start"
          sideOffset={6}
          className="flex items-center gap-2 bg-background border text-xs px-2 h-8"
        >
          <span className="text-primary">Change priority</span>
          <Kbd>P</Kbd>
        </TooltipContent>
      </Tooltip>
      <PopoverContent
        className="w-[206px] p-0 rounded-lg"
        align="start"
        onCloseAutoFocus={(e) => e.preventDefault()}
        sideOffset={6}
      >
        <Command className="rounded-lg">
          <CommandInput
            value={searchValue}
            onValueChange={(searchValue) => {
              // If the user types a number, select the priority like useHotkeys
              if ([0, 1, 2, 3, 4].includes(Number.parseInt(searchValue))) {
                setSelectedOption(data[Number.parseInt(searchValue)]);
                setOpenTooltip(false);
                setOpenPopover(false);
                setSearchValue("");
                return;
              }
              setSearchValue(searchValue);
            }}
            className="text-[0.8125rem] leading-normal"
            placeholder={placeholder}
          >
            {!isSearching && <Kbd>P</Kbd>}
          </CommandInput>
          <CommandList>
            <CommandGroup>
              {data.map((option, index) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(value) => {
                    setSelectedOption(
                      data.find((p) => p.value === value) || null
                    );
                    setOpenTooltip(false);
                    setOpenPopover(false);
                    setSearchValue("");
                  }}
                  className="group rounded-md flex justify-between items-center w-full text-[0.8125rem] leading-normal text-primary"
                >
                  <div className="flex items-center">
                    <div className="mr-2 size-4 fill-muted-foreground group-hover:fill-primary">
                      {option.icon}
                    </div>

                    <span>{option.label}</span>
                  </div>
                  <div className="flex items-center">
                    {selectedOption?.value === option.value && (
                      <CheckIcon className="mr-3 size-4 fill-muted-foreground group-hover:fill-primary" />
                    )}
                    {!isSearching && <span className="text-xs">{index}</span>}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
