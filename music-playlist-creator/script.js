let playlistData = [];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("data/data.json")
    .then((response) => response.json())
    .then((data) => {
      playlistData = data.playlists;

      
      renderPlaylists(playlistData);





      // FEATURED button
      const featuredBtn = document.getElementById("featuredBtn");
      if (featuredBtn) {
        featuredBtn.addEventListener("click", () => {
          const randomIndex = Math.floor(Math.random() * playlistData.length);
          const featuredPlaylist = [playlistData[randomIndex]];
          renderPlaylists(featuredPlaylist);
        });
      }

      // ALL button
      const allBtn = document.getElementById("allBtn");
      if (allBtn) {
        allBtn.addEventListener("click", () => {
          renderPlaylists(playlistData);
        });
      }






      // SHUFFLE button
      const shuffleBtn = document.getElementById("shuffleBtn");
      if (shuffleBtn) {
        shuffleBtn.addEventListener("click", () => {
          const shuffled = shuffleArray([...playlistData]);
          renderPlaylists(shuffled);
        });
      }
    })





    .catch((error) => {
      document.querySelector(".playlist-cards").innerHTML =
        "<p>Error loading playlists.</p>";
      console.error(error);
    });
});

function renderPlaylists(playlists) {
  const container = document.querySelector(".playlist-cards");
  container.innerHTML = "";

  if (!playlists || playlists.length === 0) {
    container.innerHTML = "<p>No playlists added</p>";
    return;
  }



  
// Create a card for each playlist
  playlists.forEach((playlist) => {
    const card = document.createElement("div");
    card.className = "playlist-card";




    const cover = document.createElement("img");
    cover.className = "playlist-cover";
    cover.src = playlist.playlist_art;
    cover.alt = "Playlist Cover";



    const info = document.createElement("div");
    info.className = "playlist-info";



    const title = document.createElement("h2");
    title.textContent = playlist.playlist_name;

    const author = document.createElement("p");
    author.textContent = `Created by ${playlist.playlist_author}`;



    const heart = document.createElement("div");
    heart.className = "heart-icon-container";
    heart.innerHTML = `
      <img src="assets/img/heart.png" alt="Heart Icon" class="heart-icon" id="playlist_${playlist.playlistID}">
      <p id="likeCount_${playlist.playlistID}">${playlist.like_count}</p>
    `;

    info.appendChild(title);
    info.appendChild(author);
    info.appendChild(heart);
    card.appendChild(cover);
    card.appendChild(info);
    container.appendChild(card);

    card.addEventListener("click", (e) => {
      const heartIcon = document.querySelector(`#playlist_${playlist.playlistID}`);
      if (e.target !== heartIcon) {
        openModal(playlist);
      }
    });

    heart.addEventListener("click", (e) => {
      e.stopPropagation();
      const heartIcon = document.querySelector(`#playlist_${playlist.playlistID}`);
      const likeCount = document.querySelector(`#likeCount_${playlist.playlistID}`);
      let count = parseInt(likeCount.innerText);

      if (heartIcon.classList.contains("active")) {
        heartIcon.classList.remove("active");
        likeCount.innerText = --count;
      } else {
        heartIcon.classList.add("active");
        likeCount.innerText = ++count;
      }
    });
  });
}

function openModal(playlist) {
  const modalOverlay = document.getElementById("modalOverlay");
  const modalContent = document.getElementById("modalContent");

  modalContent.innerHTML = `
    <span class="close-button">&times;</span>
    <img src="${playlist.playlist_art}" alt="Cover" class="playlist-cover" />
    <h2>${playlist.playlist_name}</h2>
    <p>Created by <b>${playlist.playlist_author}</b></p>
    <ul id="playlistSongList">
      ${playlist.songs.map(song => `
        <li>
          <img src="${song.songArt || 'https://via.placeholder.com/80'}" alt="Song Art" class="song-artwork" />
          <b>${song.title}</b> - ${song.artist || 'Unknown Artist'}
          <span style="float:right;">${song.duration} ${song.album}</span>
        </li>
      `).join("")}
    </ul>
    <button id="modalShuffleBtn" style="margin: 2rem auto; display: block;">🔀 Shuffle Songs</button>
  `;



  // Add event listener for the shuffle button in the modal
  document.getElementById("modalShuffleBtn").addEventListener("click", () => {
    const shuffled = shuffleArray([...playlist.songs]);
    const songList = document.getElementById("playlistSongList");
    songList.innerHTML = shuffled.map(song => `
      <li>
        <img src="${song.songArt || 'https://via.placeholder.com/80'}" alt="Song Art" class="song-artwork" />
        <b>${song.title}</b> - ${song.artist || 'Unknown Artist'}
        <span style="float:right;">${song.duration} ${song.album}</span>
      </li>
    `).join("");
  });

  modalOverlay.classList.add("active");

  modalOverlay.querySelector(".close-button").addEventListener("click", () => {
    modalOverlay.classList.remove("active");
  });

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove("active");
    }
  });
}

  
  
  // document
  //   .getElementById("modalOverlay")
  //   .addEventListener("click", function () {
  //     if (e.target === this) {
  //       this.classList.remove("active");
  //     }

  //     if (e.target === container) {
  //       container.classList.remove("show");
  //     }
  //   });

  // Close modal when clicking the close button
  // document.querySelector(".close-button").addEventListener("click", (e) => {
  //   document.getElementById("modalOverlay").classList.remove("active");
  // });

