import { Paperclip } from "lucide-react";

export default function CourseAttachments({ attachments }) {
  if (!attachments || attachments.length === 0) return null;

  return (
    <section className="my-10">
      <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <Paperclip className="w-5 h-5 text-blue-500" />
        Course Attachments
      </h2>
      <ul className="space-y-4">
        {attachments.map((att) => (
          <li key={att.id} className="flex items-center gap-3">
            <a
              href={att.file}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-2 font-medium"
              download
            >
              <Paperclip className="w-4 h-4" />
              {att.description || "Attachment"}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
