(function(){
  var slides = Array.prototype.slice.call(document.querySelectorAll(".deck-slide"));
  var controls = document.querySelector(".deck-controls");
  var currentEl = document.querySelector("[data-current-slide]");
  var totalEl = document.querySelector("[data-total-slides]");
  var index = 0;
  var presenting = false;

  if (!slides.length || !controls || !currentEl || !totalEl) return;

  totalEl.textContent = String(slides.length);

  function nearestSlideIndex(){
    var viewportMid = window.scrollY + window.innerHeight / 2;
    var best = 0;
    var bestDistance = Infinity;
    slides.forEach(function(slide, i){
      var top = slide.offsetTop;
      var mid = top + slide.offsetHeight / 2;
      var distance = Math.abs(mid - viewportMid);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = i;
      }
    });
    return best;
  }

  function updateSlide(){
    slides.forEach(function(slide, i){
      slide.classList.toggle("is-active", i === index);
      slide.setAttribute("aria-hidden", presenting && i !== index ? "true" : "false");
    });
    currentEl.textContent = String(index + 1);
    document.querySelector("[data-prev-slide]").disabled = index === 0;
    document.querySelector("[data-next-slide]").disabled = index === slides.length - 1;
    if (presenting) {
      history.replaceState(null, "", "#" + (slides[index].id || "slide-" + (index + 1)));
    }
  }

  function requestFullScreen(){
    var root = document.documentElement;
    if (!document.fullscreenElement && root.requestFullscreen) {
      root.requestFullscreen().catch(function(){});
    }
  }

  function enterPresentation(startIndex, requestFullScreenOnStart){
    presenting = true;
    index = typeof startIndex === "number" ? startIndex : nearestSlideIndex();
    document.body.classList.add("deck-is-presenting");
    updateSlide();
    if (requestFullScreenOnStart !== false) {
      requestFullScreen();
    }
  }

  function exitPresentation(){
    presenting = false;
    document.body.classList.remove("deck-is-presenting");
    slides.forEach(function(slide){ slide.setAttribute("aria-hidden", "false"); });
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(function(){});
    }
    slides[index].scrollIntoView({ block: "start" });
  }

  function go(delta){
    if (!presenting) enterPresentation(nearestSlideIndex());
    index = Math.max(0, Math.min(slides.length - 1, index + delta));
    updateSlide();
  }

  function goTo(nextIndex){
    if (!presenting) enterPresentation(nextIndex);
    index = Math.max(0, Math.min(slides.length - 1, nextIndex));
    updateSlide();
  }

  document.querySelectorAll("[data-start-presentation]").forEach(function(button){
    button.addEventListener("click", function(){ enterPresentation(nearestSlideIndex()); });
  });
  document.querySelector("[data-prev-slide]").addEventListener("click", function(){ go(-1); });
  document.querySelector("[data-next-slide]").addEventListener("click", function(){ go(1); });
  document.querySelector("[data-exit-presentation]").addEventListener("click", exitPresentation);
  document.querySelector("[data-toggle-fullscreen]").addEventListener("click", function(){
    if (!presenting) enterPresentation(nearestSlideIndex());
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(function(){});
    } else {
      requestFullScreen();
    }
  });

  document.addEventListener("keydown", function(event){
    if (!presenting && !["f","F"].includes(event.key)) return;
    if (["ArrowRight","PageDown"," "].includes(event.key)) {
      event.preventDefault();
      go(1);
    } else if (["ArrowLeft","PageUp"].includes(event.key)) {
      event.preventDefault();
      go(-1);
    } else if (event.key === "Home") {
      event.preventDefault();
      goTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      goTo(slides.length - 1);
    } else if (event.key === "Escape") {
      exitPresentation();
    } else if (event.key === "f" || event.key === "F") {
      event.preventDefault();
      if (presenting) {
        if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(function(){});
        else requestFullScreen();
      } else {
        enterPresentation(nearestSlideIndex());
      }
    }
  });

  document.addEventListener("fullscreenchange", function(){
    if (presenting && !document.fullscreenElement) {
      document.body.classList.remove("deck-is-fullscreen");
    } else if (presenting) {
      document.body.classList.add("deck-is-fullscreen");
    }
  });

  updateSlide();

  if (new URLSearchParams(window.location.search).get("present") === "1") {
    var hashId = window.location.hash ? window.location.hash.slice(1) : "";
    var hashIndex = slides.findIndex(function(slide){ return slide.id === hashId; });
    enterPresentation(hashIndex >= 0 ? hashIndex : 0, false);
  }
})();
