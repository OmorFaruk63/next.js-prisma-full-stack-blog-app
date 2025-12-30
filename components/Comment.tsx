// components/Comment.tsx  ← reusable component
import { format } from "date-fns";
import Image from "next/image";

type CommentProps = {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    name: string | null;
    image: string | null;
  };
  isReply?: boolean; // just for styling (left gap + smaller size)
  level?: number; // optional - for deeper nesting in future
};

export default function Comment({
  id,
  content,
  createdAt,
  user,
  isReply = false,
  level = 0,
}: CommentProps) {
  return (
    <div
      className={`
        relative flex gap-4 group
        ${isReply ? "ml-10" : "ml-0"}
      `}
    >
      {/* Vertical connecting line for replies */}
      {isReply && (
        <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-700 to-transparent" />
      )}

      {/* Avatar */}
      <div className="flex-shrink-0 pt-1">
        {user.image ? (
          <div className="relative">
            <Image
              src={user.image}
              alt={user.name || "User"}
              width={isReply ? 36 : 44}
              height={isReply ? 36 : 44}
              className={`
                rounded-full object-cover ring-2 transition-all duration-300
                ${
                  isReply
                    ? "ring-purple-500/30"
                    : "ring-cyan-500/40 group-hover:ring-cyan-500/70"
                }
              `}
            />
            <div className="absolute inset-0 rounded-full bg-linear-to-r from-cyan-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ) : (
          <div
            className={`
              rounded-full flex items-center justify-center text-white font-bold
              ${
                isReply
                  ? "w-9 h-9 text-base bg-purple-700"
                  : "w-11 h-11 text-lg bg-linear-to-r from-purple-600 to-pink-600"
              }
            `}
          >
            {(user.name || "U")[0].toUpperCase()}
          </div>
        )}
      </div>

      {/* Content bubble */}
      <div className="flex-1">
        <div
          className={`
            bg-gray-800/50 backdrop-blur-sm rounded-xl p-4
            border border-gray-700/50
            transition-all duration-200
            group-hover:border-cyan-500/40 group-hover:bg-gray-800/70
            ${isReply ? "text-sm" : "text-base"}
          `}
        >
          {/* Metadata */}
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="font-medium text-gray-100 group-hover:text-cyan-300 transition-colors">
              {user.name || "Anonymous"}
            </span>
            <span className="text-xs text-gray-500">•</span>
            <time className="text-xs text-gray-500">
              {format(new Date(createdAt), "MMM d, yyyy • HH:mm")}
            </time>
          </div>

          {/* Comment content */}
          <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
        </div>

        {/* Reply button (only for top-level or controlled by parent) */}
        {/* {!isReply && (
          <button
            className="
              mt-2 text-xs text-cyan-400 hover:text-cyan-300 
              transition-colors duration-200
            "
            // onClick={() => handleReplyToggle(id)}
          >
            Reply
          </button>
        )} */}
      </div>
    </div>
  );
}
