document.addEventListener('mousemove', function (e) {
  let body = document.querySelector('body');
  let flower = document.createElement('div');
  flower.className = 'flower';
  let x = e.clientX;
  let y = e.clientY;
  flower.style.left = x + 'px';
  flower.style.top = y + 'px';

  let size = Math.random() * 30;
  flower.style.width = 10 + size + 'px';
  flower.style.height = 10 + size + 'px';

  let rotation = Math.random() * 360;
  flower.style.transform = `rotate(${rotation}deg)`;

  body.appendChild(flower);

  setTimeout(function () {
    flower.remove();
  }, 2000);
});
