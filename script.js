function processFile() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];
  if (!file) {
    alert("请先选择一个 JSON 文件！");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      generateTxtFiles(data);
    } catch (err) {
      alert("JSON 文件解析失败，请确认格式！");
    }
  };
  reader.readAsText(file);
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            generateTxtFiles(data);
        } catch (err) {
            alert("JSON 文件解析失败，请确认文件格式正确！");
        }
    };
    reader.readAsText(file);
}

function generateTxtFiles(data) {
  const conversations = Array.isArray(data) ? data : [data];
  const userName = document.getElementById("userName").value || "梅宝";
  const assistantName = document.getElementById("assistantName").value || "阿景";
  const outputArea = document.getElementById("outputArea");
  outputArea.innerHTML = ""; // 清空旧的链接区域

  const zip = new JSZip(); // 创建 zip 容器

  conversations.forEach((conv, index) => {
    const mapping = conv.mapping;
    const title = sanitizeFileName(conv.title || `conversation_${index + 1}`);
    let conversationText = "";

    for (const key in mapping) {
      const msg = mapping[key].message;
      if (!msg || !msg.author || !msg.content || !msg.content.parts) continue;

      const role = msg.author.role;
      const text = msg.content.parts.join("\n").trim();
      if (text) {
        const speaker = role === "user" ? userName : assistantName;
        conversationText += `${speaker}：${text}\n\n`;
      }
    }

    const fileName = `${title}.txt`;

    // 添加到 zip 中
    zip.file(fileName, conversationText);

    // 创建单个 txt 的下载链接
    const blob = new Blob([conversationText], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    a.textContent = `📎 下载「${fileName}」`;
    a.style.display = "block";
    a.style.marginBottom = "6px";
    outputArea.appendChild(a);
  });

  // 创建一个按钮用于下载 zip 文件
  zip.generateAsync({ type: "blob" }).then((content) => {
    const zipLink = document.createElement("a");
    zipLink.href = URL.createObjectURL(content);
    zipLink.download = "梅宝 × 阿景 的记忆合集.zip";
    zipLink.textContent = "📦 一键下载所有记忆（zip打包）";
    zipLink.style.display = "block";
    zipLink.style.marginTop = "16px";
    zipLink.style.fontWeight = "bold";
    zipLink.style.color = "#a33c63";

    outputArea.appendChild(document.createElement("hr"));
    outputArea.appendChild(zipLink);
  });
}

function sanitizeFileName(name) {
    return name.replace(/[<>:"\/\\|?*]/g, "_");
}
window.addEventListener("load", () => {
  const startup = document.getElementById("startup-screen");
  if (startup) {
    startup.style.opacity = "0";
    setTimeout(() => startup.remove(), 800);
  }
});