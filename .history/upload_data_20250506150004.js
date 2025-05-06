// content: 包含社交网络数据的对象，包含了网络的节点（成员）和边（成员之间的关系）。
// cy: Cytoscape.js 实例
// graphData: 一个对象，用来存储图形的数据，节点和边等

function parseAndDrawGraph(content, cy, graphData) {
    graphData.nodes = content.members.map(member => ({
        data: {
            id: member.id,
            label: member.name
        }
    }));

    graphData.edges = content.relationships.map(rel => ({
        data: {
            id: `edge${rel.source}-${rel.target}`,
            source: rel.source,
            target: rel.target,
            weight: rel.weight
        }
    }));

    cy.elements().remove();
    cy.add([...graphData.nodes, ...graphData.edges]);

    cy.layout({
        name: 'cose-bilkent',
        animate: 'end',
        randomize: true,
        gravityRangeCompound: 2,
        nodeRepulsion: 900000,
        idealEdgeLength: 160,
        edgeElasticity: 0.1,
        nestingFactor: 0.8,
        gravity: 1.2,
        numIter: 2500,
        tile: true,
        fit: true,
        padding: 80
    }).run();
}

window.parseAndDrawGraph = parseAndDrawGraph;
