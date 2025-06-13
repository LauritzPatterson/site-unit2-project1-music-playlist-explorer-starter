let playlistData = [];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    // Pick a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements array[i] and array[j]
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

document.addEventListener("DOMContentLoaded", () => {
  // const container = document.getElementById("modalOverlay");
  // const modal = document.getElementById("modalContent");
  //const closeBtn = modal.querySelector(".close-button");
  // const modalArt = document.getElementById("modal-art");
  // const modalName = document.getElementById("modal-name");
  // const modalAuthor = document.getElementById("modal-author");
  //const modalSongs = document.getElementById("modal-songs");

  //*closeBtn.addEventListener("click", () => {
  //    modal.classList.remove("show");
  // });
  // window.addEventListener("click", (e) => {
  //   if (e.target === container) {
  //     container.classList.remove("show");
  //   }
  //});

  fetch("data/data.json")
    .then((response) => response.json())
    .then((data) => {
      const container = document.querySelector(".playlist-cards");
      container.innerHTML = "";

      if (!data.playlists || data.playlists.length === 0) {
        container.innerHTML = "<p>No playlists added</p>";
        return;
      }
      // Loop through each playlist and create a card
      data.playlists.forEach((playlist) => {
        // Ccard element
        const card = document.createElement("div");
        card.className = "playlist-card";

        // Playlist cover image
        const cover = document.createElement("img");
        cover.className = "playlist-cover";
        cover.src = playlist.playlist_art;
        cover.alt = "Playlist Cover";

        // Info container
        const info = document.createElement("div");
        info.className = "playlist-info";

        const title = document.createElement("h2");
        title.textContent = playlist.playlist_name;

        const author = document.createElement("p");
        author.textContent = `Created by ${playlist.playlist_author}`;

        // creating a div
        // const meta = document.createElement("div");
        // // adding a class name
        // meta.className = "playlist-meta";
        // // adding html inside the div
        // meta.innerHTML = `&#9829; ${playlist.like_count}`;

        // Create the heart icon div
        const heart = document.createElement("div");
        heart.className = "heart-icon-container";
        // Add the image inside the heart icon div
        heart.innerHTML = `
        <img src="assets/img/heart.png" alt="Heart Icon" class="heart-icon" id="playlist_${playlist.playlistID}">
        <p id="likeCount_${playlist.playlistID}" >${playlist.like_count}</p> 
              
        `;

        info.appendChild(title);
        info.appendChild(author);
        info.appendChild(heart);
        // add the like count to the list of elemeents

        card.appendChild(cover);
        card.appendChild(info);
        // // const heart = tile.querySelector(".heart-icon");
        // const count = tile.querySelector(".like-count");
        // heart.addEventListener("click", (e) => {
        //   e.stopPropagation();
        //   let n = parseInt(count.textContent, 10);
        //   if (heart.classList.contains("liked")) {
        //     heart.classList.remove("liked");
        //     count.textContent = --n;
        //   } else {
        //     heart.classList.add("liked");
        //     count.textContent = ++n;
        //   }
        // });

        // check

        card.addEventListener("click", (e) => {
          // get the heart icon element
          const heartIcon = document.querySelector(
            `#playlist_${playlist.playlistID}`
          );
          // check to see if target is the heart icon
          // if it is not the heart icon, run openModal
          if (e.target != heartIcon) {
            openModal(playlist, e);
          }
        });

        heart.addEventListener("click", (e) => {
          // selecting the heart image element
          const heartIcon = document.querySelector(
            `#playlist_${playlist.playlistID}`
          );

          // select the p -element that contains the like count
          const likeCount = document.querySelector(
            `#likeCount_${playlist.playlistID}`
          );

          // check if there is are .active
          if (heartIcon.classList.contains("active")) {
            heartIcon.classList.remove("active");
            likeCount.innerHTML = `${parseInt(likeCount.innerHTML) - 1}`;

            return;
          } else {
            // if there is, we remove the .active class

            heartIcon.classList.add("active");
            likeCount.innerHTML = `${parseInt(likeCount.innerHTML) + 1}`;
          }
        });

        container.appendChild(card);
      });
    })
    .catch((error) => {
      document.querySelector(".playlist-cards").innerHTML =
        "<p>Error loading playlists.</p>";
      console.error(error);
    });

  // Modal logic
  function openModal(playlist, e) {
    const modalOverlay = document.getElementById("modalOverlay");
    const modalContent = document.getElementById("modalContent");
    // console.log(modalContent);

    modalContent.innerHTML = `
    <span class="close-button">&times;</span>
    <img src="${playlist.playlist_art}" alt="Cover" class="playlist-cover" />
    <h2>${playlist.playlist_name}</h2>
    <p>Created by <b>${playlist.playlist_author}</b></p>
     <button id="shuffleBtn" style="margin: 2rem auto; display: block;">Shuffle Playlists</button>
    <ul id="playlistSongList">
      ${playlist.songs
        .map(
          (song) => `
        <li>
        <img src="${song.songArt}" alt="Song Art" class="song-artwork" />
          <b>${song.title}</b> - ${song.artist} <span style="float:right;">${song.duration} ${song.album}</span>
        </li>
      `
        )
        .join("")}
    </ul>
  `;

    document
      .getElementById("shuffleBtn")
      .addEventListener("click", function () {
        const shuffled = shuffleArray([...playlist.songs]);

        // Get the list element

        const songList = document.getElementById("playlistSongList");

        // clear the list's innerhtml
        songList.innerHTML = "";

        // Re-add new html to the list
        songList.innerHTML = `
         ${shuffled
           .map(
             (song) => `
        <li>
          <b>${song.title}</b> - ${song.artist} <span style="float:right;">${song.duration}</span>
        </li>
      `
           )
           .join("")}`;
      });

    // Logic for showing model
    modalOverlay.classList.add("active");

    // Close logic
    modalOverlay
      .querySelector(".close-button")
      .addEventListener("click", () => {
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
});
