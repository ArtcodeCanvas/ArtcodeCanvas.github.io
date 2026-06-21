window.enableDragResize = function (divider, leftPane, rightPane) {
    let isDragging = false;
    let startX;
    let startLeftWidth;

    divider.addEventListener('mousedown', (event) => {
        isDragging = true;
        startX = event.clientX;
        startLeftWidth = leftPane.offsetWidth;
        document.body.style.cursor = 'col-resize';
        event.preventDefault();
    });

    document.addEventListener('mousemove', (event) => {
        if (!isDragging) return;

        const deltaX = event.clientX - startX;
        const newLeftWidth = startLeftWidth + deltaX;
        const minWidth = 320;
        const maxWidth = window.innerWidth - 360;

        if (newLeftWidth >= minWidth && newLeftWidth <= maxWidth) {
            leftPane.style.flex = `0 0 ${newLeftWidth}px`;
            rightPane.style.flex = `0 0 ${window.innerWidth - newLeftWidth - divider.offsetWidth - 24}px`;
            window.cy?.resize();
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            document.body.style.cursor = 'default';
            window.cy?.fit(undefined, 80);
        }
    });
};

window.loadSection = async function (url, queryContainerId, resultContainerId) {
    const queryContainer = document.getElementById(queryContainerId);
    const resultContainer = document.getElementById(resultContainerId);
    const controls = document.getElementById('controls');

    try {
        removeLoadedModuleScripts();
        controls?.classList.toggle('data-management-mode', url.includes('data_management.html'));

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`加载 ${url} 失败：${response.status} ${response.statusText}`);
        }

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const queryContent = doc.getElementById('query-content');
        const resultContent = doc.getElementById('result-content');

        queryContainer.innerHTML = queryContent ? queryContent.innerHTML : '';
        resultContainer.innerHTML = resultContent ? resultContent.innerHTML : '';

        for (const oldScript of doc.querySelectorAll('script')) {
            await appendModuleScript(oldScript, url);
        }

        if (url.includes('visualization_options.html')) {
            initialVisual();
        }
    } catch (error) {
        console.error(error);
        queryContainer.innerHTML = '<p class="error-text">无法加载查询界面，请检查文件路径。</p>';
        resultContainer.innerHTML = '<p class="error-text">无法加载结果界面。</p>';
    }
};

function removeLoadedModuleScripts() {
    document.querySelectorAll('script[data-dynamic-section="true"]').forEach(script => {
        script.remove();
    });
}

function appendModuleScript(oldScript, sectionUrl) {
    return new Promise((resolve, reject) => {
        const newScript = document.createElement('script');
        newScript.dataset.dynamicSection = 'true';

        if (oldScript.type) {
            newScript.type = oldScript.type;
        }

        if (oldScript.src || oldScript.getAttribute('src')) {
            newScript.src = new URL(oldScript.getAttribute('src') || oldScript.src, window.location.href).href;
            newScript.async = false;
            newScript.onload = resolve;
            newScript.onerror = () => reject(new Error(`加载 ${sectionUrl} 中的脚本失败：${newScript.src}`));
            document.body.appendChild(newScript);
            return;
        }

        try {
            newScript.textContent = oldScript.textContent;
            document.body.appendChild(newScript);
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

function initialVisual() {
    const toggleIds = document.getElementById('toggle-ids');
    const paletteListContainer = document.querySelector('.palette-list');
    const cy = window.cy;
    let lastSelected = null;

    if (!toggleIds || !paletteListContainer || !cy) return;

    toggleIds.addEventListener('change', (event) => {
        const isChecked = event.target.checked;
        cy.nodes().forEach(node => {
            const label = isChecked ? `${node.id()} ${node.data('label')}` : node.data('label');
            node.style('label', label);
        });
    });
    toggleIds.checked = false;
    toggleIds.dispatchEvent(new Event('change'));

    fetch('color_palettes.json')
        .then(response => response.json())
        .then(data => {
            paletteListContainer.innerHTML = '';

            data.forEach(palette => {
                const row = document.createElement('div');
                row.className = 'palette-row';
                row.title = palette.name;
                row.setAttribute('data-colors', JSON.stringify(palette.colors));

                const nameSpan = document.createElement('span');
                nameSpan.className = 'palette-name';
                nameSpan.textContent = palette.name;

                const squares = document.createElement('div');
                squares.className = 'color-squares';

                palette.colors.forEach(color => {
                    const square = document.createElement('div');
                    square.className = 'color-square';
                    square.style.backgroundColor = color;
                    squares.appendChild(square);
                });

                row.appendChild(nameSpan);
                row.appendChild(squares);
                paletteListContainer.appendChild(row);

                row.addEventListener('click', () => {
                    const colors = JSON.parse(row.getAttribute('data-colors'));
                    cy.nodes().forEach((node, index) => {
                        node.style('background-color', colors[index % colors.length]);
                    });

                    if (lastSelected) lastSelected.classList.remove('selected');
                    row.classList.add('selected');
                    lastSelected = row;
                });
            });
        })
        .catch(error => {
            console.error('配色方案加载失败：', error);
            paletteListContainer.innerHTML = '<p style="color:#b42318;">无法加载配色方案。</p>';
        });
}
