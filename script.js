function extractText(msg) {
  // 尝试不同路径提取内容
  if (typeof msg.content === "string") return msg.content;
  if (Array.isArray(msg.content?.parts)) return msg.content.parts.join("\n");
  if (typeof msg.text === "string") return msg.text;
  if (msg.message?.content?.parts) return msg.message.content.parts.join("\n");
  if (msg.message?.text) return msg.message.text;
  return "(未能识别内容)";
}

function processFile() {
  const fileInput = document.getElementById("fileInput");
  const userName = document.getElementById("userName").value || "梅宝";
  const assistantName = document.getElementById("assistantName").value || "阿景";
  const outputArea = document.getElementById("outputArea");
  outputArea.innerHTML = "";

  if (!fileInput.files.length) {
    alert("请上传一个 JSON 文件！");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const json = JSON.parse(e.target.result);
      const conversations = Array.isArray(json) ? json : json.conversations || json.data || [];

      if (!conversations.length) {
        alert("无法读取 JSON 中的对话内容，请确认格式！");
        return;
      }

      conversations.forEach((conversation, index) => {
        const fileName = conversation.title || `窗口${index + 1}`;
        const messages = conversation.messages || [];

        let content = "";

        messages.forEach(msg => {
          const role = msg.role || msg.author?.role || msg.message?.role;
          const text = extractText(msg);

          if (role === "user") {
            content += `${userName}：${text}\n`;
          } else if (role === "assistant") {
            content += `${assistantName}：${text}\n`;
          }
        });

        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `${fileName}.txt`;
        link.textContent = `📎 下载「${fileName}.txt」`;
        link.style.display = "block";

        outputArea.appendChild(link);
      });
    } catch (err) {
      alert("读取 JSON 文件失败，请检查格式是否正确！");
    }
  };

  reader.readAsText(fileInput.files[0]);
}
