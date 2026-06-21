(function () {
    const uploadInput = document.getElementById('upload-data');
    const downloadBtn = document.getElementById('download-json-btn');
    const applyBtn = document.getElementById('apply-json-btn');
    const statusText = document.getElementById('upload-status');
    const fileNameDisplay = document.getElementById('file-name');
    const novelDownloadBtn = document.getElementById('novel-download-json-btn');
    const novelApplyBtn = document.getElementById('novel-apply-json-btn');

    if (!uploadInput || !downloadBtn || !applyBtn) return;

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
                formattedData = CSVToJson(e.target.result);
                statusText.textContent = "状态：数据上传成功，可以下载或应用数据。";
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
        downloadJson(formattedData, 'formatted_data.json');
    });

    applyBtn.addEventListener('click', () => {
        if (!formattedData) {
            alert("请先上传有效数据！");
            return;
        }
        applyGraphData(formattedData, "状态：数据已成功应用到图形！");
    });

    novelDownloadBtn?.addEventListener('click', () => {
        if (!window.novelExtractedData) {
            alert("请先提取小说人物关系数据！");
            return;
        }
        downloadJson(window.novelExtractedData, 'novel_characters.json');
    });

    novelApplyBtn?.addEventListener('click', () => {
        if (!window.novelExtractedData) {
            alert("请先提取小说人物关系数据！");
            return;
        }
        applyGraphData(window.novelExtractedData, "状态：小说关系图已成功应用到图形！");
        const novelStatus = document.getElementById("novel-status");
        if (novelStatus) novelStatus.textContent = "状态：小说关系图已成功应用到图形！";
    });

    function CSVToJson(csvData) {
        const rows = csvData.trim().split(/\r?\n/).map(line => line.split(",").map(cell => cell.trim()));
        const rowCount = rows.length;
        const colCount = rows[0]?.length || 0;

        if (rowCount < 2 || colCount < 2) {
            throw new Error("数据格式错误：矩阵至少需要一行表头和一个成员");
        }

        if (rows.some(row => row.length !== colCount)) {
            const rowIndex = rows.findIndex(row => row.length !== colCount) + 1;
            throw new Error(`数据格式错误：第 ${rowIndex} 行列数不一致，应为 ${colCount} 列`);
        }

        if (rowCount !== colCount) {
            throw new Error(`数据格式错误：应为 (n+1) × (n+1) 矩阵。当前行为 ${rowCount}，列为 ${colCount}`);
        }

        const members = [];
        for (let i = 1; i < colCount; i++) {
            const headerName = rows[0][i];
            const rowName = rows[i][0];
            const name = headerName || rowName;

            if (!name) {
                throw new Error(`数据格式错误：第 ${i + 1} 列缺少成员名`);
            }
            if (rowName && headerName && rowName !== headerName) {
                throw new Error(`数据格式错误：第 ${i + 1} 行成员名与表头不一致`);
            }
            members.push({ id: i.toString(), name });
        }

        const relationships = [];
        const addedPairs = new Set();

        for (let i = 1; i < rowCount; i++) {
            for (let j = 1; j < colCount; j++) {
                const cell = rows[i][j];
                if (!cell || cell === "0") continue;

                const [weightStr, relation] = cell.split("/");
                const weight = Number.parseInt(weightStr, 10);
                const rel = (relation || "未知").trim();

                if (!Number.isFinite(weight) || weight <= 0) {
                    console.warn(`忽略无效权值: ${i},${j} = ${cell}`);
                    continue;
                }

                const edgeId = `${Math.min(i, j)}-${Math.max(i, j)}`;
                if (addedPairs.has(edgeId)) continue;

                relationships.push({
                    source: i.toString(),
                    target: j.toString(),
                    weight,
                    relation: rel
                });
                addedPairs.add(edgeId);
            }
        }

        return { members, relationships };
    }

    function downloadJson(data, fileName) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    function applyGraphData(data, successMessage) {
        if (!window.parseAndDrawGraph) {
            alert("应用数据失败，请检查系统功能！");
            return;
        }

        window.parseAndDrawGraph(data, window.cy, window.graphData);
        statusText.textContent = successMessage;
    }
})();
