const yesBtn = document.querySelector('.audio-btn-yes');
const noBtn = document.querySelector('.audio-btn-no');
const popup = document.querySelector('.popup-overlay');
const audio = document.querySelector('.audio');

yesBtn.addEventListener('click', () => {
    closePopup();

    if (audio) {
        audio.play().catch((err) => {
            console.warn('Autoplay was prevented:', err);
        });
    }
});

noBtn.addEventListener('click', () => {
    closePopup();
});

function closePopup() {
    popup.classList.add('h-hidden');
}
