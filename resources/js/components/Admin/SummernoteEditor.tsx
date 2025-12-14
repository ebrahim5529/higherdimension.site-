import { useEffect, useRef } from "react";

interface SummernoteEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  height?: number;
}

declare global {
  interface Window {
    $: any;
    jQuery: any;
  }
}

export function SummernoteEditor({
  value = "",
  onChange,
  placeholder = "أدخل النص هنا...",
  height = 300,
}: SummernoteEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const summernoteInstance = useRef<any>(null);

  useEffect(() => {
    if (!editorRef.current || typeof window.$ === "undefined") return;

    // Initialize Summernote
    if (summernoteInstance.current) {
      summernoteInstance.current.summernote("destroy");
    }

    summernoteInstance.current = window.$(editorRef.current).summernote({
      lang: "ar-AR",
      height: height,
      placeholder: placeholder,
      toolbar: [
        ["style", ["style"]],
        ["font", ["bold", "italic", "underline", "clear"]],
        ["fontname", ["fontname"]],
        ["fontsize", ["fontsize"]],
        ["color", ["color"]],
        ["para", ["ul", "ol", "paragraph"]],
        ["table", ["table"]],
        ["insert", ["link", "picture", "video"]],
        ["view", ["fullscreen", "codeview", "help"]],
      ],
      callbacks: {
        onChange: function (contents: string) {
          if (onChange) {
            onChange(contents);
          }
        },
      },
    });

    // Set initial value
    if (value) {
      window.$(editorRef.current).summernote("code", value);
    }

    return () => {
      if (summernoteInstance.current) {
        try {
          summernoteInstance.current.summernote("destroy");
        } catch (e) {
          console.error("Error destroying summernote:", e);
        }
      }
    };
  }, []);

  // Update value when prop changes
  useEffect(() => {
    if (summernoteInstance.current && value !== undefined) {
      const currentValue = window.$(editorRef.current).summernote("code");
      if (currentValue !== value) {
        window.$(editorRef.current).summernote("code", value);
      }
    }
  }, [value]);

  return (
    <textarea
      ref={editorRef}
      className="summernote-editor"
      defaultValue={value}
      dir="rtl"
    />
  );
}

