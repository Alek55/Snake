class Snake {
    constructor(width = 700, height = 500, size_block = 10) {
        this.canvas = document.getElementById('canvas');
        this.context = this.canvas.getContext('2d');
        this.startMenu = document.getElementById('start');
        this.scoreEl = document.getElementById('score');
        this.score = 0;
        this.width = width;
        this.height= height;
        this.size_block = size_block;
        this.snake_arr = [];
        this.bg_snake = '#5E9C00';
        this.bg_apple = '#A18080';
        this.direction = 'right';
        this.timer = false;
        this.speed = 100;
        this.apple = null;
        this.max_speed = 1000 / 60;
        this.init();
    }

    init() {
        this.drawField();
        this.genStartMenu();

        this.startMenu.querySelector('button').addEventListener('click', (event) => {this.start(event)});

        window.addEventListener('keydown', (event) => {this.keyPress(event.code)});
    }

    start() {
        this.context.fillStyle = '#fff';
        this.context.fillRect(0, 0, this.width, this.height);
        this.startMenu.style.display = 'none';
        this.drawSnake();
        this.genApple();
        let speed = this.speed;
        this.timer = setInterval(() => {this.move()}, speed);
    }

    genApple() {
        let random_coords = {};
        let search_coords = [];

        for(let i = 0; i < this.width; i += this.size_block) {
            for(let j = 0; j < this.height; j += this.size_block) {
                search_coords.push({'left': i, 'top': j});
            }
        }

        let success = true;
        while(true) {
            let random = Math.round(Math.random() * (search_coords.length + 1));

            for(let item = 0; item < this.snake_arr.length; item++) {
                let start_cell_left = this.snake_arr[item].left - this.size_block;
                let start_cell_top = this.snake_arr[item].top - this.size_block;

                for(let i = start_cell_top; i < start_cell_top + this.size_block * 3; i++) {
                    for(let j = start_cell_left; j < start_cell_left + this.size_block * 3; j++) {
                        if(search_coords[random].left === j && search_coords[random].top === i) success = false;
                    }
                }
            }
            random_coords.left = search_coords[random].left;
            random_coords.top = search_coords[random].top;
            if(success) break;
        }

        this.context.fillStyle = this.bg_apple;
        this.context.fillRect(random_coords.left, random_coords.top, this.size_block, this.size_block);
        this.apple = {
          'left': random_coords.left,
          'top': random_coords.top,
        };
    }

    keyPress(key_code) {
        if(key_code == 'ArrowUp') this.direction = 'top';
        else if(key_code == 'ArrowRight') this.direction = 'right';
        else if(key_code == 'ArrowDown') this.direction = 'bottom';
        else if(key_code == 'ArrowLeft') this.direction = 'left';
    }

    genStartMenu() {
        this.startMenu.style.width = `${this.canvas.offsetWidth}px`;
        this.startMenu.style.height = `${this.canvas.offsetHeight + 2}px`;
        this.startMenu.style.marginLeft= `-${this.canvas.offsetWidth / 2}px`;
    }

    end() {
        clearInterval(this.timer);
        this.direction = 'right';
        this.speed = 100;
        this.startMenu.style.display = 'block';

        this.startMenu.querySelector('p').style.display = 'block';
        this.startMenu.querySelector('p span').innerHTML = this.score;

        this.score = 0;
        this.scoreEl.querySelector('span').innerHTML = 0;
        return false;
    }

    move() {
        let new_coords = {};
        switch(this.direction) {
            case 'right':
                new_coords.left = this.snake_arr[this.snake_arr.length - 1].left + this.size_block;
                new_coords.top = this.snake_arr[this.snake_arr.length - 1].top;
                break;
            case 'bottom':
                new_coords.left = this.snake_arr[this.snake_arr.length - 1].left;
                new_coords.top = this.snake_arr[this.snake_arr.length - 1].top + this.size_block;
                break;
            case 'left':
                new_coords.left = this.snake_arr[this.snake_arr.length - 1].left - this.size_block;
                new_coords.top = this.snake_arr[this.snake_arr.length - 1].top;
                break;
            case 'top':
                new_coords.left = this.snake_arr[this.snake_arr.length - 1].left;
                new_coords.top = this.snake_arr[this.snake_arr.length - 1].top - this.size_block;
        }

        let is_self = false;
        for(let i = 0; i < this.snake_arr.length; i++) {
            if(this.snake_arr[i].left == new_coords.left && this.snake_arr[i].top === new_coords.top) is_self = true;
        }

        if(new_coords.left < 0 || new_coords.top < 0 || new_coords.left + this.size_block > this.width || new_coords.top + this.size_block > this.height || is_self) this.end();
        else {
            if(new_coords.left === this.apple.left && new_coords.top === this.apple.top) this.checkApple();

            this.context.fillStyle = '#fff';
            this.context.fillRect(0, 0, this.width, this.height);

            this.snake_arr.push(new_coords);
            this.snake_arr.shift();

            this.context.fillStyle = this.bg_snake;
            for(let i = 0; i < this.snake_arr.length; i++) {
                this.context.fillRect(this.snake_arr[i].left, this.snake_arr[i].top, this.size_block, this.size_block);
            }

            this.context.fillStyle = this.bg_apple;
            this.context.fillRect(this.apple.left, this.apple.top, this.size_block, this.size_block);
        }
    }

    checkApple() {
        this.score += 1;
        this.scoreEl.querySelector('span').innerHTML = this.score;

        let next = {};
        if(this.snake_arr[1].left > this.snake_arr[0].left) {
            next.left = this.snake_arr[0].left - this.size_block;
            next.top = this.snake_arr[0].top;
        }
        else if(this.snake_arr[1].left < this.snake_arr[0].left) {
            next.left = this.snake_arr[0].left + this.size_block;
            next.top = this.snake_arr[0].top;
        }
        else if(this.snake_arr[1].top < this.snake_arr[0].top) {
            next.top = this.snake_arr[0].top + this.size_block;
            next.left= this.snake_arr[0].left;
        }
        else if(this.snake_arr[1].top > this.snake_arr[0].top) {
            next.top = this.snake_arr[0].top - this.size_block;
            next.left= this.snake_arr[0].left;
        }

        this.snake_arr.unshift(next);
        this.genApple();

        clearInterval(this.timer);
        let new_speed = this.speed = this.speed - 5;
        if(new_speed < this.max_speed) new_speed = this.speed = this.max_speed;
        this.timer = setInterval(() => {this.move()}, new_speed);
    }

    drawField() {
        this.canvas.width = this.width;
        this.canvas.height= this.height;
    }

    drawSnake() {
        if(this.snake_arr.length) this.snake_arr = [];

        let pos_left = this.size_block * 6;
        let pos_top = this.height - this.size_block * 10;

        for(let i = 0; i < 5; i++) {
            this.context.fillStyle = this.bg_snake;
            this.context.fillRect(pos_left, pos_top, this.size_block, this.size_block);
            this.snake_arr.push({"left": pos_left, "top": pos_top});
            pos_left += this.size_block;
        }
    }
}

const snake = new Snake(300, 300);