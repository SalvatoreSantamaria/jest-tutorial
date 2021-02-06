// WITHOUT MOCKS: WILL FAIL AND USING ACTUAL API AND DATABASE
// //import service that we want to Test 
// const bookService = require('../src/book.service')

// describe ('searchBook', () => {
//     describe ('when one book matches the search text', () => {
//         it ('should return 1 book', () => {
//             const books = bookService.searchBooks();
//             expect(books.length).toBe(1)
//         })
//     })
// })
//_______________________________________________________________________________

// WITH MOCKS
//import service that we want to Test 
const bookService = require('../src/book.service');

//Mock booksProvider 1: import the provider
const booksProvider = require('../src/books-provider');
const emailService = require('../src/email.service')

describe ('searchBook', () => {
    describe ('when one book matches the search text', () => {
        
        beforeEach(() => {
            // Mock booksProvider 2: Mock booksProvider by setting it to jest.fn, and make it return an array with an object
            // the object has some mock data
            booksProvider.getBooks = jest.fn(() => [
                {
                    _id: 1, 
                    title: 'Test book',
                    publishedDate: '2009-04-01T00:00:00.000-0700'
                }
            ]);
            // Mock emailService, and make it return
            emailService.sendMissingBookEmail = jest.fn()
        })
        
        it ('should return 1 book', () => {
            // Mock booksProvider 3: call the function searchBooks, which uses
            // the booksProvider.getBooks function
            const books = bookService.searchBooks('Test');
            expect(books.length).toBe(1)
        })

        it ('should return the correct book title', () => {
            const books = bookService.searchBooks('Test');
            // logic in the function returns title AND year
            expect(books[0].title).toBe('Test book 2009')
        })
    })

    describe ('when zero books matches the search text', () => {
        
        beforeEach(() => {
            booksProvider.getBooks = jest.fn(() => [
                {
                    _id: 1, 
                    title: 'Test book',
                    publishedDate: '2009-04-01T00:00:00.000-0700'
                }
            ]);
            emailService.sendMissingBookEmail = jest.fn()
        })

        it ('should return 0 books', () => {
            const books = bookService.searchBooks('Another');
            expect(books.length).toBe(0)
        });

        it ('should call send email function', () => {
            bookService.searchBooks('Another');
            expect(emailService.sendMissingBookEmail).toHaveBeenCalled();
        })
    })
})