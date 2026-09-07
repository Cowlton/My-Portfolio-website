let next = document.querySelector(".next");
let prev = document.querySelector(".prev");

const slide = document.getElementById('slide');
const FinishPoint = getComputedStyle(slide).getPropertyValue('--target');
window.onload = scheduleVideo;
let slideshowTimer = null;
function clearSlideshowTimer() {
    if (slideshowTimer) {
        clearTimeout(slideshowTimer);
        slideshowTimer = null;
    }
    slide.classList.remove('cycling');
}

function clearSelected() {
    let selected = slide.querySelectorAll('.item.selected');
    for (let i = 0; i < selected.length; i++) {
        selected[i].classList.remove('selected');
    }
}

let videoDelay = 3000;
let videoTimer = null;
let slideVideo = null;

function stopVideo() {
    if (videoTimer) {
        clearTimeout(videoTimer);
        videoTimer = null;
    }
    if (slideVideo) {
        slideVideo.pause();
        slideVideo.removeAttribute('src');
        slideVideo.load();
        slideVideo.remove();
        slideVideo = null;
    }
}

function scheduleVideo() {
    updateDisplay()
    stopVideo();
    let large = slide.children[1];
    if (!large) return;
    let src = large.getAttribute('data-video');
    let color = large.getAttribute('datafld');
    if(color){
        ChangeBackgroundColor(color);
    }
    if (!src) return;
    videoTimer = setTimeout(function() {
        videoTimer = null;
        playVideo(src);
    }, videoDelay);
}

function ChangeBackgroundColor(color){
    document.body.style.backgroundColor = color;
}

function playVideo(src) {
    let video = document.createElement('video');
    video.className = 'slide-video';
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.setAttribute('playsinline', '');
    video.src = src;
    let large = slide.children[1];
    if (large) {
        large.insertBefore(video, large.firstChild);
    }
    video.play().catch(function() {});
    slideVideo = video;
}

function rotateSlides(steps, direction) {
    clearSlideshowTimer();
    slide.classList.add('cycling');
    rotateOnce(direction);
    let count = 1; // rotation counter
    (function nextStep() {
        if (count >= steps) { // ends rotation cycle
            slide.classList.remove('cycling');
            clearSelected();
            return;
        }
        let delay = Math.max(100, 300 - count * 50);
        slideshowTimer = setTimeout(function() {
            rotateOnce(direction);
            count++;
            nextStep();
        }, delay);
    })();
}

function rotateOnce(direction) {
    if (direction === 'right') {
        slide.prepend(slide.children[slide.children.length - 1]);
    } else {
        slide.appendChild(slide.children[0]);
    }
    scheduleVideo();
}

slide.addEventListener('click', function(e) {
    const items = Array.prototype.slice.call(slide.children);
    const target = e.target.closest('.item');
    if (!target) return;
    const clickable = getComputedStyle(target).getPropertyValue('--clickable');
    if (clickable === 'false')return;
    const index = items.indexOf(target);
    if (index < 0) return;
    clearSelected();
    target.classList.add('selected');
    if (index > FinishPoint){
        rotateSlides(index - FinishPoint, 'left');
    }else if (index < FinishPoint){
        rotateSlides(FinishPoint - index, 'right');
    }
    
});


scheduleVideo();
