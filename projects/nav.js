document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired');
    fetch('nav.html')
        .then(response => response.text())
        .then(data => {
            console.log('nav.html successfully loaded');
            document.getElementById('nav-placeholder').innerHTML = data;
            setTimeout(() => {
                loadNavigationLinks();
                triggerFirstLoadAnimation(); // 添加首次加载的动画
            }, 0);
        })
        .catch(error => console.error('加载 nav.html 失败:', error));
});

function loadNavigationLinks() {
    console.log('loadNavigationLinks called');

    const navList = document.getElementById('nav-links');
    if (!navList) {
        console.error('无法找到 #nav-links 元素');
        return;
    }

    const files = ['Sudoku.html', 'ball-and-wall.html']; // 列出项目页面文件名
    const currentPage = window.location.pathname.split('/').pop();

    files.forEach(fileName => {
        const listItem = document.createElement('li');
        const anchor = document.createElement('a');
        anchor.href = fileName;
        anchor.textContent = fileName.replace('.html', '').replace('_', ' ').toUpperCase();

        if (fileName === currentPage) {
            anchor.classList.add('active');
        }

        listItem.appendChild(anchor);
        navList.appendChild(listItem);
    });

    const sidebar = document.getElementById('sidebar');
    const toggleButton = document.getElementById('toggle-sidebar');
    const overlay = document.getElementById('page-overlay'); // 获取蒙版元素

    if (sidebar && toggleButton && overlay) {
        sidebar.addEventListener('click', () => {
            sidebar.classList.toggle('expanded');
            sidebar.classList.toggle('collapsed');

            // 显示或隐藏蒙版
            if (sidebar.classList.contains('expanded')) {
                overlay.classList.remove('hidden');
                toggleButton.textContent = '☰ 目录';
            } else {
                overlay.classList.add('hidden');
                toggleButton.textContent = '▷';
            }
        });

        overlay.addEventListener('click', () => {
            sidebar.classList.remove('expanded');
            sidebar.classList.add('collapsed');
            overlay.classList.add('hidden');
            toggleButton.textContent = '▷';
        });
    } else {
        console.error('无法找到所需的DOM元素: #toggle-sidebar, #sidebar, 或 #page-overlay');
    }
}

function triggerFirstLoadAnimation() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('page-overlay');
    const toggleButton = document.getElementById('toggle-sidebar');

    if (sidebar && overlay && toggleButton) {
        sidebar.classList.add('first-load'); 
        setTimeout(() => {
            sidebar.classList.remove('first-load');
            sidebar.classList.add('expanded');
            overlay.classList.remove('hidden');
            toggleButton.textContent = '☰ 目录';
        }, 500); 
    }
}
