import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { TrayIcon } from '@tauri-apps/api/tray';
import { Menu } from '@tauri-apps/api/menu';
import { exit } from '@tauri-apps/plugin-process'
import { getCurrentWindow } from '@tauri-apps/api/window';
import { defaultWindowIcon } from '@tauri-apps/api/app';

async function setWindowFocus() {
    const window = getCurrentWindow()
    if (!await window.isVisible()) {
        await window.show()
    }
    if (await window.isMinimized()) {
        await window.unminimize()
    }
    await window.setFocus()
}

const app = createApp(App)
app.use(router)
app.mount('#app');


(async () => {
    await TrayIcon.new({
        showMenuOnLeftClick: false,
        icon: (await defaultWindowIcon())!,
        tooltip: 'ME Frp 启动器',
        menu: await Menu.new({
            items: [
                {
                    id: 'show',
                    text: '显示主窗口',
                    action: async () => {
                        await setWindowFocus();
                    },
                },
                {
                    id: 'exit',
                    text: '退出',
                    action: async () => {
                        await exit()
                    },
                },
            ],
        }),
        action: async (event) => {
            if (event.type === 'Click' && event.button === "Left" && event.buttonState === 'Down') {
                await setWindowFocus();
            }
        }
    });
})();