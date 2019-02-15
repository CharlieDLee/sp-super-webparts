const iconPdfLarge: any = require("../assets/icon_PDF_Large.png");
const iconWordLarge: any = require("../assets/icon_word_Large.png");
const iconExcelLarge: any = require("../assets/icon_excel_Large.png");
const iconPngLarge: any = require("../assets/icon_png_Large.png");
const iconPptLarge: any = require("../assets/icon_PowerPoint_Large.png");
const iconDocumentLarge: any = require("../assets/icon_Document_Large.png");

/**
 * Function to get file icon by its extension
*/
export function getFileIcon(extension: string): any {
  // find the relevant icon for that extension
  switch (extension) {
      case "pdf":
          return iconPdfLarge;
      case "docx":
      case "doc":
          return iconWordLarge;
      case "xlsx":
      case "xls":
          return iconExcelLarge;
      case "png":
          return iconPngLarge;
      case "pptx":
      case "ppt":
          return iconPptLarge;
      default:
          return iconDocumentLarge;
  }

}