'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Quote,
    Heading1,
    Heading2,
    Link as LinkIcon,
    Image as ImageIcon,
    Undo,
    Redo,
    Code
} from 'lucide-react';
import { useCallback } from 'react';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder = 'Write your story...' }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-500 hover:underline',
                },
            }),
            Placeholder.configure({
                placeholder,
                emptyEditorClass: 'is-editor-empty before:content-[attr(data-placeholder)] before:text-gray-400 before:float-left before:h-0 before:pointer-events-none',
            }),
        ],
        content,
        editorProps: {
            attributes: {
                class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[300px] px-4 py-4',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        immediatelyRender: false,
    });

    const setLink = useCallback(() => {
        if (!editor) return;

        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    const addImage = useCallback(() => {
        if (!editor) return;

        const url = window.prompt('Image URL');

        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    }, [editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 dark:border-gray-700 dark:bg-gray-800">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50/50 p-2 dark:border-gray-700 dark:bg-gray-900/50">
                <ToolButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    icon={<Bold className="h-4 w-4" />}
                    label="Bold"
                />
                <ToolButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    icon={<Italic className="h-4 w-4" />}
                    label="Italic"
                />
                <div className="mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600" />
                <ToolButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive('heading', { level: 1 })}
                    icon={<Heading1 className="h-4 w-4" />}
                    label="H1"
                />
                <ToolButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    icon={<Heading2 className="h-4 w-4" />}
                    label="H2"
                />
                <div className="mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600" />
                <ToolButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    icon={<List className="h-4 w-4" />}
                    label="Bullet List"
                />
                <ToolButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    icon={<ListOrdered className="h-4 w-4" />}
                    label="Ordered List"
                />
                <div className="mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600" />
                <ToolButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                    icon={<Quote className="h-4 w-4" />}
                    label="Quote"
                />
                <ToolButton
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    isActive={editor.isActive('codeBlock')}
                    icon={<Code className="h-4 w-4" />}
                    label="Code"
                />
                <div className="mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600" />
                <ToolButton
                    onClick={setLink}
                    isActive={editor.isActive('link')}
                    icon={<LinkIcon className="h-4 w-4" />}
                    label="Link"
                />
                <ToolButton
                    onClick={addImage}
                    isActive={false}
                    icon={<ImageIcon className="h-4 w-4" />}
                    label="Image"
                />
                <div className="ml-auto flex items-center gap-1">
                    <ToolButton
                        onClick={() => editor.chain().focus().undo().run()}
                        isActive={false}
                        icon={<Undo className="h-4 w-4" />}
                        label="Undo"
                    />
                    <ToolButton
                        onClick={() => editor.chain().focus().redo().run()}
                        isActive={false}
                        icon={<Redo className="h-4 w-4" />}
                        label="Redo"
                    />
                </div>
            </div>

            <EditorContent editor={editor} />
        </div>
    );
}

interface ToolButtonProps {
    onClick: () => void;
    isActive: boolean;
    icon: React.ReactNode;
    label: string;
}

function ToolButton({ onClick, isActive, icon, label }: ToolButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={label}
            className={`rounded p-2 transition-colors ${isActive
                ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400'
                : 'text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
        >
            {icon}
        </button>
    );
}
