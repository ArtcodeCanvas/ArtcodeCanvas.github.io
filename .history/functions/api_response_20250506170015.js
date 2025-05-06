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

    const prompt = `请从小说《${titleInput}》中提取10~15位主要人物，并构建他们之间的关系图谱。

    要求如下：
    1. 每位人物使用唯一 id 和对应中文姓名表示；
    2. 对每一对人物，给出他们的：
       - 关系强度（weight）：表示他们之间关系的紧密程度，范围为 1~5；
       - 关系类型（relation）：用简洁词语描述关系，如“母子”、“恋人”、“朋友”、“敌人”、“上下属”等；
    3. 请尽量覆盖多样化的人物关系类型（如亲情、友情、爱情、敌意、同事等），不要只生成单一关系；
    4. 所有人物关系应真实反映原著中出现或暗示的人物互动，不要虚构关系；
    5. 格式必须严格如下，仅输出 JSON 数据（不要添加任何其他解释说明）：
    
    {
      "members": [
        {"id": "1", "name": "人物姓名1"},
        {"id": "2", "name": "人物姓名2"},
        ...
      ],
      "relationships": [
        {"source": "1", "target": "2", "weight": 4, "relation": "朋友"},
        {"source": "1", "target": "3", "weight": 5, "relation": "母子"},
        ...
      ]
    }
    
    ⚠️ 请确保只输出上述格式的 JSON 数据，直接输出完整的json数据，一定不要输出任何注释、解释或非 JSON 内容。`;    


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
