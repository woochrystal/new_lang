'use client';

import { memo, useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';

import styles from './Editor.module.scss';

// extensions를 컴포넌트 외부에서 한 번만 생성하여 재사용
const DEFAULT_EXTENSIONS = [
  StarterKit.configure(),
  Underline,
  TextAlign.configure({
    types: ['heading', 'paragraph']
  })
];

/**
 * 기본 툴바 컴포넌트 (참고용으로 export)
 * @param {Object} props
 * @param {Object} props.editor - Tiptap editor 인스턴스
 */
export const Toolbar = ({ editor }) => {
  const [, forceUpdate] = useState({});

  // 에디터 상태 변경 시 툴바 리렌더링
  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      forceUpdate({});
    };

    editor.on('transaction', handleUpdate);
    editor.on('selectionUpdate', handleUpdate);

    return () => {
      editor.off('transaction', handleUpdate);
      editor.off('selectionUpdate', handleUpdate);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={styles.toolbar}>
      {/* 텍스트 서식 */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? styles.isActive : ''}
        title="굵게 (Ctrl+B)"
      >
        <strong>B</strong>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? styles.isActive : ''}
        title="기울임 (Ctrl+I)"
      >
        <em>I</em>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={editor.isActive('underline') ? styles.isActive : ''}
        title="밑줄 (Ctrl+U)"
      >
        <u>U</u>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? styles.isActive : ''}
        title="취소선"
      >
        <s>S</s>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? styles.isActive : ''}
        title="인라인 코드"
      >
        {'</>'}
      </button>

      <span className={styles.divider} />

      {/* 문단 스타일 */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive('paragraph') ? styles.isActive : ''}
        title="본문"
      >
        본문
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? styles.isActive : ''}
        title="제목 1"
      >
        H1
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? styles.isActive : ''}
        title="제목 2"
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? styles.isActive : ''}
        title="제목 3"
      >
        H3
      </button>

      <span className={styles.divider} />

      {/* 정렬 */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={editor.isActive({ textAlign: 'left' }) ? styles.isActive : ''}
        title="왼쪽 정렬"
      >
        ←
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={editor.isActive({ textAlign: 'center' }) ? styles.isActive : ''}
        title="가운데 정렬"
      >
        ↔
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={editor.isActive({ textAlign: 'right' }) ? styles.isActive : ''}
        title="오른쪽 정렬"
      >
        →
      </button>

      <span className={styles.divider} />

      {/* 목록 */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? styles.isActive : ''}
        title="글머리 기호 목록"
      >
        • 목록
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? styles.isActive : ''}
        title="번호 매기기 목록"
      >
        1. 목록
      </button>

      <span className={styles.divider} />

      {/* 실행취소/다시실행 */}
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        title="실행취소 (Ctrl+Z)"
      >
        ↶
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        title="다시실행 (Ctrl+Y)"
      >
        ↷
      </button>
    </div>
  );
};

/**
 * 공통 에디터 래퍼 컴포넌트
 * @param {Object} props
 * @param {string} props.content - 에디터에 표시될 HTML 문자열
 * @param {Function} props.onChange - 내용이 변경될 때 호출될 콜백 함수 (새로운 HTML 문자열을 인자로 받음)
 * @param {boolean} [props.editable] - 에디터 수정 가능 여부 (기본값: true)
 * @param {string} [props.id] - 에디터 요소의 ID (label과 동일하게 설정하면 자동으로 aria-labelledby 처리)
 * @param {Array} [props.extensions] - Tiptap extensions 배열 (기본값: StarterKit, Underline, TextAlign)
 * @param {Function|React.Component} [props.toolbar] - 커스텀 툴바 컴포넌트 (editor를 인자로 받는 함수 또는 컴포넌트)
 * @param {number} [props.height] - 에디터 고정 높이 (px, 내용이 넘치면 스크롤, 기본값: 300px)
 * @param {...*} [rest] - 기타 Tiptap 에디터 옵션
 */
// memo 비교 함수: content와 editable만 비교하고 onChange는 무시
const arePropsEqual = (prevProps, nextProps) => {
  return (
    prevProps.content === nextProps.content &&
    prevProps.editable === nextProps.editable &&
    prevProps.height === nextProps.height &&
    prevProps.id === nextProps.id
  );
};

export const Editor = memo(({ content, onChange, editable = true, id, extensions, toolbar, height = 300, ...rest }) => {
  const editor = useEditor(
    {
      extensions: extensions || DEFAULT_EXTENSIONS,
      content: content || '',
      editable,
      immediatelyRender: false, // SSR Hydration Mismatch 방지
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
      },
      ...rest
    },
    []
  ); // 빈 의존성 배열: 초기 마운트 시에만 editor 생성

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  return (
    <div className={styles.editorContainer}>
      {toolbar ? toolbar(editor) : <Toolbar editor={editor} />}
      <EditorContent
        editor={editor}
        id={id}
        aria-labelledby={id}
        {...rest}
        className={styles.editorContent}
        style={{
          minHeight: `${height}px`,
          '--editor-height': `${height}px`
        }}
      />
    </div>
  );
}, arePropsEqual);

Editor.displayName = 'Editor';

export default Editor;
