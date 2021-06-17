// 1. Get the search data -------------------------------------------------------------
let UI = {};

UI.handleEnterPress = () => {
    document.querySelector(".js-search").addEventListener('keypress', (e) => {
        if (e.which === 13) {
            let inputValue = e.target.value;
            SoundCloudAPI.getTrack(inputValue);
        }
    });
}

UI.handleSubmitClick = () => {
    document.querySelector(".js-submit").addEventListener('click', (e) => {
        let inputValue = document.querySelector(".js-search").value;
        SoundCloudAPI.getTrack(inputValue);
    });
}

// set up the search
UI.handleEnterPress();
UI.handleSubmitClick();

// 2. Search in sound cloud API ----------------------------------------------------------
let SoundCloudAPI = {};

SoundCloudAPI.init = () => {
    SC.initialize({
        client_id: 'cd9be64eeb32d1741c17cb39e41d254d'
    });
}

// set up soundcloud API
SoundCloudAPI.init();

// Search - https://developers.soundcloud.com/docs/api/guide#search

SoundCloudAPI.getTrack = (inputValue) => {
    return SC.get('/tracks/', {
        q: inputValue
    }).then((tracks) => {
        // console.log(tracks);

        let searchResult = document.querySelector('.js-search-results');
        searchResult.innerHTML = "";

        SoundCloudAPI.renderTrack(tracks, searchResult);
    });
}

SoundCloudAPI.renderTrack = (tracks, searchResult) => {
    tracks.forEach((track) => {
        // console.log(track.title);

        let card = document.createElement('div');
        card.classList.add('card');

        // create image
        let imageDiv = document.createElement('div');
        imageDiv.classList.add('image');

        let image_img = document.createElement('img');
        image_img.classList.add('image_img');
        image_img.src = track.artwork_url || 'http://lorempixel.com/100/100/nature/';

        imageDiv.appendChild(image_img);

        // create content
        let content = document.createElement('div');
        content.classList.add('content');

        // create header
        let header = document.createElement('div');
        header.classList.add('header');
        header.innerHTML = '<a href="' + track.permalink_url + '" target="_blank">' + track.title + '</a>';

        content.appendChild(header);
        searchResult.appendChild(content);

        // create button
        let button = document.createElement('div');
        button.setAttribute('data-id', track.id)
        button.classList.add('ui', 'bottom', 'attached', 'button', 'js-button');

        // create icon
        let icon = document.createElement('i');
        icon.classList.add('add', 'icon');

        // create button text
        let buttonText = document.createElement('span');
        buttonText.innerHTML = 'Add to playlist';

        button.appendChild(icon);
        button.appendChild(buttonText);

        button.addEventListener('click', () => {
            SoundCloudAPI.getEmbed(track.uri);
        });

        // card
        card.appendChild(imageDiv);
        card.appendChild(content);
        card.appendChild(button);

        searchResult.appendChild(card);
    });
}

// 3. embedding --------------------------------------------------------------------
// https://developers.soundcloud.com/docs/api/sdks#embedding

SoundCloudAPI.getEmbed = (trackPermalink) => {

    SC.oEmbed(trackPermalink, { auto_play: true }).then((oEmbed) => {
        // console.log('oEmbed response: ', oEmbed);

        let sideBar = document.querySelector(".col-left");

        // create a box to stack on sidebar
        let box = document.createElement("div");
        box.innerHTML = oEmbed.html;

        // stack of boxes
        sideBar.insertBefore(box, sideBar.firstChild);

        //set local storage so we can call it after refresh 
        localStorage.setItem("key", sideBar.innerHTML);

    });
}

// 4. Get the track list from localStorage ----------------------------------------
let sideBar = document.querySelector(".col-left");
sideBar.innerHTML = localStorage.getItem("key");

// 5. clear local storage ----------------------------------------------------------
let clrbtn = document.querySelector('.clearbtn');
clrbtn.addEventListener("click", () => {
    localStorage.clear();
    sideBar.innerHTML = '';
})

// END ----------------------------------------------------------------------------------

// client_id: 'cd9be64eeb32d1741c17cb39e41d254d'