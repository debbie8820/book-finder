module.exports = (PAGE_LIMIT, count, pageNum) => {
  const page = Number(pageNum) || 1
  const pages = Math.ceil(count / PAGE_LIMIT)
  const totalPages = Array.from({ length: pages }).map((e, i) => { return i + 1 })
  const pre = page - 1 < 1 ? 1 : page - 1
  const next = page + 1 > pages ? pages : page + 1

  return { page, pages, totalPages, pre, next }
}