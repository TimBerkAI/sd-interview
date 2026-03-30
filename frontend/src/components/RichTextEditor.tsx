import { useEffect, useRef } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const TOOLBAR_BUTTONS = [
  { cmd: 'bold', label: '<strong>B</strong>', title: 'Bold' },
  { cmd: 'italic', label: '<em>I</em>', title: 'Italic' },
  { cmd: 'underline', label: '<u>U</u>', title: 'Underline' },
  { cmd: 'insertUnorderedList', label: '&#8226; List', title: 'Bullet list' },
  { cmd: 'insertOrderedList', label: '1. List', title: 'Ordered list' },
];

export function RichTextEditor({ value, onChange, placeholder = 'Enter description...', minHeight = '120px' }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (editorRef.current && !isInitialized.current) {
      editorRef.current.innerHTML = value || '';
      isInitialized.current = true;
    }
  }, []);

  useEffect(() => {
    if (editorRef.current && isInitialized.current) {
      const current = editorRef.current.innerHTML;
      if (current !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const execCmd = (cmd: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800 focus-within:ring-2 focus-within:ring-gray-900/20 dark:focus-within:ring-white/20 transition-all">
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        {TOOLBAR_BUTTONS.map((btn) => (
          <button
            key={btn.cmd}
            type="button"
            title={btn.title}
            onMouseDown={(e) => {
              e.preventDefault();
              execCmd(btn.cmd);
            }}
            className="px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            dangerouslySetInnerHTML={{ __html: btn.label }}
          />
        ))}
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder={placeholder}
        className="px-3 py-2 text-sm text-gray-900 dark:text-white outline-none leading-relaxed prose dark:prose-invert prose-sm max-w-none [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-gray-400"
        style={{ minHeight }}
      />
    </div>
  );
}
