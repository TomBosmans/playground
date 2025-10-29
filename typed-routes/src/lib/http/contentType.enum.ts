const HttpContentType = {
  JSON: "application/json",
  FORM_URLENCODED: "application/x-www-form-urlencoded",
  MULTIPART_FORM_DATA: "multipart/form-data",
  TEXT_HTML: "text/html",
  TEXT_PLAIN: "text/plain",
  APPLICATION_XML: "application/xml",
  TEXT_XML: "text/xml",
  APPLICATION_OCTET_STREAM: "application/octet-stream",
  IMAGE_PNG: "image/png",
  IMAGE_JPEG: "image/jpeg",
  IMAGE_GIF: "image/gif",
  APPLICATION_PDF: "application/pdf",
  APPLICATION_JAVASCRIPT: "application/javascript",
  TEXT_CSS: "text/css",
  APPLICATION_XHTML_XML: "application/xhtml+xml",
} as const

type HttpContentType = (typeof HttpContentType)[keyof typeof HttpContentType]
export default HttpContentType
