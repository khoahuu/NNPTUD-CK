const newsList = document.getElementById("news-list");
const newsDetailSection = document.getElementById("news-detail-section");
const newsDetail = document.getElementById("news-detail");
const backButton = document.getElementById("back-button");

async function fetchNews() {
  try {
    const res = await fetch("/news");
    const json = await res.json();
    if (!json.success) {
      newsList.innerHTML = "<p>Không tải được tin tức.</p>";
      return;
    }

    if (!json.data || !json.data.length) {
      newsList.innerHTML = "<p>Chưa có tin tức nào. Hãy quay lại sau.</p>";
      return;
    }

    newsList.innerHTML = json.data
      .map(
        (item) => `
          <div class="news-card">
            <h3>${item.title}</h3>
            <p>${item.summary || "Không có mô tả ngắn."}</p>
            <div class="meta">${new Date(item.published_at).toLocaleDateString("vi-VN")}</div>
            <button onclick="showNewsDetail(${item.id})">Xem chi tiết</button>
          </div>
        `
      )
      .join("");
  } catch (error) {
    newsList.innerHTML = "<p>Có lỗi khi kết nối tới server.</p>";
  }
}

async function showNewsDetail(id) {
  try {
    const res = await fetch(`/news/${id}`);
    const json = await res.json();
    if (!json.success) {
      alert("Không tìm thấy tin tức.");
      return;
    }

    const item = json.data;
    newsDetail.innerHTML = `
      <h2>${item.title}</h2>
      <div class="meta">${new Date(item.published_at).toLocaleDateString("vi-VN")}</div>
      ${item.image_url ? `<img src="${item.image_url}" alt="${item.title}" />` : ""}
      <p>${item.content || item.summary || "Không có nội dung."}</p>
    `;
    newsDetailSection.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    alert("Lỗi khi lấy nội dung tin tức.");
  }
}

backButton.addEventListener("click", () => {
  newsDetailSection.classList.add("hidden");
});

fetchNews();
