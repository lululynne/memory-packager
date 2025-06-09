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

    conversations.forEach((conv, index) => {
        const mapping = conv.mapping;
        const title = sanitizeFileName(conv.title || `conversation_${index + 1}`);
        let conversationText = "";
        console.log("生成文件：", title);

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

        const blob = new Blob([conversationText], { type: 'text/plain;charset=utf-8' });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${title}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
}

function sanitizeFileName(name) {
    return name.replace(/[<>:"\/\\|?*]/g, "_");
}