import sanitizeHtml from "sanitize-html";

export const useSanitizeHtml = (html: string) => {
  return sanitizeHtml(html, {
    allowedTags: [],
    allowedAttributes: {},
  });
};
