(function () {
  var CONFIG_CACHE_KEY = "reimu-theme-config-main";
  var currentAvatarPath = "";
  var avatarObserver = null;

  function getRepoConfigUrl() {
    return "https://raw.githubusercontent.com/TIAN3379/TIAN3379.github.io/main/_config.reimu.yml";
  }

  function parseCustomAvatar(configText) {
    var match = configText.match(/^\s*custom_avatar:\s*(.+)\s*$/m);
    if (!match) return "";

    var value = match[1].trim();
    if (!value || value === '""' || value === "''" || value === "null") {
      return "";
    }

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    return value;
  }

  function applyAvatar(avatarPath) {
    if (!avatarPath) return;
    currentAvatarPath = avatarPath;

    var nodes = document.querySelectorAll('.sidebar-author img[data-src], .sidebar-author img[src]');
    if (!nodes.length) return;

    nodes.forEach(function (node) {
      node.setAttribute("data-src", avatarPath);
      node.setAttribute("src", avatarPath);
      node.removeAttribute("srcset");
      node.removeAttribute("data-srcset");
      node.classList.remove("lazyload", "lazyloading");
      node.classList.add("lazyloaded");
      node.loading = "eager";
    });
  }

  function watchAvatarNodes() {
    if (avatarObserver || !window.MutationObserver) return;

    avatarObserver = new MutationObserver(function () {
      if (currentAvatarPath) {
        applyAvatar(currentAvatarPath);
      }
    });

    avatarObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src", "data-src", "class"]
    });
  }

  function syncAvatarFromConfig() {
    var cached = window.sessionStorage && sessionStorage.getItem(CONFIG_CACHE_KEY);
    if (cached) {
      applyAvatar(parseCustomAvatar(cached));
    }

    fetch(getRepoConfigUrl(), { cache: "no-store" })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Failed to fetch theme config");
        }
        return response.text();
      })
      .then(function (text) {
        if (window.sessionStorage) {
          sessionStorage.setItem(CONFIG_CACHE_KEY, text);
        }
        applyAvatar(parseCustomAvatar(text));
      })
      .catch(function () {
        // Keep the current avatar when config fetch fails.
      });
  }

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
    document.addEventListener("DOMContentLoaded", function () {
      watchAvatarNodes();
      syncAvatarFromConfig();
      mountEntry();
    });
  } else {
    watchAvatarNodes();
    syncAvatarFromConfig();
    mountEntry();
  }
})();
