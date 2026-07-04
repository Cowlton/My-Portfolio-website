(function() {
  document.addEventListener('DOMContentLoaded', function() {
    var images = document.querySelectorAll('.secondary-photo');

    images.forEach(function(img) {
      var wrapper = document.createElement('div');
      wrapper.className = 'secondary-photo-wrapper';
      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(img);

      var btn = document.createElement('button');
      btn.className = 'fullscreen-btn';
      btn.innerHTML = '&#x26F6;';
      btn.setAttribute('aria-label', 'View fullscreen');
      wrapper.appendChild(btn);

      var overlay = document.createElement('div');
      overlay.className = 'fullscreen-overlay';

      var overlayImg = document.createElement('img');
      overlayImg.src = img.src;
      overlayImg.alt = img.alt;
      overlay.appendChild(overlayImg);

      var closeBtn = document.createElement('button');
      closeBtn.className = 'fullscreen-close';
      closeBtn.innerHTML = '&times;';
      closeBtn.setAttribute('aria-label', 'Close');
      overlay.appendChild(closeBtn);

      document.body.appendChild(overlay);

      var zoomed = false;
      var scale = 1;

      function resetZoom() {
        zoomed = false;
        scale = 1;
        overlayImg.style.transform = '';
        overlayImg.style.cursor = '';
        overlay.classList.remove('zoomed');
      }

      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        resetZoom();
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      });

      function closeFullscreen() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        resetZoom();
      }

      closeBtn.addEventListener('click', closeFullscreen);
      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
          closeFullscreen();
        }
      });

      overlayImg.addEventListener('click', function(e) {
        e.stopPropagation();
        if (!zoomed) {
          zoomed = true;
          scale = 2;
          overlayImg.style.transform = 'scale(2)';
          overlayImg.style.cursor = 'grab';
          overlay.classList.add('zoomed');
        } else {
          resetZoom();
        }
      });

      var isPanning = false, startX, startY, panX = 0, panY = 0;

      overlayImg.addEventListener('mousedown', function(e) {
        if (!zoomed) return;
        e.preventDefault();
        isPanning = true;
        startX = e.clientX - panX;
        startY = e.clientY - panY;
        overlayImg.style.cursor = 'grabbing';
      });

      document.addEventListener('mousemove', function(e) {
        if (!isPanning) return;
        panX = e.clientX - startX;
        panY = e.clientY - startY;
        overlayImg.style.transform = 'scale(' + scale + ') translate(' + panX + 'px, ' + panY + 'px)';
      });

      document.addEventListener('mouseup', function() {
        if (isPanning) {
          isPanning = false;
          overlayImg.style.cursor = zoomed ? 'grab' : '';
        }
      });

      overlayImg.addEventListener('wheel', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var delta = e.deltaY > 0 ? -0.2 : 0.2;
        scale = Math.max(1, Math.min(10, scale + delta));
        if (scale > 1) {
          zoomed = true;
          overlayImg.style.transform = 'scale(' + scale + ') translate(' + panX + 'px, ' + panY + 'px)';
          overlayImg.style.cursor = 'grab';
          overlay.classList.add('zoomed');
        } else {
          resetZoom();
        }
      });

      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
          closeFullscreen();
        }
      });
    });
  });
})();
