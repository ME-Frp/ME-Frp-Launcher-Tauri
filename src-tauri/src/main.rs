// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// use tauri::menu::{Menu, MenuItem};
// use tauri::tray::{MouseButton, MouseButtonState, TrayIcon, TrayIconBuilder, TrayIconEvent};
// use tauri::Manager;

// fn create_tray(app: &tauri::App) -> Result<TrayIcon, Box<dyn std::error::Error>> {
//     let menu= Menu::with_items(
//         app,
//         &[
//             &MenuItem::with_id(app, "show", "显示主窗口", true, None::<&str>)?,
//             // &MenuItem::with_id(app, "seperator", "", false, None::<&str>)?,
//             &MenuItem::with_id(app, "quit", "退出", true, None::<&str>)?,
//         ]
//     )?;

//     let tray = TrayIconBuilder::new()
//         .menu(&menu)
//         .icon(app.default_window_icon().unwrap().clone())
//         .on_menu_event(move |app, event| match event.id.as_ref() {
//             "show" => {
//                 if let Some(window) = app.get_webview_window("main") {
//                     let _ = window.show();
//                     let _ = window.set_focus();
//                 }
//             }
//             "quit" => {
//                 app.exit(0);
//             }
//             _ => {}
//         })
//         .on_tray_icon_event(move |tray, event| match event {
//             TrayIconEvent::Click {
//                 button,
//                 button_state,
//                 ..
//             } => {
//                 if button == MouseButton::Left
//                     && button_state == MouseButtonState::Up
//                 {
//                     let app = tray.app_handle();
//                     if let Some(window) = app.get_webview_window("main") {
//                         let _ = window.show();
//                         let _ = window.set_focus();
//                     }
//                 }
//             }
//             _ => {}
//         })
//         .build(app)?;
//     Ok(tray)
// }

fn main() {
    me_frp_launcher_tauri_lib::run()
}
