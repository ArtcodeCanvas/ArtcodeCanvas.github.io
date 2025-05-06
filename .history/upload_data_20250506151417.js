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
            weight: rel.weight,
            relation: rel.relation,
            label: `${rel.weight}（${rel.relation}）`
        }
    }));

    cy.elements().remove();
    cy.add([...graphData.nodes, ...graphData.edges]);

    cy.layout({
        name: 'cose-bilkent',
        animate: 'end',
        randomize: true,
        nodeRepulsion: 900000,
        idealEdgeLength: 160,
        gravity: 1.2,
        numIter: 2500,
        fit: true,
        padding: 80
    }).run();
}

window.parseAndDrawGraph = parseAndDrawGraph;
