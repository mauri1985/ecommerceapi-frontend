import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, ListOrdered } from "lucide-react";

export default function EditorDescripcion({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Descripción del producto..." }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[120px] px-3 py-2 outline-none",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-gray-400 rounded overflow-hidden">
      <div className="flex gap-1 border-b bg-slate-50 px-2 py-1.5">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:bg-slate-200 ${
            editor.isActive("bold") ? "bg-slate-300" : ""
          }`}
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:bg-slate-200 ${
            editor.isActive("italic") ? "bg-slate-300" : ""
          }`}
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded hover:bg-slate-200 ${
            editor.isActive("bulletList") ? "bg-slate-300" : ""
          }`}
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded hover:bg-slate-200 ${
            editor.isActive("orderedList") ? "bg-slate-300" : ""
          }`}
        >
          <ListOrdered size={16} />
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
