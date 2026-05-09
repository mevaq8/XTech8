import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, Heading1, Heading2, List, ListOrdered } from "lucide-react";

interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TipTapEditor({ value, onChange, placeholder = "Mətn daxil edin..." }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-slate-900 focus-within:border-transparent">
      <div className="flex items-center gap-1 px-3 py-2 border-b border-slate-100 bg-slate-50">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive("bold") ? "bg-slate-200 text-slate-900" : "text-slate-500 hover:bg-slate-100"}`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive("italic") ? "bg-slate-200 text-slate-900" : "text-slate-500 hover:bg-slate-100"}`}
        >
          <Italic className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-slate-200 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive("heading", { level: 1 }) ? "bg-slate-200 text-slate-900" : "text-slate-500 hover:bg-slate-100"}`}
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive("heading", { level: 2 }) ? "bg-slate-200 text-slate-900" : "text-slate-500 hover:bg-slate-100"}`}
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-slate-200 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive("bulletList") ? "bg-slate-200 text-slate-900" : "text-slate-500 hover:bg-slate-100"}`}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive("orderedList") ? "bg-slate-200 text-slate-900" : "text-slate-500 hover:bg-slate-100"}`}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>
      <EditorContent editor={editor} className="prose prose-sm max-w-none p-4 min-h-[200px] tiptap" />
    </div>
  );
}
