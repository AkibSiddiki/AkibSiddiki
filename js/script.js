document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-btn');
    const contentSections = document.querySelectorAll('.content-section');
    const themeToggleButton = document.getElementById('theme-toggle');
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    const themePreferenceKey = 'theme-preference';
    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const validTabs = new Set(Array.from(contentSections, (section) => section.id));

    function getSavedTheme() {
        const savedTheme = localStorage.getItem(themePreferenceKey);
        return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : null;
    }

    function hasSavedTheme() {
        return getSavedTheme() !== null;
    }

    function getPreferredTheme() {
        const savedTheme = getSavedTheme();
        if (savedTheme) {
            return savedTheme;
        }

        return colorSchemeQuery.matches ? 'dark' : 'light';
    }

    function updateThemeToggleUI(theme) {
        if (!themeToggleButton) {
            return;
        }

        const toggleText = themeToggleButton.querySelector('.theme-toggle-text');
        const toggleIcon = themeToggleButton.querySelector('.theme-toggle-icon');
        const isDark = theme === 'dark';

        themeToggleButton.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        themeToggleButton.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');

        if (toggleText) {
            toggleText.textContent = isDark ? 'Light mode' : 'Dark mode';
        }

        if (toggleIcon) {
            toggleIcon.innerHTML = isDark
                ? '<i class="fa-solid fa-sun" aria-hidden="true"></i>'
                : '<i class="fa-solid fa-moon" aria-hidden="true"></i>';
        }
    }

    function applyTheme(theme) {
        const normalizedTheme = theme === 'dark' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', normalizedTheme);
        if (themeColorMeta) {
            themeColorMeta.setAttribute('content', normalizedTheme === 'dark' ? '#0f1013' : '#f2ede4');
        }
        updateThemeToggleUI(normalizedTheme);
    }

    function handleThemeToggle() {
        const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

        localStorage.setItem(themePreferenceKey, nextTheme);
        applyTheme(nextTheme);
    }

    function handleSystemThemeChange(event) {
        if (hasSavedTheme()) {
            return;
        }

        applyTheme(event.matches ? 'dark' : 'light');
    }

    function activateTab(tabId) {
        if (!validTabs.has(tabId)) {
            return;
        }

        navButtons.forEach((button) => {
            const isActiveButton = button.getAttribute('data-tab') === tabId;
            button.classList.toggle('active', isActiveButton);
        });

        contentSections.forEach((section) => {
            section.classList.toggle('active', section.id === tabId);
        });
    }

    function getInitialTab() {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab');
        return validTabs.has(tab) ? tab : 'profile';
    }

    function syncTabInUrl(tabId) {
        const url = new URL(window.location.href);
        url.searchParams.set('tab', tabId);
        window.history.replaceState({}, '', url);
    }

    applyTheme(getPreferredTheme());
    activateTab(getInitialTab());

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', handleThemeToggle);
    }

    if (typeof colorSchemeQuery.addEventListener === 'function') {
        colorSchemeQuery.addEventListener('change', handleSystemThemeChange);
    } else if (typeof colorSchemeQuery.addListener === 'function') {
        colorSchemeQuery.addListener(handleSystemThemeChange);
    }

    navButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            activateTab(targetTab);
            syncTabInUrl(targetTab);
        });
    });
});
