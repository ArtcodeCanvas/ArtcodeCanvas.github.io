document.getElementById("submit-novel-btn").addEventListener("click", async () => {
    const titleInput = document.getElementById("novel-title-input").value.trim();
    const status = document.getElementById("novel-status");

    if (!titleInput) {
        status.textContent = "状态：请输入小说名称";
        return;
    }

    status.textContent = "状态：请求中，请稍候...";

    const prompt = `请从小说《${titleInput}》中提取十位主要人物以及他们之间的关系强度，并返回如下格式的JSON：
{
  "members": [
    {"id": "1", "name": "人物1"},
    ...
    {"id": "10", "name": "人物10"}
  ],
  "relationships": [
    {"source": "1", "target": "2", "weight": 3},
    ...
  ]
}
只返回JSON格式内容，不要添加任何其他说明文字。`;

    try {
        const response = await fetch("https://api-inference.modelscope.cn/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer e8e30449-5622-4486-aeb9-e44e45badd78"
            },
            body: JSON.stringify({
                model: "Qwen/Qwen2.5-7B-Instruct",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: prompt }
                ],
                stream: false
            })
        });

        const result = await response.json();
        const content = result.choices[0].message.content.trim();
        const parsed = JSON.parse(content);

        console.log("提取结果：", parsed);

        // 可选后续逻辑：例如自动下载为JSON
        const blob = new Blob([JSON.stringify(parsed, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${titleInput}_人物关系图.json`;
        link.click();

        status.textContent = "状态：提取成功，JSON已下载";
    } catch (error) {
        console.error("API调用失败：", error);
        status.textContent = "状态：提取失败，请稍后重试";
    }
});
