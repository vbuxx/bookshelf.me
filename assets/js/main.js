const buttonAdd = document.querySelector(".button-add");
const buttonClear = document.querySelector(".button-clear");
const formContainer = document.querySelector(".form-container");
const saveBook = document.getElementById("bookSubmit");

// web storage requirement
const localStorageKey = "bookshelfApp";
let bookshelfApp = [];

// check browser support storage
const checkSupportedStorage = () => {
    return typeof Storage !== undefined;
};

if (checkSupportedStorage()) {
    if (localStorage.getItem(localStorageKey) === null) {
        bookshelfApp = [];
    } else {
        bookshelfApp = JSON.parse(localStorage.getItem(localStorageKey));
    }
    localStorage.setItem(localStorageKey, JSON.stringify(bookshelfApp));
}



// search book by title
const searchBook = (findTitle) => {
    const find = bookshelfApp.filter(book => book.title.toLowerCase().includes(findTitle.toLowerCase()));
    renderBooks(find);
    showClearBtn();
};

// show Clear Btn
const showClearBtn = () => {
    const clearBtn = document.getElementById("clear");
    clearBtn.style.display = "block";
    clearBtn.addEventListener("click", () => {
        clearForm();
        clearBtn.style.display = "none";
    });
}

// clear search form
const clearForm = () => {
    const searchInputs = document.querySelectorAll("input");
    searchInputs.forEach((input) => (input.value = ""));
}



// searchForm event handler
searchBookForm = document.getElementById("searchBook");
searchBookForm.addEventListener("submit", (e) => {
    const titleVal = document.querySelector("#searchBookTitle").value;
    console.log(titleVal);
    e.preventDefault();
    searchBook(titleVal);

});

// add book to localStorage
const addBook = (Obj, localStorageKey) => {
    bookshelfApp.push(Obj);
    localStorage.setItem(localStorageKey, JSON.stringify(bookshelfApp));
};

// delete book from localStorage
const deleteBook = (book) => {
    bookshelfApp.splice(book, 1);
    localStorage.setItem(localStorageKey, JSON.stringify(bookshelfApp));
    renderBooks(bookshelfApp);
};

// move to Finished Read
const finishedRead = (book) => {
    bookshelfApp[book].isComplete = true;
    localStorage.setItem(localStorageKey, JSON.stringify(bookshelfApp));
    renderBooks(bookshelfApp);
};

// move to Book List
const unfinishedRead = (book) => {
    bookshelfApp[book].isComplete = false;
    localStorage.setItem(localStorageKey, JSON.stringify(bookshelfApp));
    renderBooks(bookshelfApp);
};

// display book to html
const unfinishedReadId = "unfinished-read";
const finishedReadId = "finished-read";

const renderBooks = (bookshelfApp) => {
    const books = bookshelfApp;

    const listUnfinished = document.getElementById(unfinishedReadId);
    const listFinished = document.getElementById(finishedReadId);

    listUnfinished.innerHTML = "";
    listFinished.innerHTML = "";

    for (let book of books.keys()) {
        const listGroupItem = document.createElement("article");
        const bookDetails = document.createElement("div");
        const bookAction = document.createElement("div");
        const buttonRead = document.createElement("button");

        listGroupItem.classList.add("list-item", "container", "row", 'mb-2');
        bookDetails.classList.add('book-details', 'col-md-9', 'col-xs-12', 'mb-1');
        bookDetails.innerHTML = `<h5 class="title">${books[book].title}</h5>
		                     <div class="author">Author : ${books[book].author}</div>
		                     <div class="year">Published : ${books[book].year}</div>`;


        if (books[book].isComplete) {
            buttonRead.classList.add("button-finish", "btn");
            buttonRead.innerHTML = "Unfinished";
            buttonRead.addEventListener("click", () => {
                unfinishedRead(book);
            });
        } else {
            buttonRead.classList.add("button-unfinish", "btn");
            buttonRead.innerHTML = "Finished";
            buttonRead.addEventListener("click", () => {
                finishedRead(book);
            });
        }
        const buttonDelete = document.createElement("button");
        buttonDelete.classList.add("button-delete", "btn");
        buttonDelete.innerHTML = "Delete";
        buttonDelete.addEventListener("click", () => {
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to get back the book?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Delete Book',
                buttonsStyling: false,
                reverseButtons: true,
                customClass: {
                    cancelButton: 'btn cancel-btn swal-btn',
                    confirmButton: 'btn remove-btn swal-btn',
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Book deleted from the shelf!',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        buttonsStyling: false,
                        customClass: {
                            confirmButton: 'btn finished-btn swal-btn',
                        },
                    });

                    deleteBook(book);
                }
            });
        });

        bookAction.classList.add("book-action", "col-xs-12", "col-md-3", "d-flex", "align-items-center", "justify-content-evenly");

        bookAction.append(buttonRead, buttonDelete);

        // append book detail and action
        listGroupItem.append(bookDetails, bookAction);

        if (books[book].isComplete) {
            listFinished.append(listGroupItem);
        } else {
            listUnfinished.append(listGroupItem);
        }
    }
};

// displays all the data that have entered into the localStorage
window.addEventListener("load", function () {
    if (checkSupportedStorage) {
        renderBooks(bookshelfApp);
        console.log("renderr");
    } else {
        alert("Your browser isn't support web storage");
    }
});



// button save event handler
saveBook.addEventListener("click", function (event) {
    // input value from add new book form
    const title = document.getElementById("title");
    const author = document.getElementById("author");
    const year = document.getElementById("year");
    const isComplete = document.getElementById("completeCheck");

    // put to object
    let bookObj = {
        id: +new Date(),
        title: title.value,
        author: author.value,
        year: year.value,
        isComplete: isComplete.checked,
    };

    // checking blank field
    if (title.value && author.value && year.value) {
        // run addBook function for add book data to localStorage
        addBook(bookObj, localStorageKey);
    } else {
        return alert("The field can't be blank");
    }

    // clear all input value
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => (input.value = ""));

    renderBooks(bookshelfApp);

    Swal.fire({
        title: 'Success!',
        text: 'Book added to the shelf!',
        icon: 'success',
        confirmButtonText: 'OK',
        buttonsStyling: false,
        customClass: {
            confirmButton: 'btn finished-btn swal-btn',
        },
    });
});


