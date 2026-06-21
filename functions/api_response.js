const submitNovelBtn = document.getElementById("submit-novel-btn");

if (submitNovelBtn) {
submitNovelBtn.addEventListener("click", async () => {
    const titleInput = document.getElementById("novel-title-input").value.trim();
    const status = document.getElementById("novel-status");
    const output = document.getElementById("json-output");

    if (!titleInput) {
        status.textContent = "状态：请输入小说名称";
        return;
    }

    status.textContent = "状态：请求中，请稍候...";
    output.style.display = "none";

    const prompt = `请从小说《${titleInput}》中提取10到15位主要人物，并构建他们之间的关系图谱。

要求如下：
1. 每位人物使用唯一 id 和对应中文姓名表示；
2. 对每一对人物，给出关系强度 weight，范围为 1 到 5，并给出 relation 关系类型；
3. 尽量覆盖亲情、友情、爱情、敌对、师徒、同事、上下级等多样关系；
4. 关系应尽量基于原著中出现或暗示的人物互动；
5. 仅输出 JSON，不要输出 Markdown、代码块或解释文字。

JSON 格式必须为：
{
  "members": [
    {"id": "1", "name": "人物姓名1"},
    {"id": "2", "name": "人物姓名2"}
  ],
  "relationships": [
    {"source": "1", "target": "2", "weight": 4, "relation": "朋友"}
  ]
}`;

    try {
        const response = await fetch("https://api-inference.modelscope.cn/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer ms-bedf7c77-a70b-4640-8b16-ecbb460b70fd"
            },
            body: JSON.stringify({
                model: "Qwen/Qwen3-VL-8B-Instruct",
                messages: [
                    { role: "system", content: "你是一个只输出合法 JSON 的人物关系抽取助手。" },
                    { role: "user", content: prompt }
                ],
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`接口返回 ${response.status}`);
        }

        const result = await response.json();
        const content = result.choices?.[0]?.message?.content;
        if (!content) {
            throw new Error("接口未返回可解析内容");
        }

        const parsed = parseModelJson(content);
        validateGraphData(parsed);

        window.novelExtractedData = parsed;
        output.textContent = JSON.stringify(parsed, null, 2);
        output.style.display = "block";
        status.textContent = "状态：提取成功，结果已显示";
    } catch (error) {
        console.error("API 调用失败：", error);
        status.textContent = `状态：提取失败，${error.message || "请检查网络或稍后重试"}`;
    }
});
}

function parseModelJson(content) {
    let text = String(content).trim();

    if (text.startsWith("```")) {
        text = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
    }

    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1) {
        text = text.slice(firstBrace, lastBrace + 1);
    }

    return JSON.parse(text);
}

function validateGraphData(data) {
    if (!Array.isArray(data.members) || !Array.isArray(data.relationships)) {
        throw new Error("返回 JSON 缺少 members 或 relationships");
    }

    data.members.forEach((member, index) => {
        if (!member.id || !member.name) {
            throw new Error(`第 ${index + 1} 个人物缺少 id 或 name`);
        }
        member.id = String(member.id);
    });

    const memberIds = new Set(data.members.map(member => member.id));
    data.relationships.forEach((relationship, index) => {
        relationship.source = String(relationship.source);
        relationship.target = String(relationship.target);
        relationship.weight = Number(relationship.weight);

        if (!memberIds.has(relationship.source) || !memberIds.has(relationship.target)) {
            throw new Error(`第 ${index + 1} 条关系引用了不存在的人物`);
        }
        if (!Number.isFinite(relationship.weight) || relationship.weight < 1 || relationship.weight > 5) {
            throw new Error(`第 ${index + 1} 条关系权重无效`);
        }
        if (!relationship.relation) {
            relationship.relation = "未知";
        }
    });
}
