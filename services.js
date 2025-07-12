// Show username in header if logged in
function showUserUIOnHeader() {
  const userInfo = document.getElementById("user-info");
  const token = localStorage.getItem("access");
  if (token) {
    fetch("http://127.0.0.1:8000/api/profile/", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        userInfo.textContent = `Welcome, ${data.username}`;
      });
  } else {
    userInfo.textContent = "";
  }
}
showUserUIOnHeader();
// Menu icon click
const menuIcon = document.getElementById("menu-icon");
if (menuIcon) {
  menuIcon.addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("sideMenu").classList.toggle("open");
    document.getElementById("sideMenuOverlay").classList.toggle("open");
  });
}
// User icon click: if logged in, go to profile; if not, open modal
const userIcon = document.getElementById("user-icon");
if (userIcon) {
  userIcon.addEventListener("click", function (e) {
    e.preventDefault();
    const token = localStorage.getItem("access");
    if (token) {
      window.location.href = "profile.html";
    } else {
      document.getElementById("accountModal").style.display = "flex";
      document.body.classList.add("modal-blur");
      document.documentElement.classList.add("modal-blur");
    }
  });
} 