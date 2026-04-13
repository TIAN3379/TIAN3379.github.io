(function () {
  function isHomePage() {
    var path = window.location.pathname;
    return path === "/" || path === "/index.html";
  }

  function buildEntry() {
    var wrapper = document.createElement("div");
    wrapper.className = "home-admin-entry";

    var primary = document.createElement("a");
    primary.className = "home-admin-entry__button";
    primary.href = "/admin/";
    primary.textContent = "写文章并发布";

    var secondary = document.createElement("a");
    secondary.className = "home-admin-entry__secondary";
    secondary.href = "/admin/";
    secondary.textContent = "更换站点图片";

    var tertiary = document.createElement("a");
    tertiary.className = "home-admin-entry__secondary";
    tertiary.href = "/archives/";
    tertiary.textContent = "查看已发布文章";

    var hint = document.createElement("p");
    hint.className = "home-admin-entry__hint";
    hint.textContent = "进入后台后可以发文章，也可以在站点设置里直接更换头像、横幅和图标。";

    wrapper.appendChild(primary);
    wrapper.appendChild(secondary);
    wrapper.appendChild(tertiary);
    wrapper.appendChild(hint);
    return wrapper;
  }

  function mountEntry() {
    if (!isHomePage() || document.querySelector(".home-admin-entry")) {
      return;
    }

    var target = document.getElementById("subtitle-wrap") || document.getElementById("header-title");
    if (!target || !target.parentNode) {
      return;
    }

    target.insertAdjacentElement("afterend", buildEntry());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountEntry);
  } else {
    mountEntry();
  }
})();
