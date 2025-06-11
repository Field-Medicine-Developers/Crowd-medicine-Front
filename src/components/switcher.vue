<template>
    <!-- Style switcher -->
    <div id="style-switcher" :style="{ left: switcherVisible ? '0px' : '-189px' }">
        <div class="bottom">
            <a href="javascript:void(0);" @click="toggleTheme" class="mode-btn text-white">
                <i class="mdi" :class="isDarkMode ? 'mdi-moon-waning-crescent' : 'mdi-white-balance-sunny'"></i>
            </a>
            <a href="javascript:void(0);" class="settings" @click="toggleSwitcher">
                <i class="mdi mdi-cog mdi-spin"></i>
            </a>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isDarkMode: localStorage.getItem("theme") === "dark", // Check initial theme from localStorage
            switcherVisible: false, // To control the visibility of the style switcher
        };
    },
    methods: {
        // Toggle the visibility of the style switcher
        toggleSwitcher() {
            this.switcherVisible = !this.switcherVisible;
        },
        // Toggle between light and dark themes
        toggleTheme() {
            if (this.isDarkMode) {
                document.body.removeAttribute("data-bs-theme");
                localStorage.setItem("theme", "light");
            } else {
                document.body.setAttribute("data-bs-theme", "dark");
                localStorage.setItem("theme", "dark");
            }
            this.isDarkMode = !this.isDarkMode;
        },
        // Set the color theme
        setColor(theme) {
            document.getElementById('color-opt').href = `./css/colors/${theme}.css`;
            this.toggleSwitcher();
        }
    },
    mounted() {
        // Ensure the correct theme is set on initial load
        if (this.isDarkMode) {
            document.body.setAttribute("data-bs-theme", "dark");
        } else {
            document.body.removeAttribute("data-bs-theme");
        }
    }
};
</script>

<style scoped>
#style-switcher {
    transition: left 0.3s ease;
}
</style>