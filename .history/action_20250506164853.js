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

        const minWidth = 200;
        const maxWidth = window.innerWidth - 200;

        if (newLeftWidth >= minWidth && newLeftWidth <= maxWidth) {
            leftPane.style.flex = `0 0 ${newLeftWidth}px`;
            rightPane.style.flex = `0 0 ${window.innerWidth - newLeftWidth - divider.offsetWidth}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            document.body.style.cursor = 'default';
        }
    });
};

window.loadSection = async function (url, queryContainerId, resultContainerId) {
    const queryContainer = document.getElementById(queryContainerId);
    const resultContainer = document.getElementById(resultContainerId);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load ${url}: ${response.status} ${response.statusText}`);
        }
        const html = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const queryContent = doc.getElementById('query-content');
        const resultContent = doc.getElementById('result-content');

        queryContainer.innerHTML = queryContent ? queryContent.innerHTML : '';
        resultContainer.innerHTML = resultContent ? resultContent.innerHTML : '';

        const scripts = doc.querySelectorAll('script');
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            if (oldScript.src) {
                newScript.src = oldScript.src;
                newScript.async = false;
            } else {
                newScript.textContent = oldScript.textContent;
            }
            if (oldScript.type) {
                newScript.type = oldScript.type;
            }
            document.body.appendChild(newScript);
        });

        if (url.includes('visualization_options.html')) {
            initialVisual();
        }
    } catch (error) {
        console.error(error);
        queryContainer.innerHTML = '无法加载查询界面';
        resultContainer.innerHTML = '无法加载结果界面';
    }
};

function initialVisual() {
    const toggleIds = document.getElementById('toggle-ids');
    const palettes = document.querySelectorAll('.palette-row');
    const cy = window.cy;
    let lastSelected = null;
  
    // 序号切换功能
    toggleIds.addEventListener('change', (event) => {
      const isChecked = event.target.checked;
      cy.nodes().forEach(node => {
        const label = isChecked ? `${node.id()} ${node.data('label')}` : node.data('label');
        node.style('label', label);
      });
    });
  
    // 初始化时触发一次
    toggleIds.checked = false;
    toggleIds.dispatchEvent(new Event('change'));
  
    // 配色方案选择
    palettes.forEach(palette => {
      palette.addEventListener('click', () => {
        const colors = JSON.parse(palette.getAttribute('data-colors'));
  
        // 将每个节点染成随机颜色
        cy.nodes().forEach(node => {
          const color = colors[Math.floor(Math.random() * colors.length)];
          node.style('background-color', color);
        });
  
        // 高亮选中项
        if (lastSelected) lastSelected.classList.remove('selected');
        palette.classList.add('selected');
        lastSelected = palette;
      });
    });
  }


function initialVisual() {
    const toggleIds = document.getElementById('toggle-ids');
    const palettes = document.querySelectorAll('.palette-row');
    const cy = window.cy;
    let lastSelected = null;
  
    // 序号切换功能
    toggleIds.addEventListener('change', (event) => {
      const isChecked = event.target.checked;
      cy.nodes().forEach(node => {
        const label = isChecked ? `${node.id()} ${node.data('label')}` : node.data('label');
        node.style('label', label);
      });
    });
  
    toggleIds.checked = false;
    toggleIds.dispatchEvent(new Event('change'));
  
    // 配色方案选择
    palettes.forEach(palette => {
      palette.addEventListener('click', () => {
        const colors = JSON.parse(palette.getAttribute('data-colors'));
        cy.nodes().forEach(node => {
          const color = colors[Math.floor(Math.random() * colors.length)];
          node.style('background-color', color);
        });
        if (lastSelected) lastSelected.classList.remove('selected');
        palette.classList.add('selected');
        lastSelected = palette;
      });
    });
  
    // 自动分组染色
    const autoColorBtn = document.getElementById('auto-color-button');
    autoColorBtn.addEventListener('click', () => {
      if (typeof cy.elements().louvain !== 'function') {
        alert('Louvain 社区检测插件未正确加载。');
        return;
      }
  
      const result = cy.elements().louvain();
      const colorPalette = [
        '#FF6B6B', '#6BCB77', '#4D96FF', '#FFD93D', '#9D4EDD', '#FF9F1C',
        '#F94144', '#2A9D8F', '#8ECAE6', '#E76F51', '#B5838D', '#219EBC'
      ];
      const groupColors = {};
      Object.keys(result).forEach(nodeId => {
        const group = result[nodeId];
        if (!(group in groupColors)) {
          const availableColors = colorPalette.filter(c => !Object.values(groupColors).includes(c));
          groupColors[group] = availableColors[Math.floor(Math.random() * availableColors.length)];
        }
        const node = cy.getElementById(nodeId);
        node.style('background-color', groupColors[group]);
      });
    });
  }
  