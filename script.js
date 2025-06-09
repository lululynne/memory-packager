function processFile() {
  const fileInput = document.getElementById("fileInput");
  const userName = document.getElementById("userName").value || "梅宝";
  const assistantName = document.getElementById("assistantName").value || "阿景";

  if (!fileInput.files.length) {
    alert("请上传一个 JSON 文件！");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const json = JSON.parse(e.target.result);
    const outputArea = document.getElementById("outputArea");
    outputArea.innerHTML = ""; // 清空旧内容

    json.forEach((conversation, index) => {
      const fileName = conversation.title || `窗口${index + 1}`;
      let content = "";

      conversation.messages.forEach(msg => {
        if (msg.role === "user") {
          content += `${userName}：${msg.content}\n`;
        } else if (msg.role === "assistant") {
          content += `${assistantName}：${msg.content}\n`;
        }
      });

      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.txt`;
      link.textContent = `下载「${fileName}.txt」`;
      link.style.display = "block";

      outputArea.appendChild(link);
    });
  };

  reader.readAsText(fileInput.files[0]);
}