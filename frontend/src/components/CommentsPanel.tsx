import { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';

interface CommentsPanelProps {
  comment: string;
  onCommentChange: (comment: string) => void;
}

export function CommentsPanel({ comment, onCommentChange }: CommentsPanelProps) {
  const [text, setText] = useState(comment);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setText(comment);
  }, [comment]);

  const handleChange = (newText: string) => {
    setText(newText);

    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    const timeout = setTimeout(() => {
      onCommentChange(newText);
    }, 1000);

    setSaveTimeout(timeout);
  };

  return (
    <div className="flex-1 flex flex-col p-4 overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-4 h-4 text-gray-400" />
        <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
          Comments
        </h3>
      </div>

      <textarea
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Add your feedback here..."
        className="flex-1 bg-gray-700/50 border border-gray-600 rounded-xl p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
      />
    </div>
  );
}
