'use client';

import * as React from 'react';

import {
  BoldPlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  UnderlinePlugin,
} from '@udecode/plate-basic-marks/react';
import {
  FontBackgroundColorPlugin,
  FontColorPlugin,
} from '@udecode/plate-font/react';
import {
  AudioPlugin,
  FilePlugin,
  ImagePlugin,
  VideoPlugin,
} from '@udecode/plate-media/react';
import {
  BaselineIcon,
  BoldIcon,
  ItalicIcon,
  PaintBucketIcon,
  StrikethroughIcon,
  UnderlineIcon,
  WandSparklesIcon,
} from 'lucide-react';


import { AIToolbarButton } from './ai-toolbar-button';
import { AlignDropdownMenu } from './align-dropdown-menu';
import { ColorDropdownMenu } from './color-dropdown-menu';
import { FontSizeToolbarButton } from './font-size-toolbar-button';
import { RedoToolbarButton, UndoToolbarButton } from './history-toolbar-button';
import {
  BulletedIndentListToolbarButton,
  NumberedIndentListToolbarButton,
} from './indent-list-toolbar-button';
import { IndentTodoToolbarButton } from './indent-todo-toolbar-button';
import { IndentToolbarButton } from './indent-toolbar-button';
import { InsertDropdownMenu } from './insert-dropdown-menu';
import { LineHeightDropdownMenu } from './line-height-dropdown-menu';
import { MarkToolbarButton } from './mark-toolbar-button';
import { MediaToolbarButton } from './media-toolbar-button';
import { OutdentToolbarButton } from './outdent-toolbar-button';
import { TableDropdownMenu } from './table-dropdown-menu';
import { ToolbarGroup } from './toolbar';
import { TurnIntoDropdownMenu } from './turn-into-dropdown-menu';

export function FixedToolbarButtons() {

  return (
    <div className="flex w-full">
      <>
        <ToolbarGroup>
          <UndoToolbarButton />
          <RedoToolbarButton />
        </ToolbarGroup>

        <ToolbarGroup>
          <AIToolbarButton tooltip="AI commands">
            <WandSparklesIcon />
          </AIToolbarButton>
        </ToolbarGroup>

        <ToolbarGroup>
          <InsertDropdownMenu />
          <TurnIntoDropdownMenu />
          <FontSizeToolbarButton />
        </ToolbarGroup>

        <ToolbarGroup>
          <MarkToolbarButton nodeType={BoldPlugin.key} tooltip="Bold (⌘+B)">
            <BoldIcon />
          </MarkToolbarButton>

          <MarkToolbarButton
            nodeType={ItalicPlugin.key}
            tooltip="Italic (⌘+I)"
          >
            <ItalicIcon />
          </MarkToolbarButton>

          <MarkToolbarButton
            nodeType={UnderlinePlugin.key}
            tooltip="Underline (⌘+U)"
          >
            <UnderlineIcon />
          </MarkToolbarButton>

          <MarkToolbarButton
            nodeType={StrikethroughPlugin.key}
            tooltip="Strikethrough (⌘+⇧+M)"
          >
            <StrikethroughIcon />
          </MarkToolbarButton>

          <ColorDropdownMenu
            nodeType={FontColorPlugin.key}
            tooltip="Text color"
          >
            <BaselineIcon />
          </ColorDropdownMenu>

          <ColorDropdownMenu
            nodeType={FontBackgroundColorPlugin.key}
            tooltip="Background color"
          >
            <PaintBucketIcon />
          </ColorDropdownMenu>
        </ToolbarGroup>

        <ToolbarGroup>
          <AlignDropdownMenu />

          <NumberedIndentListToolbarButton />
          <BulletedIndentListToolbarButton />
          <IndentTodoToolbarButton />
        </ToolbarGroup>

        <ToolbarGroup>
          <TableDropdownMenu />
        </ToolbarGroup>

        <ToolbarGroup>
          <MediaToolbarButton nodeType={ImagePlugin.key} />
          <MediaToolbarButton nodeType={VideoPlugin.key} />
          <MediaToolbarButton nodeType={AudioPlugin.key} />
          <MediaToolbarButton nodeType={FilePlugin.key} />
        </ToolbarGroup>

        <ToolbarGroup>
          <LineHeightDropdownMenu />
          <OutdentToolbarButton />
          <IndentToolbarButton />
        </ToolbarGroup>
      </>
      <div className="grow" />
    </div>
  );
}
