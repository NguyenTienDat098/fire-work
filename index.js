const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
let width, height;
let fireWorks = [];
let particle = [];
let circles = [];
let fireWorkChance = 0.1;
let fireWorkMax = 8;
let color = 0;
const init = () => {
  resizeReset();
  fireWorks.push(new FireWork());
  animationLoop();
};

const animationLoop = () => {
  if (fireWorks.length < fireWorkMax && Math.random() < fireWorkChance) {
    fireWorks.push(new FireWork());
    color += 20;
  }
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = "lighter";

  drawScene();
  arrayCleanUp();
  requestAnimationFrame(animationLoop);
};
function resizeReset() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, width, height);
}

const drawScene = () => {
  if (fireWorks.length > 0) {
    fireWorks.forEach((e) => {
      e.update();
      e.drawLine();
    });
    particle.forEach((e) => {
      e.update();
      e.drawParticle();
    });
    circles.forEach((e) => {
      e.update();
      e.drawCircle();
    });
  }
};

const easeOutQuart = (x) => {
  return 1 - Math.pow(1 - x, 4);
};

const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const arrayCleanUp = () => {
  let dumpFireWork = [];
  fireWorks.forEach((e) => {
    if (e.alpha > 0) {
      dumpFireWork.push(e);
    } else {
      createFireWork(e.x, e.y, e.color);
    }
  });
  fireWorks = dumpFireWork;

  let dumpParticle = [];
  particle.forEach((e) => {
    if (e.size > 0) {
      dumpParticle.push(e);
    }
  });
  particle = dumpParticle;

  let dumpCircle = [];
  circles.forEach((e) => {
    if (e.size < e.maxSize) {
      dumpCircle.push(e);
    }
  });
  circles = dumpCircle;
};

const createFireWork = (x, y, color) => {
  for (let i = 0; i < 20; i++) {
    particle.push(new Particle(x, y, color, i));
    circles.push(new Circle(x, y, color));
  }
};

class FireWork {
  constructor() {
    this.x = getRandom(width * 0.3, width * 0.7);
    this.y = height;
    this.color = color;
    this.alpha = 1;
    this.tick = 0;
    this.maxTick = getRandom(150, 200);
    this.targetY = getRandom(height * 0.2, height * 0.4);
  }
  drawLine = () => {
    if (this.tick <= this.maxTick) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.color}, 100%, 50%, ${this.alpha})`;
      ctx.fill();
      ctx.closePath();
    }
  };
  update = () => {
    let progress = 1 - (this.maxTick - this.tick) / this.maxTick;
    this.y = height - (height - this.targetY) * progress;
    this.alpha = 1 - easeOutQuart(progress);
    this.tick += 1;
  };
}

class Particle {
  constructor(x, y, color, i) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = 3;
    this.speed = getRandom(30, 40) / 10;
    this.angle = getRandom(0, 36) + 36 * i;
  }
  drawParticle = () => {
    if (this.size > 0) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.color}, 100%, 50%, 1)`;
      ctx.fill();
      ctx.closePath();
    }
  };
  update = () => {
    this.radius = (Math.PI / 180) * this.angle;
    this.x += this.speed * Math.sin(this.radius);
    this.y += this.speed * Math.cos(this.radius);
    this.size -= 0.05;
  };
}

class Circle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = 0;
    this.maxSize = getRandom(100, 130);
    this.alpha = 0.01;
  }
  drawCircle = () => {
    if (this.size < this.maxSize) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.color}, 100%, 60%, ${this.alpha})`;
      ctx.fill();
      ctx.closePath();
    }
  };
  update = () => {
    this.size += 20;
  };
}
init();
