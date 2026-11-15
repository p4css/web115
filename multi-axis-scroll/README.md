# Multi-axis Scroll Demo

這是一個 clean-room 教學實作，示範如何把垂直捲動轉換成大型二維 DOM 世界中的橫向、直向與斜向鏡頭運動。

## 核心結構

- `body` 提供長距離的垂直捲動進度。
- `.viewport` 固定在瀏覽器視窗並裁切超出範圍的內容。
- `.world` 是 7200 × 4500px 的二維內容平面。
- `#camera-path` 是 SVG 路徑，定義鏡頭焦點的移動路線。
- `script.js` 使用 `getPointAtLength()` 取得路徑座標，再以反向 `translate3d()` 移動 `.world`。

## 本機預覽

從 `web115` workspace 執行：

```bash
python3 -m http.server 8000 --directory web115.github.io
```

開啟 `http://localhost:8000/multi-axis-scroll/`。

## 使用限制

此 demo 僅重製互動原理。所有版面、文字與圖形均為本專案原創，未複製參考網站的文章、品牌素材或程式碼。
