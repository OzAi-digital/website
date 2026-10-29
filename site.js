/* OzAI Digital — shared site behaviour (no dependencies).
   - Mobile nav drawer (.nav-toggle inside .nav)
   - .is-scrolled on .nav once the page scrolls
   - Scroll reveal for .reveal elements (pair with the inline
     `document.documentElement.classList.add('js')` in <head>) */
(function(){
  var d = document;
  var root = d.documentElement;
  root.classList.add("js");

  var nav = d.querySelector(".nav");
  var toggle = d.querySelector(".nav-toggle");

  if (nav && toggle) {
    var setOpen = function(open){
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    toggle.addEventListener("click", function(){
      setOpen(!nav.classList.contains("is-open"));
    });
    nav.addEventListener("click", function(e){
      if (e.target.closest && e.target.closest(".nav-links a")) setOpen(false);
    });
    d.addEventListener("keydown", function(e){
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
    var wide = window.matchMedia("(min-width: 961px)");
    var onWide = function(e){ if (e.matches) setOpen(false); };
    if (wide.addEventListener) wide.addEventListener("change", onWide);
  }

  if (nav) {
    var onScroll = function(){ nav.classList.toggle("is-scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  var items = d.querySelectorAll(".reveal");
  if (!items.length) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach(function(el){ el.classList.add("is-visible"); });
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
  items.forEach(function(el){ io.observe(el); });
})();
