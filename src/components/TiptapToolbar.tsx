'use client';

import { Editor } from '@tiptap/react';
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaListUl,
  FaListOl,
  FaQuoteLeft,
} from 'react-icons/fa';

interface TiptapToolbarProps {
  editor: Editor | null;
}

export default function TiptapToolbar({ editor }: TiptapToolbarProps) {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded-t-lg border-b border-gray-300">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded ${editor.isActive('bold') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
        aria-label="Bold"
      >
        <FaBold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded ${editor.isActive('italic') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
        aria-label="Italic"
      >
        <FaItalic />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 rounded ${editor.isActive('strike') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
        aria-label="Strikethrough"
      >
        <FaStrikethrough />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
        aria-label="Bullet List"
      >
        <FaListUl />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
        aria-label="Ordered List"
      >
        <FaListOl />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded ${editor.isActive('blockquote') ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
        aria-label="Blockquote"
      >
        <FaQuoteLeft />
      </button>
    </div>
  );
}
