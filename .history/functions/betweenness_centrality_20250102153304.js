console.log("betweenness_centrality.js加载完成");

/**
 * 使用弗洛伊德算法计算图中所有节点的介数中心性
 * @param {object} graphData - 图数据 { nodes: [], edges: [] }
 * @returns {Array} 返回按介数中心性排序的节点列表
 */

function BetweennessCentrality(graphData) {
    const n = graphData.nodes.length;
    const dis = Array.from({ length: n }, () => Array(n).fill(Infinity));
    const sum = Array.from({ length: n }, () => Array(n).fill(0));
    const ids = graphData.nodes.map(node => node.data.id);

    graphData.edges.forEach(edge => {
        const u = ids.indexOf(edge.data.source);
        const v = ids.indexOf(edge.data.target);
        const w = edge.data.weight || 1;
        dis[u][v] = dis[v][u] = w;
        sum[u][v] = sum[v][u] = 1;
    });
    for (let i = 0; i < n; i++) {
        dis[i][i] = 0;
        sum[i][i] = 1;
    }

    for (let k = 0; k < n; k++) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (i !== j && j !== k && i !== k) {
                    if (dis[i][k] + dis[k][j] === dis[i][j]) {
                        sum[i][j] += sum[i][k] * sum[k][j];
                    } else if (dis[i][k] + dis[k][j] < dis[i][j]) {
                        dis[i][j] = dis[i][k] + dis[k][j];
                        sum[i][j] = sum[i][k] * sum[k][j];
                    }
                }
            }
        }
    }

    const centrality = Array(n).fill(0);
    for (let k = 0; k < n; k++) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (
                    i !== j &&
                    k !== i &&
                    k !== j &&
                    dis[i][k] + dis[k][j] === dis[i][j] &&
                    sum[i][j] > 0
                ) {
                    centrality[k] += (sum[i][k] * sum[k][j]) / sum[i][j];
                }
            }
        }
    }

    return graphData.nodes.map((node, index) => ({
        id: node.data.id,
        label: node.data.label,
        centrality: centrality[index]
    })).sort((a, b) => b.centrality - a.centrality);
}

window.BetweennessCentrality = BetweennessCentrality;
