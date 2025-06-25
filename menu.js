document.addEventListener('DOMContentLoaded', function () {
  const menuIcon = document.querySelector('.menu-icon');
  const sideMenu = document.getElementById('sideMenu');
  const sideMenuOverlay = document.getElementById('sideMenuOverlay');
  const header = document.querySelector('header');

  // Hide menu by default
  sideMenu.classList.remove('open');
  sideMenuOverlay.classList.remove('open');

  menuIcon.addEventListener('click', function (event) {
    event.preventDefault();
    const isOpen = sideMenu.classList.contains('open');
    if (isOpen) {
      sideMenu.classList.remove('open');
      sideMenuOverlay.classList.remove('open');
      header.classList.remove('dimmed');
    } else {
      sideMenu.classList.add('open');
      sideMenuOverlay.classList.add('open');
      header.classList.add('dimmed');
    }
  });
  sideMenuOverlay.addEventListener('click', function () {
    sideMenu.classList.remove('open');
    sideMenuOverlay.classList.remove('open');
    header.classList.remove('dimmed');
  });
}); 
