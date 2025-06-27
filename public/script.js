searchForm = document.querySelector('.search-form');

document.querySelector('#search-btn').onclick = () =>{
  searchForm.classList.toggle('active');
}

let loginForm = document.querySelector('.login-form-container');

document.querySelector('#login-btn').onclick = () =>{
  loginForm.classList.toggle('active');
}

document.querySelector('#close-login-btn').onclick = () =>{
  loginForm.classList.remove('active');
}

window.onscroll = () =>{

  searchForm.classList.remove('active');

  if(window.scrollY > 80){
    document.querySelector('.header .header-2').classList.add('active');
  }else{
    document.querySelector('.header .header-2').classList.remove('active');
  }

}

window.onload = () =>{

  if(window.scrollY > 80){
    document.querySelector('.header .header-2').classList.add('active');
  }else{
    document.querySelector('.header .header-2').classList.remove('active');
  }

  fadeOut();

}

function loader(){
  document.querySelector('.loader-container').classList.add('active');
}

function fadeOut(){
  setTimeout(loader, 4000);
}

var swiper = new Swiper(".books-slider", {
  loop:true,
  centeredSlides: true,
  autoplay: {
    delay: 9500,
    disableOnInteraction: false,
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

var swiper = new Swiper(".featured-slider", {
  spaceBetween: 10,
  loop:true,
  centeredSlides: true,
  autoplay: {
    delay: 9500,
    disableOnInteraction: false,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    450: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 3,
    },
    1024: {
      slidesPerView: 4,
    },
  },
});

var swiper = new Swiper(".arrivals-slider", {
  spaceBetween: 10,
  loop:true,
  centeredSlides: true,
  autoplay: {
    delay: 9500,
    disableOnInteraction: false,
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

var swiper = new Swiper(".reviews-slider", {
  spaceBetween: 10,
  grabCursor:true,
  loop:true,
  centeredSlides: true,
  autoplay: {
    delay: 9500,
    disableOnInteraction: false,
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

var swiper = new Swiper(".blogs-slider", {
  spaceBetween: 10,
  grabCursor:true,
  loop:true,
  centeredSlides: true,
  autoplay: {
    delay: 9500,
    disableOnInteraction: false,
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});
document.getElementById('searchInput').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') searchBooks();
});

function searchBooks() {
  const query = document.getElementById('searchInput').value.trim();
  if (!query) return alert("Please enter a book name to search.");

  toggleLoading(true);
  fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20`)
      .then(response => response.json())
      .then(data => {
          const books = data.items || [];
          const results = books.length 
              ? books.map(createBookCard).join('') 
              : `<p>No books found for "${query}".</p>`;
          document.getElementById('bookResults').innerHTML = results;
          document.querySelectorAll('.book-card').forEach(card => 
              card.addEventListener('click', () => showBookDetails(card.dataset.id, card.dataset.cover))
          );
          toggleLoading(false);
          showModal();
      })
      .catch(() => {
          document.getElementById('bookResults').innerHTML = `<p>Error fetching books. Please try again later.</p>`;
          toggleLoading(false);
          showModal();
      });
}

function createBookCard(bookItem) {
  const { title = "No Title Available", authors = ["Unknown Author"], imageLinks = {} } = bookItem.volumeInfo;
  const coverUrl = imageLinks.thumbnail || 'https://via.placeholder.com/150x220.png?text=No+Cover';
  
  return `
      <div class="book-card" data-id="${bookItem.id}" data-cover="${coverUrl}">
          <img src="${coverUrl}" alt="${title}">
          <h2 class="book-title">${title}</h2>
          <p class="book-author">by ${authors.join(", ")}</p>
      </div>
  `;
}

function showBookDetails(bookId, coverUrl) {
  fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`)
      .then(response => response.json())
      .then(bookItem => {
          const { title = "No Title Available", description = "No description available" } = bookItem.volumeInfo;

          // Use the coverUrl passed from the search result
          document.getElementById('bookResults').innerHTML = `
              <div class="book-detail">
                  <img src="${coverUrl}" alt="${title}" class="book-cover-detail">
                  <div class="book-info">
                      <h2 class="book-title">${title}</h2>
                      <p class="book-description">${description}</p>
                      <button onclick="searchBooks()">Back to Search</button>
                  </div>
              </div>
          `;
      })
      .catch(() => {
          document.getElementById('bookResults').innerHTML = `<p>Error fetching book details. Please try again later.</p>`;
      });
}

function toggleLoading(show) {
  document.getElementById('loadingIndicator').style.display = show ? 'block' : 'none';
}

function showModal() {
  document.getElementById('searchModal').style.display = 'block';
}

function closeModal() {
  document.getElementById('searchModal').style.display = 'none';
}
