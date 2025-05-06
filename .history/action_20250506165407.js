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
    const paletteListContainer = document.querySelector('.palette-list');
    const cy = window.cy;
    let lastSelected = null;
  
    // 绑定显示序号开关
    toggleIds.addEventListener('change', (event) => {
      const isChecked = event.target.checked;
      cy.nodes().forEach(node => {
        const label = isChecked ? `${node.id()} ${node.data('label')}` : node.data('label');
        node.style('label', label);
      });
    });
    toggleIds.checked = false;
    toggleIds.dispatchEvent(new Event('change'));
  
    // 动态加载配色方案
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
  
          // 点击事件：渲染节点颜色
          row.addEventListener('click', () => {
            const colors = JSON.parse(row.getAttribute('data-colors'));
            cy.nodes().forEach(node => {
              const color = colors[Math.floor(Math.random() * colors.length)];
              node.style('background-color', color);
            });
  
            if (lastSelected) lastSelected.classList.remove('selected');
            row.classList.add('selected');
            lastSelected = row;
          });
        });
      })
      .catch(err => {
        console.error('配色方案加载失败：', err);
        paletteListContainer.innerHTML = '<p style="color:red;">无法加载配色方案</p>';
      });
  }
  