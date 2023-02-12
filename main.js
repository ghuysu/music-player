/*
1. render songs
2. scroll to top
3. play / pause / seek
4. cd rotate
5. next / prev
6. random
7. next / repeat when ended
8. active song
9. scroll active song into view
10. play song when click
*/
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
                {
                    name: 'I like you',
                    singer: 'Post Malone',
                    path: './assets/music/bai1.mp3',
                    image: './assets/img/anh1.jpeg'
                },
                {
                    name: 'Nàng thơ',
                    singer: 'Hoàng Dũng',
                    path: './assets/music/bai2.mp3',
                    image: './assets/img/anh2.jpeg'
                },      
                {
                    name: 'Cant take my eyes off you',
                    singer: 'Joseph Vincent',
                    path: './assets/music/bai3.mp3',
                    image: './assets/img/anh3.jpeg'
                },        {
                    name: 'See tình',
                    singer: 'Hoàng Thuỳ Linh',
                    path: './assets/music/bai4.mp3',
                    image: './assets/img/anh4.jpeg'
                },
                {
                    name: 'I like you',
                    singer: 'Post Malone',
                    path: './assets/music/bai1.mp3',
                    image: './assets/img/anh1.jpeg'
                },
                {
                    name: 'I like you',
                    singer: 'Post Malone',
                    path: './assets/music/bai1.mp3',
                    image: './assets/img/anh1.jpeg'
                },
                {
                    name: 'I like you',
                    singer: 'Post Malone',
                    path: './assets/music/bai1.mp3',
                    image: './assets/img/anh1.jpeg'
                },
                {
                    name: 'I like you',
                    singer: 'Post Malone',
                    path: './assets/music/bai1.mp3',
                    image: './assets/img/anh1.jpeg'
                },
                {
                    name: 'I like you',
                    singer: 'Post Malone',
                    path: './assets/music/bai1.mp3',
                    image: './assets/img/anh1.jpeg'
                },
                {
                    name: 'I like you',
                    singer: 'Post Malone',
                    path: './assets/music/bai1.mp3',
                    image: './assets/img/anh1.jpeg'
                },
                {
                    name: 'I like you',
                    singer: 'Post Malone',
                    path: './assets/music/bai1.mp3',
                    image: './assets/img/anh1.jpeg'
                }
            ],

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `<div class="song ${index === this.currentIndex ? ' active' : ''}" data-index="${index}">
                        <div class="thumb"
                            style="background-image: url('${song.image}')">
                        </div>
                        <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                        </div>
                        <div class="option">
                            <i class="fas fa-ellipsis-h"></i>
                        </div>
                    </div>`;
        })
        playlist.innerHTML = htmls.join('');
    },

    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },

    handleEvents: function() {
        const _this = this
        const cdwidth = cd.offsetWidth;
        //xử lý cd quay / dừng
        const cdThumbAnimate = cdThumb.animate(
            [{
            transform: 'rotate(360deg)'
            }],
            {
                duration: 8000,
                iterations: Infinity
            });
        cdThumbAnimate.pause();

        //xử lý phóng to thu nhỏ
        document.onscroll = function() {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const newCdwidth = cdwidth - scrollTop;
            cd.style.width = (newCdwidth > 0)? newCdwidth + 'px' : 0;
            cd.style.opacity = newCdwidth / cdwidth;
        }

        //xử lý clickplay
        playBtn.onclick = function(){
            if(_this.isPlaying == false){
                audio.play();
            }
            else{
                audio.pause();
        }}
        
        //khi play
        audio.onplay = function(){
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        //khi pause
        audio.onpause = function(){
            player.classList.remove('playing');
            _this.isPlaying = false;
            cdThumbAnimate.pause();
        }

        //khi nhạc chạy
        audio.ontimeupdate = function(){
            if(audio.duration)
            {
                const currentProgeressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = currentProgeressPercent;
            }
        }

        //khi tua vid xong
        progress.onchange = function (e){
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        //khi prev song
        prevBtn.onclick = function(){
            if(_this.isRandom)
            {
                _this.randomSong();
            }
            else
            {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        //khi next song
        nextBtn.onclick = function(){
            if(_this.isRandom)
            {
                _this.randomSong();
            }
            else
            {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        //khi random video
        randomBtn.onclick = function(){
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active',_this.isRandom);
        }

        //next khi end
        audio.onended = function(){
            if(_this.isRandom)
            {
                _this.randomSong();
            }
            else if(_this.isRepeat)
            {
                audio.load();
            }
            else
            {
                _this.nextSong();
            }
            audio.play();
            _this.render();
        }

        //end khi repeat
        repeatBtn.onclick = function(){
            _this.isRepeat =!_this.isRepeat;
            repeatBtn.classList.toggle('active',_this.isRepeat);
        }

        //lắng nghe hành vi click vào playlist
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)'); 
            if(songNode || e.target.closest('.option')){
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    audio.play();
                    _this.render();
                }
                else
                {

                }
            }
        }
    },

    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex <= 0){
            this.currentIndex = this.songs.length-1;
        }
        this.loadCurrentSong();
    },

    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    randomSong: function(){
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        }   while(newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    scrollToActiveSong: function(){
          setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block:'center'
            });
          },250)
    },

    start: function() {
        //định nghĩa các thuộc tính cho object
        this.defineProperties();
        
        //lắng nghe / xử lý DOM events
        this.handleEvents();

        //tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        //render playlist
        this.render();
    }
};

app.start();
