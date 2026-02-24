// PlateEditor.tsx
'use client';

import * as React from 'react';
import {
	createSlateEditor,
	deserializeHtml,
	serializeHtml,
	type Value,
} from 'platejs';
import { Plate, usePlateEditor } from 'platejs/react';

import { EditorKit } from './editor-kit';
import { SettingsDialog } from './settings-dialog';
import { Editor, EditorContainer } from '../ui/editor';
import { BaseEditorKit } from './editor-base-kit';
import { EditorStatic } from '../ui/editor-static';

export interface PlateEditorHandle {
	getContent: () => Promise<string>;
}

interface PlateEditorProps {
	initialValue?: string;
}

export const PlateEditor = React.forwardRef<
	PlateEditorHandle,
	PlateEditorProps
>(({ initialValue }, ref) => {
	const baseEditor = React.useMemo(
		() => createSlateEditor({ plugins: BaseEditorKit }),
		[],
	);

	const deserializedValue = React.useMemo(() => {
		if (!initialValue) {
			return [
				{
					type: 'p',
					children: [{ text: '' }],
				},
			];
		}
		return deserializeHtml(baseEditor, { element: initialValue });
	}, [initialValue, baseEditor]);

	const editor = usePlateEditor({
		plugins: EditorKit,
		value: deserializedValue as Value,
	});

	React.useImperativeHandle(ref, () => ({
		getContent: () => {
			const slateValue = editor.children;

			const tmpEditor = createSlateEditor({
				plugins: BaseEditorKit,
				value: slateValue,
			});

			return serializeHtml(tmpEditor, { editorComponent: EditorStatic });
		},
	}));

	return (
		<Plate editor={editor}>
			<EditorContainer>
				<Editor variant="demo" />
			</EditorContainer>
			<SettingsDialog />
		</Plate>
	);
});

PlateEditor.displayName = 'PlateEditor';
