class Carousel {
    constructor(p) {
        let settings = {...{containerID: '#carousel', interval: 5000, isPlaying: true, slideID: '.slide'}, ...p};
        this.container = document.querySelector(settings.containerID);
        this.slideItems = this.container.querySelectorAll(settings.slideID);
        this.interval = settings.interval;
        this.isPlaying = settings.isPlaying;
    }
    _initProps() {
        this.SLIDES_COUNT = this.slideItems.length;
        this.CODE_SPACE = 'Space';
        this.CODE_LEFT_ARROW = 'ArrowLeft';
        this.CODE_RIGHT_ARROW = 'ArrowRight';
        this.FA_PAUSE = '<i class="far fa-pause-circle"></i>';
        this.FA_PLAY = '<i class="far fa-play-circle"></i>';
        this.FA_PREV = '<i class="fas fa-angle-left"></i>';
        this.FA_NEXT = '<i class="fas fa-angle-right"></i>';
        this.currentSlide = 0;
    }
    _initControls() {
        let controls = document.createElement('div');
        const PAUSE = `<span id="pause-btn" class="control-pause">
        <span id="fa-pause-icon">${this.FA_PAUSE}</span>
        <span id="fa-play-icon">${this.FA_PLAY}</span>
    </span>`;
        const PREV = `<span id="prev-btn" class="control-prev">${this.FA_PREV}</span>`;
        const NEXT = `<span id="next-btn" class="control-next">${this.FA_NEXT}</span>`;
        controls.setAttribute('class', 'controls');
        controls.innerHTML = PAUSE + PREV + NEXT;
        this.container.append(controls);
        this.pauseBtn = this.container.querySelector('#pause-btn');
        this.nextBtn = this.container.querySelector('#next-btn');
        this.prevBtn = this.container.querySelector('#prev-btn');
        this.pauseIcon = this.container.querySelector('#fa-pause-icon');
        this.playIcon = this.container.querySelector('#fa-play-icon');
        this.isPlaying ? this.pauseIcon.style.opacity = 1 : this.playIcon.style.opacity = 1;
    }
    _initIndicators() {
        let indicators = document.createElement('ol');
        indicators.setAttribute('class', 'indicators');
        for (let i = 0, n = this.SLIDES_COUNT; i < n; i++) {
            let indicator = document.createElement('li');
            indicator.setAttribute('class', 'indicator');
            indicator.dataset.slideTo = `${i}`;
            i === 0 && indicator.classList.add('active');
            indicators.append(indicator);
        }
        this.container.append(indicators);
        this.indicatorsContainer = this.container.querySelector('.indicators');
        this.indicatorItems = this.container.querySelectorAll('.indicator');
    }
    _initListeners() {
        document.addEventListener('keydown', this._keyPress.bind(this));
        this.pauseBtn.addEventListener('click', this.pausePlay.bind(this));
        this.nextBtn.addEventListener('click', this.next.bind(this));
        this.prevBtn.addEventListener('click', this.prev.bind(this));
        this.indicatorsContainer.addEventListener('click', this._indicate.bind(this));
        this.container.addEventListener('mouseenter', this._pause.bind(this));
        this.container.addEventListener('mouseleave', this._play.bind(this));
    }
    _gotoNth(n) {
        this.slideItems[this.currentSlide].classList.toggle('active');
        this.indicatorItems[this.currentSlide].classList.toggle('active');
        this.currentSlide = (n + this.SLIDES_COUNT) % this.SLIDES_COUNT;
        this.slideItems[this.currentSlide].classList.toggle('active');
        this.indicatorItems[this.currentSlide].classList.toggle('active');
    }
    _gotoPrev() {
        this._gotoNth(this.currentSlide - 1);
    }
    _gotoNext() {
        this._gotoNth(this.currentSlide + 1);
    }
    _pause() {
        if (this.isPlaying) {
            this.pauseIcon.style.opacity = 0;
            this.playIcon.style.opacity = 1;
            this.isPlaying = false;
            clearInterval(this.timerID);
        }
    }
    _play() {
        if (!this.isPlaying) {
            this.pauseIcon.style.opacity = 1;
            this.playIcon.style.opacity = 0;
            this.isPlaying = true;
            this.timerID = setInterval(() => this._gotoNext(), this.interval);
        }
    }
    _indicate(e) {
        let target = e.target;
        if (target && target.matches('li.indicator')) {
            this._pause();
            this._gotoNth(+target.dataset.slideTo);
        }
    }
    _keyPress(e) {
        if (e.code === this.CODE_LEFT_ARROW) this.prev();
        if (e.code === this.CODE_RIGHT_ARROW) this.next();
        if (e.code === this.CODE_SPACE) this.pausePlay();
    }
    pausePlay() {
        this.isPlaying ? this._pause() : this._play();
    }
    prev() {
        this._pause();
        this._gotoPrev();
    }
    next() {
        this._pause();
        this._gotoNext();
    }
    init() {
        this._initProps();
        this._initControls();
        this._initIndicators();
        this._initListeners();
        if (this.isPlaying) this.timerID = setInterval(() => this._gotoNext(), this.interval);
    }
}
export default Carousel;