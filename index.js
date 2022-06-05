
const generateId = () => {
   return +new Date();
}

const generateObjectBook = (title, author, year, isComplete) => {
   return {
      id: generateId(),
      title,
      author,
      year,
      isComplete
   }
}

const notReadCard = (book) => {
   return `
      <div class="card">
         <div class="col-lg-12">
            <p class="text-card-title">${book.title}</p>
            <p class="t-primary">Penulis: ${book.author}</p>
            <p class="t-primary">Tahun: ${book.year}</p>
         </div>
         <div class="col-lg-10 d-flex">
            <button type="button" class="b-primary text-white form-button3" onclick="selesai(${book.id});">Selesai</button>
            <button type="button" class="ms-2 b-primary text-white form-button3" onclick="hapus(${book.id});">Hapus</button>
         </div>
      </div>
   `
}

const readCard = (book) => {
   return `
      <div class="card">
         <div class="col-lg-12">
            <p class="text-card-title">${book.title}</p>
            <p class="t-primary">Penulis: ${book.author}</p>
            <p class="t-primary">Tahun: ${book.year}</p>
         </div>
         <div class="col-lg-10 d-flex">
            <button type="button" class="b-primary text-white form-button3" onclick="belum(${book.id});">Belum</button>
            <button type="button" class="ms-2 b-primary text-white form-button3" onclick="hapus(${book.id});">Hapus</button>
         </div>
      </div>
   `
}


// panggil element
const notReadContainer = document.querySelector('#notReadContainer');
const readContainer = document.querySelector('#readContainer');
const addButton = document.querySelector('#add');
const searchButton = document.querySelector('#search');

addButton.addEventListener('click', () => {
   const title = document.querySelector('#title').value;
   const author = document.querySelector('#author').value;
   const year = document.querySelector('#year').value;
   const isComplete = document.querySelector('#isComplete').checked;

   if(title === '' || author === '' || year === '') {
      Swal.fire({
         title: 'Gagal!',
         text: 'Data tidak boleh kosong!',
         icon: 'error'
      })
      return;
   }

   const book = generateObjectBook(title, author, year, isComplete);

   localStorage.setItem(book.id, JSON.stringify(book));
   if(isComplete) {
      readContainer.innerHTML += readCard(book);
   } else {
      notReadContainer.innerHTML += notReadCard(book);
   }

   document.querySelector('#title').value = '';
   document.querySelector('#author').value = '';
   document.querySelector('#year').value = '';
   document.querySelector('#isComplete').checked = false;
});

searchButton.addEventListener('click', () => {
   const search = document.querySelector('#keyword').value;
   const books = Object.keys(localStorage).map(key => JSON.parse(localStorage.getItem(key))).filter(book => book.title.toLowerCase().includes(search.toLowerCase()));

   if(books) {
      notReadContainer.innerHTML = '';
      readContainer.innerHTML = ''; 
      books.forEach(book => {
         if(book.isComplete) {
            readContainer.innerHTML += readCard(book);
         } else {
            notReadContainer.innerHTML += notReadCard(book);
         }
      });
   }
})


const renderBooks = () => {
   const books = Object.keys(localStorage).map(key => JSON.parse(localStorage.getItem(key))).filter(book => book.isComplete === false || book.isComplete === true);

   if(books) {
      books.forEach(book => {
         if(book.isComplete) {
            readContainer.innerHTML += readCard(book);
         } else {
            notReadContainer.innerHTML += notReadCard(book);
         }
      });
   }
}
renderBooks();

const selesai = (id) => {
   const book = JSON.parse(localStorage.getItem(id));
   book.isComplete = true;
   localStorage.setItem(id, JSON.stringify(book));
   notReadContainer.innerHTML = '';
   readContainer.innerHTML = '';
   renderBooks();
}

const belum = (id) => {
   const book = JSON.parse(localStorage.getItem(id));
   book.isComplete = false;
   localStorage.setItem(id, JSON.stringify(book));
   notReadContainer.innerHTML = '';
   readContainer.innerHTML = '';
   renderBooks();
}

const hapus = (id) => {
   Swal.fire({
      title: 'Apakah anda yakin?',
      text: "Anda tidak dapat mengembalikan data ini!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!'
   }).then((result) => {
      if (result.value) {
         localStorage.removeItem(id);
         notReadContainer.innerHTML = '';
         readContainer.innerHTML = '';
         renderBooks();
         Swal.fire(
            'Terhapus!',
            'Data berhasil dihapus.',
            'success'
         )
      }
   })
}



