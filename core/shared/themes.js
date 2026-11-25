/* Meridian's five looks, shared by background.js (which applies them) and the Settings page
   (which previews them). The colours are the same as in the prototype: the frame is the page's
   colour, parts are separated by hairlines, and the address bar is a filled grey field. */
"use strict";

const MERIDIAN_THEMES = (() => {
  // frame, hairline, field, hover, active (selected tab), press, text, icon, menu, focus, highlight, scheme
  const T = {
    light: ["#ffffff", "#e3e3e3", "#f1f1f1", "#f2f2f2", "#ebebeb", "#e2e2e2", "#1f1f1f", "#474747", "#ffffff", "#0b57d0", "#c2d7fb", "light"],
    dim:   ["#35363a", "#47484d", "#404145", "#3f4044", "#4a4b50", "#525358", "#e3e3e6", "#c9cacf", "#3d3e42", "#8ab4f8", "#4a5f86", "dark"],
    dark:  ["#1f1f1f", "#333333", "#2a2a2a", "#2a2a2a", "#333333", "#3a3a3a", "#e8e8e8", "#c7c7c7", "#2a2a2a", "#a8c7fa", "#3d5a8a", "dark"],
    eye:   ["#1c1b2e", "#2e2c47", "#26243d", "#25233b", "#302e4c", "#383657", "#ddd9ec", "#bdb8d8", "#24223a", "#a99cff", "#463f7a", "dark"],
  };
  const out = {};
  for (const [id, [frame, hair, field, hover, active, press, text, icon, menu, focus, hl, scheme]] of Object.entries(T)) {
    out[id] = {
      scheme,
      preview: { frame, field, hair },
      colors: {
        frame, frame_inactive: frame,
        tab_background_text: text, tab_text: text, tab_selected: active, tab_line: "transparent", tab_loading: focus,
        toolbar: frame, toolbar_text: text, icons: icon, icons_attention: focus,
        toolbar_field: field, toolbar_field_text: text, toolbar_field_border: "transparent",
        toolbar_field_focus: menu, toolbar_field_text_focus: text, toolbar_field_border_focus: focus,
        toolbar_field_highlight: hl, toolbar_field_highlight_text: text,
        toolbar_top_separator: "transparent", toolbar_bottom_separator: hair, toolbar_vertical_separator: hair,
        button_background_hover: hover, button_background_active: press,
        popup: menu, popup_text: text, popup_border: hair, popup_highlight: hover, popup_highlight_text: text,
        sidebar: frame, sidebar_text: text, sidebar_border: hair, sidebar_highlight: active, sidebar_highlight_text: text,
        ntp_background: frame, ntp_text: text,
      },
    };
  }
  return out;
})();

const MERIDIAN_THEME_LIST = [
  ["system", "Device"],
  ["light", "Light"],
  ["dim", "Semi-dark"],
  ["dark", "Dark"],
  ["eye", "Eye comfort"],
];
