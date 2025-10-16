'use client';

import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import styles from './Editor.module.scss';

const Toolbar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className={styles.toolbar}>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? styles.isActive : ''}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? styles.isActive : ''}
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? styles.isActive : ''}
      >
        Strike
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive('paragraph') ? styles.isActive : ''}
      >
        Paragraph
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? styles.isActive : ''}
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? styles.isActive : ''}
      >
        H2
      </button>
    </div>
  );
};

/**
 * 공통 에디터 래퍼 컴포넌트
 * @param {Object} props
 * @param {string} props.content - 에디터에 표시될 HTML 문자열
 * @param {Function} props.onChange - 내용이 변경될 때 호출될 콜백 함수 (새로운 HTML 문자열을 인자로 받음)
 * @param {boolean} [props.editable=true] - 에디터 수정 가능 여부
 * @param {Object} [props...rest] - 기타 Tiptap 에디터 옵션
 */
export const Editor = ({ content, onChange, editable = true, ...rest }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || '',
    editable,
    immediatelyRender: false, // SSR Hydration Mismatch 방지
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    ...rest
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  return (
    <div className={styles.editorContainer}>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className={styles.editorContent} />
    </div>
  );
};

export default Editor;
