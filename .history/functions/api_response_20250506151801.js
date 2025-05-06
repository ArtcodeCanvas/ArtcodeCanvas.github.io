document.getElementById("submit-novel-btn").addEventListener("click", async () => {
    const titleInput = document.getElementById("novel-title-input").value.trim();
    const status = document.getElementById("novel-status");
    const output = document.getElementById("json-output");

    if (!titleInput) {
        status.textContent = "状态：请输入小说名称";
        return;
    }

    status.textContent = "状态：请求中，请稍候...";
    output.style.display = "none";

    const prompt = `请从小说《${titleInput}》中提取10~15位主要人物及他们之间的社会关系。每对人物关系应包括：
1. 关系强度（weight）：一个从 1 到 5 的整数，表示关系的紧密程度；
2. 关系类型（relation）：简洁的人际关系描述，如“母子”、“朋友”、“同事”等。

请按以下格式返回 JSON 数据：
{
  "members": [
    {"id": "1", "name": "人物1"},
    {"id": "2", "name": "人物2"},
    ...
  ],
  "relationships": [
    {"source": "1", "target": "2", "weight": 3, "relation": "朋友"},
    {"source": "2", "target": "3", "weight": 4, "relation": "兄弟"},
    ...
  ]
}

⚠️ 请仅返回 JSON 格式内容，不要添加任何其他文字、注释或解释。`;


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

        // 保存结果供其他按钮使用
        window.novelExtractedData = parsed;

        // 显示在页面上
        output.textContent = JSON.stringify(parsed, null, 2);
        output.style.display = "block";

        status.textContent = "状态：提取成功，结果已显示";
    } catch (error) {
        console.error("API调用失败：", error);
        status.textContent = "状态：提取失败，请检查网络或稍后重试";
    }
});
