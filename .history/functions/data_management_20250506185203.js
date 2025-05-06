const uploadInput = document.getElementById('upload-data');
const downloadBtn = document.getElementById('download-json-btn');
const applyBtn = document.getElementById('apply-json-btn');
const statusText = document.getElementById('upload-status');
const fileNameDisplay = document.getElementById('file-name');

let formattedData = null;

uploadInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) {
        statusText.textContent = "状态：未选择文件";
        fileNameDisplay.textContent = "未选择文件";
        return;
    }

    fileNameDisplay.textContent = file.name;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const csvData = e.target.result;
            formattedData = CSVToJson(csvData);
            statusText.textContent = "状态：数据上传成功！可以下载或应用数据。";
            console.log("Formatted Data:", formattedData);
        } catch (error) {
            statusText.textContent = `状态：上传失败 - ${error.message}`;
            console.error("Upload Error:", error);
        }
    };
    reader.readAsText(file);
});

downloadBtn.addEventListener('click', () => {
    if (!formattedData) {
        alert("请先上传有效数据！");
        return;
    }
    const blob = new Blob([JSON.stringify(formattedData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'formatted_data.json';
    link.click();
});

applyBtn.addEventListener('click', () => {
    if (!formattedData) {
        alert("请先上传有效数据！");
        return;
    }
    if (window.parseAndDrawGraph) {
        window.parseAndDrawGraph(formattedData, window.cy, window.graphData);
        window.cy.layout({
            name: 'breadthfirst',
            directed: true,
            spacingFactor: 1.5,
            avoidOverlap: true
        }).run();
        statusText.textContent = "状态：数据已成功应用到图形！";
    } else {
        alert("应用数据失败，请检查系统功能！");
    }
});

function CSVToJson(csvData) {
    const rows = csvData.trim().split("\n").map(row => row.split(","));
    const rowCount = rows.length;            // e.g. 7
    const colCount = rows[0].length;         // e.g. 7

    if (rows.some(row => row.length !== colCount)) {
    throw new Error(`数据格式错误：某些行的列数不一致，应为 ${colCount} 列`);
    }

    // 关键判断改为：是否是一个 n+1 x n+1 的关系矩阵
    if (rowCount !== colCount - 1) {
    throw new Error(`数据格式错误：应为 (n+1) x (n+1) 的矩阵。当前行为 ${rowCount}，列为 ${colCount}，应满足 行数 = 列数 - 1`);
    }


    const members = [];
    for (let i = 1; i < size; i++) {
        members.push({ id: i.toString(), name: rows[i][0].trim() });
    }

    const relationships = [];
    const addedPairs = new Set();

    for (let i = 1; i < size; i++) {
        for (let j = 1; j < size; j++) {
            if (i === j) continue;

            const cell = rows[i][j].trim();
            if (!cell || cell === "0") continue;

            const [weightStr, relation] = cell.split(/[,，]/);  // 支持中英文逗号
            const weight = parseInt(weightStr, 10);

            if (isNaN(weight) || weight < 1 || weight > 5) {
                console.warn(`忽略无效权值: ${i}-${j} = ${cell}`);
                continue;
            }

            const edgeId = `${Math.min(i, j)}-${Math.max(i, j)}`;
            if (addedPairs.has(edgeId)) continue;

            relationships.push({
                source: i.toString(),
                target: j.toString(),
                weight: weight,
                relation: (relation || "未知").trim()
            });
            addedPairs.add(edgeId);
        }
    }

    return { members, relationships };
}

// =============== 小说人物提取相关功能 ===============
const novelDownloadBtn = document.getElementById('novel-download-json-btn');
const novelApplyBtn = document.getElementById('novel-apply-json-btn');

novelDownloadBtn.addEventListener('click', () => {
    if (!window.novelExtractedData) {
        alert("请先提取小说人物关系数据！");
        return;
    }
    const blob = new Blob([JSON.stringify(window.novelExtractedData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'novel_characters.json';
    link.click();
});

novelApplyBtn.addEventListener('click', () => {
    if (!window.novelExtractedData) {
        alert("请先提取小说人物关系数据！");
        return;
    }
    if (window.parseAndDrawGraph) {
        window.parseAndDrawGraph(window.novelExtractedData, window.cy, window.graphData);
        window.cy.layout({
            name: 'breadthfirst',
            directed: true,
            spacingFactor: 1.5,
            avoidOverlap: true
        }).run();
        document.getElementById("novel-status").textContent = "状态：小说关系图已成功应用到图形！";
    } else {
        alert("应用数据失败，请检查系统功能！");
    }
});
