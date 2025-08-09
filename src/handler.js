const books = require('./books')
const { nanoid } = require('nanoid')

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading
  } = request.payload
  const id = nanoid(16)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  if(!name) {
    return h.
      response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku'
      })
      .code(400)
  }

  if(readPage > pageCount) {
    return h.
      response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
      })
      .code(400)
  }

  const finished = pageCount === readPage
  const newBook = {
    name, year, author, summary, publisher, pageCount, readPage, finished, reading, id, insertedAt, updatedAt
  }

  books.push(newBook)

  const isSuccess = books.filter((book) => book.id === id).length > 0

  if(isSuccess) {
    return h
      .response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id
        }
      })
      .code(201)
  }

  return h
  .response({
    status: 'fail',
    message: 'Buku gagal ditambahkan'
  })
  .code(500)
}

const getAllHandler = (request, h) => {
  const { name, reading, finished } = request.query

  let filteredBooks = books

  if (name) {
    const lowerName = name.toLowerCase()
    filteredBooks = filteredBooks.filter(book =>
      book.name.toLowerCase().includes(lowerName)
    )
  }

  if (reading !== undefined) {
    const isReading = reading === '1' ? true : false
    filteredBooks = filteredBooks.filter(book => book.reading === isReading)
  }

  if (finished !== undefined) {
    const isFinished = finished === '1' ? true : false
    filteredBooks = filteredBooks.filter(book => book.finished === isFinished)
  }

  // Ambil hanya field id, name, dan publisher
  const selectedBooks = filteredBooks.map(book => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher
  }))

  return h
    .response({
      status: 'success',
      data: { books: selectedBooks }
    })
    .code(200)
}

const getBookByIdHandler = (request, h) => {
  const { id } = request.params
  const book = books.find(book => book.id === id)

  if (!book) {
    return h
      .response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
      })
      .code(404)
  }

  const finished = book.pageCount === book.readPage

  return h
    .response({
      status: 'success',
      data: {
        book: {
          id: book.id,
          name: book.name,
          year: book.year,
          author: book.author,
          summary: book.summary,
          publisher: book.publisher,
          pageCount: book.pageCount,
          readPage: book.readPage,
          finished,
          reading: book.reading,
          insertedAt: book.insertedAt,
          updatedAt: book.updatedAt
        }
      }
    })
    .code(200)
}

const editBookByIdHandler = (request, h) => {
  const { id } = request.params
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading
  } = request.payload

  if(!name) {
    return h.
      response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku'
      })
      .code(400)
  }

  if(readPage > pageCount) {
    return h.
      response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
      })
      .code(400)
  }

  const index = books.findIndex(book => book.id === id)
  if(index < 0) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
      })
      .code(404)
  }

  const finished = pageCount === readPage
  const updatedAt = new Date().toISOString()
  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    updatedAt
  }

  return h
    .response({
        status: 'success',
        message: 'Buku berhasil diperbarui'
    })
    .code(200)
}

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params

  const index = books.findIndex((book) => book.id === id)

  if (index !== -1) {
      books.splice(index, 1)

      return h
          .response({
              status: 'success',
              message: 'Buku berhasil dihapus'
          })
          .code(200)
  }
  return h
      .response({
          status: 'fail',
          message: 'Buku gagal dihapus. Id tidak ditemukan'
      })
      .code(404)
}

module.exports = {
  addBookHandler,
  getAllHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
}
