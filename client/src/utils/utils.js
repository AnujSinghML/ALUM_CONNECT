export const formatDate = (dateString) => new Date(dateString).toLocaleDateString();
export const timeAgo = (dateString) => `${Math.floor((new Date() - new Date(dateString)) / 60000)} min ago`;
