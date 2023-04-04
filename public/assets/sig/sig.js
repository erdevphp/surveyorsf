window.onload = () => {
    let counter = 1;
    const canvas = document.getElementById('sig-canvas');
    let context = canvas.getContext('2d');

    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;
    let gravity = 0.06

    class Player {
        constructor(context, {position, velocity}, color) {
            this.context = context;
            this.position = position;
            this.velocity = velocity;
            this.color = color;
            this.width = 20;
            this.height = 50;
        }

        draw() {
            this.context.fillStyle = this.color
            this.context.fillRect(this.position.x, this.position.y, this.width, this.height);
        }

        update() {
            this.draw();
            
            this.position.y += this.velocity.y;
            this.position.x += this.velocity.x;

            if ( (this.position.y + this.height + this.velocity.y) >= canvasHeight ) {
                this.velocity.y = 0
            } else this.velocity.y += gravity;

            if ( (this.position.x + this.width + this.velocity.x) >= canvasWidth ) {
                this.velocity.x = 0
            }
        }
    }
    
    const player1 = new Player(context, { position : {x: 0, y: 0}, velocity : {x: 0, y: 0} }, 'cyan');
    const player2 = new Player(context, { position : {x: 60, y: 10}, velocity: {x: 0, y: 0} }, 'red');
    
    animate()

    window.addEventListener('keydown', (event) => {
        if (event.key === 'd' || event.key === 'D') {
            player1.velocity.x = 1
        } else if (event.key === 'q' || event.key === 'Q') {
            player1.velocity.x = -1
        }
    });

    window.addEventListener('keyup', (event) => {
        if (event.key === 'd' || event.key === 'D') {
            player1.velocity.x = 0
        } else if (event.key === 'q' || event.key === 'Q') {
            player1.velocity.x = 0
        }
    });

    function animate() {
        window.requestAnimationFrame(animate);
        context.clearRect(0, 0, canvasWidth, canvasHeight)
        player1.update();
        player2.update();
    }
    
}


