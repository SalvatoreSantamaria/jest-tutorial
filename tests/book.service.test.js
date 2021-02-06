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

        it ('should return the correct book title with the title and publish data concatenated', () => {
            const books = bookService.searchBooks('Test');
            // logic in the function returns title AND year
            expect(books[0].title).toBe('Test book 2009')
        })

        // same as above but with toMatchObject
        it ('should return the correct book title with the title and publish data concatenated', () => {
            const books = bookService.searchBooks('Test');
            // logic in the function returns title AND year
            expect(books[0]).toMatchObject(
                { title: 'Test book 2009' }
                )
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

describe ('getMostPopularBook', () => {
    describe('when two books are given', () => {

    beforeEach(() => {
    // Mock the getBooks() function to return the below array containing two objects
        booksProvider.getBooks = jest.fn(() => [
            {
                _id: 1,
                ordered: 100,
            },
            {
                _id: 2,
                ordered: 50
            }
        ])
    })

        it('should return the book with the highest order count', () => {
            //getMostPopularBook just returns the order of the most popular book
            const book = bookService.getMostPopularBook();
            expect(book._id).toBe(1)
        })
    })
})


describe ('calculateDiscount', () => {
    describe('when a book is given with id', () => {
        beforeEach(() => {
            // Mock, getting from the database
            booksProvider.getBooks = jest.fn(() => [
                {
                    _id: 1,
                    price: 100
                },
            ])
        })

        it ('should return price with 20% discount', () => {
            const price = bookService.calculateDiscount(1)
            expect(price).toBe(80)
        })
    })

    describe('when book with given id not found', () => {
        beforeEach(() => {
            // Mock, getting from the database and returning NO books
            booksProvider.getBooks = jest.fn(() => [])
        })

        it ('should return price with 20% discount', () => {
            expect(() => bookService.calculateDiscount(1)).toThrow('Book with such id not found')
        })
    }) 
})  

// Async
describe ('calculateDiscountAsync', () => {
    describe('when a book is given with id', () => {
        beforeEach(() => {
            // Mock, getting from the database
            booksProvider.getBooks = jest.fn(() => [
                {
                    _id: 1,
                    price: 100
                },
            ])
        })

        it ('should return price with 20% discount', async () => {
            const price = await bookService.calculateDiscountAsync(1)
            expect(price).toBe(80)
        })
    })

    describe('when book with given id not found', () => {
        beforeEach(() => {
            // Mock, getting from the database and returning NO books
            booksProvider.getBooks = jest.fn(() => [])
        })

        it ('should return price with 20% discount', () => {
            expect(async () => await bookService.calculateDiscountAsync(1))
            .rejects
            .toThrow('Book with such id not found')
        })
    }) 
})  
