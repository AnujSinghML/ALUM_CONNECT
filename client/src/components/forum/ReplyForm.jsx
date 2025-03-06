// import React, { useState } from "react";
// import axios from "axios";

// const ReplyForm = ({ postId, setReplies, user }) => {
//   const [replyContent, setReplyContent] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleReplySubmit = async (e) => {
//     e.preventDefault();
    
//     if (!replyContent.trim()) return;
//     if (!user) {
//       alert("You must be logged in to reply");
//       return;
//     }
    
//     setIsSubmitting(true);

//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_backend_URL}/api/forum/posts/${postId}/replies`,
//         { content: replyContent, userId: user.id, username: user.name },
//         { withCredentials: true }
//       );

//       setReplies(response.data);
//       setReplyContent("");
//     } catch (error) {
//       console.error("❌ Error posting reply:", error);
//       alert("Failed to post reply. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <form onSubmit={handleReplySubmit} className="mt-4 border-t border-gray-100 pt-4">
//       <div className="space-y-3">
//         <textarea
//           className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
//           placeholder="Write your reply..."
//           value={replyContent}
//           onChange={(e) => setReplyContent(e.target.value)}
//           rows="3"
//           disabled={isSubmitting}
//         />
        
//         <div className="flex justify-end">
//           <button 
//             type="submit" 
//             className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${
//               isSubmitting 
//                 ? "bg-blue-400 cursor-not-allowed" 
//                 : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//             }`}
//             disabled={isSubmitting || !replyContent.trim()}
//           >
//             {isSubmitting ? "Posting..." : "Post Reply"}
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default ReplyForm;

import React, { useState } from "react";
import axios from "axios";

const ReplyForm = ({ 
  postId, 
  setReplies, 
  user, 
  parentReplyId = null, 
  onCancel = null,
  isNested = false
}) => {
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    
    if (!replyContent.trim()) return;
    if (!user) {
      alert("You must be logged in to reply");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_backend_URL}/api/forum/posts/${postId}/replies`,
        { 
          content: replyContent, 
          userId: user.id, 
          username: user.name,
          parentReplyId
        },
        { withCredentials: true }
      );
      setReplies(response.data);
      setReplyContent("");
      
      // If this is a nested reply form, close it after submission
      if (onCancel) {
        onCancel();
      }
    } catch (error) {
      console.error("❌ Error posting reply:", error);
      alert("Failed to post reply. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleReplySubmit} className={isNested ? "" : "mt-4 border-t border-gray-100 pt-4"}>
      <div className="space-y-3">
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
          placeholder="Write your reply..."
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          rows="3"
          disabled={isSubmitting}
        />
        
        <div className="flex justify-end space-x-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-md text-gray-700 font-medium border border-gray-300 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          )}
          <button 
            type="submit" 
            className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${
              isSubmitting 
                ? "bg-blue-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            }`}
            disabled={isSubmitting || !replyContent.trim()}
          >
            {isSubmitting ? "Posting..." : "Post Reply"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ReplyForm;