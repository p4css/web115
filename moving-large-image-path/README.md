# Moving a Large Image — Camera Path Edition

這個版本把原本以 `background-position` 控制大型背景圖的案例，重製成大型 DOM 世界與 SVG 攝影機路徑。

## 核心差異

原版：

- 圖片是 CSS background。
- 捲動時改變 `background-position-x` 與 `background-position-y`。

重製版：

- 圖片是世界中的 `<img>` 元素。
- SVG path 定義頭部、腳部、側身腳部與側身頭部的巡覽路線。
- 垂直捲動轉成路徑進度。
- JavaScript 用 `getPointAtLength()` 取得焦點座標。
- 整個 `.world` 以反向 `translate3d()` 移動，讓焦點保持在畫面中央。

## 本機預覽

```bash
python3 -m http.server 8000 --directory web115.github.io
```

開啟 `http://localhost:8000/moving-large-image-path/`。
