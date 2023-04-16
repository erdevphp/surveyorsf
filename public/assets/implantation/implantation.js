window.onload = () => {
    class CircleAnimation { 
        constructor (canvasId, circleColor, circleRayon) {
            this.canvas = document.getElementById(canvasId);
            this.ctx = this.canvas.getContext('2d');
            this.canvas.addEventListener('click', (event) => {
                const x = event.offsetX, y = event.offsetY;
                this.points.push({x: x, y: y})
                this.drawCircle(x, y);
                this.counter++
            });
            this.circleColor = circleColor;
            this.circleRayon = circleRayon;
            this.points = []
        }
        drawCircle(x, y) {
            this.ctx.beginPath();
            this.ctx.arc(x, y, this.circleRayon, 0, Math.PI * 2);
            this.ctx.fillStyle = this.circleColor;
            this.ctx.fill();
            this.ctx.closePath();
        }
    }
    const circle = new CircleAnimation('myCanvas', 'red', 12)

    document.querySelector('.form-implantation').addEventListener('submit', (event) => {
        event.preventDefault();
        const data = document.querySelector('#send-data');
        data.setAttribute('data-send', circle.points);
        console.log(data);
        return false;
    });
}