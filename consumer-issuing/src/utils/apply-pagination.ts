export function applyPagination<T>(
  documents: T[],
  page: number,
  rowsPerPage: number,
): T[] {
  return documents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
