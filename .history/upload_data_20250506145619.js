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

    // cy.layout({
    //     name: 'breadthfirst',
    //     directed: true,
    //     spacingFactor: 1.5,
    //     avoidOverlap: true
    // }).run();

    cy.layout({
        name: 'cose',
        animate: true,
        nodeRepulsion: 20000,
        idealEdgeLength: 150,
        gravity: 0.1,
        numIter: 2000,
        fit: true,
        padding: 50
      }).run();      
}

window.parseAndDrawGraph = parseAndDrawGraph;
