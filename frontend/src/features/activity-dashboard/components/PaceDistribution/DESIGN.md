# PaceDistribution 设计规范

## 配色方案 🎨

### 主色调：优雅绿色系
符合运动、健康、活力的品牌调性，采用现代渐变设计。

### 颜色定义

#### 1. 普通柱状图（青绿渐变）
```css
渐变方向: 从下到上
├─ 底部: rgba(52, 211, 153, 0.6)   /* 柔和的翠绿 */
├─ 中部: rgba(16, 185, 129, 0.7)   /* 中等绿色 */
└─ 顶部: rgba(5, 150, 105, 0.8)    /* 深邃绿色 */

视觉效果: 半透明，柔和，与背景融合
阴影: 轻微底部阴影，增加立体感
```

#### 2. 平均配速柱状图（明亮翠绿渐变）
```css
渐变方向: 从下到上
├─ 底部: rgba(110, 231, 183, 0.8)  /* 明亮翠绿 */
├─ 中部: rgba(52, 211, 153, 0.9)   /* 鲜艳绿色 */
└─ 顶部: rgba(16, 185, 129, 1)     /* 饱和绿色 */

视觉效果: 明亮醒目，发光效果
特殊效果:
  - 外发光 (Glow): 4px 高斯模糊
  - 文字阴影: 0 0 20px rgba(110, 231, 183, 0.3)
  - 标记阴影: 0 0 6px rgba(110, 231, 183, 0.6)
```

#### 3. 文字颜色
```css
标题: #e2e8f0        /* 明亮灰白 */
统计值: #e2e8f0      /* 明亮灰白 */
高亮值: #6ee7b7      /* 翠绿色 + 发光效果 */
标签: #94a3b8        /* 中灰蓝 */
次要文字: #64748b    /* 深灰蓝 */
```

#### 4. 背景和边框
```css
容器背景: backdrop-filter: blur(10px)  /* 毛玻璃效果 */
网格线: rgba(148, 163, 184, 0.15)     /* 极淡灰蓝 */
空状态: #94a3b8                        /* 中灰蓝 */
```

---

## 视觉层次 📊

### Level 1: 平均配速柱（最突出）
- **颜色**: 明亮翠绿渐变
- **不透明度**: 100%
- **特效**: 外发光 + 标记圆点 + "AVG" 标签
- **目的**: 立即吸引用户注意力

### Level 2: 普通柱状图（次要）
- **颜色**: 柔和青绿渐变
- **不透明度**: 85%
- **特效**: 轻微底部阴影
- **目的**: 提供数据对比基准

### Level 3: 文字标签（辅助）
- **数量标签**: 明亮灰白 (#e2e8f0)
- **百分比标签**: 中灰蓝 (#94a3b8)
- **配速区间**: 中灰蓝，斜体旋转 -45°

### Level 4: 网格和坐标轴（背景）
- **网格线**: 虚线，极淡
- **坐标轴标签**: 小写，字母间距加大

---

## 交互效果 ✨

### 1. 鼠标悬停（Hover）
```css
柱状图:
  - opacity: 0.85 → 0.85 (保持)
  - filter: brightness(1.1)  /* 增亮 10% */
  - transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1)

标签:
  - fill: #94a3b8 → 更亮
```

### 2. 动画效果
```css
柱状图出现:
  - 从底部向上生长
  - 缓动函数: cubic-bezier(0.4, 0, 0.2, 1)
  - 持续时间: 0.8s

标签淡入:
  - opacity: 0 → 1
  - transition: 0.3s ease
```

---

## 布局规范 📐

### 容器
```css
padding: 2rem
border-radius: 12px
backdrop-filter: blur(10px)
```

### 图表尺寸
```typescript
chartWidth: 1000px
chartHeight: 500px
padding: {
  top: 40px,
  right: 60px,
  bottom: 100px,  /* 为旋转标签留空间 */
  left: 80px
}
```

### 柱状图
```typescript
barWidth: 动态计算 = (plotWidth - gaps) / rangeCount
barGap: 20px
borderRadius: 6px
```

### 文字
```css
标题: 1.5rem, 600, -0.02em
统计值: 1.5rem, 600, -0.02em
统计标签: 0.75rem, 500, uppercase, 0.05em
柱状图数值: 13px, 600
柱状图标签: 11px, 500
坐标轴: 11px, 500, uppercase, 0.05em
```

---

## 响应式设计 📱

### 桌面端 (> 1024px)
- 完整尺寸显示
- 所有标签可见
- 悬停效果完整

### 平板端 (768px - 1024px)
```css
padding: 1.5rem
title: 1.25rem
statValue: 1.25rem
```

### 移动端 (< 768px)
```css
padding: 1rem
title: 1.125rem
statValue: 1.125rem
barLabel: 9px
barValue: 11px
axisLabel: 9px
```

---

## 特殊效果实现 🌟

### 1. 毛玻璃背景
```css
backdrop-filter: blur(10px)
```
**效果**: 半透明背景，与下层内容融合

### 2. 发光效果（平均配速柱）
```svg
<filter id="avgGlow">
  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
  <feMerge>
    <feMergeNode in="coloredBlur"/>
    <feMergeNode in="SourceGraphic"/>
  </feMerge>
</filter>
```
**效果**: 柱状图周围有柔和的绿色光晕

### 3. 阴影效果（普通柱）
```svg
<filter id="barShadow">
  <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
  <feOffset dx="0" dy="2" result="offsetblur"/>
  <feComponentTransfer>
    <feFuncA type="linear" slope="0.3"/>
  </feComponentTransfer>
  <feMerge>
    <feMergeNode/>
    <feMergeNode in="SourceGraphic"/>
  </feMerge>
</filter>
```
**效果**: 底部轻微阴影，增加立体感

### 4. 文字发光（高亮值）
```css
text-shadow: 0 0 20px rgba(110, 231, 183, 0.3)
```
**效果**: 文字周围有淡绿色光晕

---

## 设计原则 💡

### 1. **层次分明**
- 平均配速最突出（明亮 + 发光）
- 普通数据次要（柔和 + 半透明）
- 背景元素最淡（虚线 + 极淡色）

### 2. **色彩和谐**
- 统一使用绿色系
- 从柔和到明亮的渐变
- 与项目整体风格一致

### 3. **视觉舒适**
- 半透明设计，不刺眼
- 毛玻璃效果，现代感
- 适度的动画和过渡

### 4. **信息清晰**
- 关键数据高亮
- 标签位置合理
- 避免视觉拥挤

---

## 对比：优化前 vs 优化后

### 优化前 ❌
```
❌ 蓝紫渐变 (#3b82f6 → #8b5cf6)
   - 与运动主题不符
   - 颜色过于饱和
   - 缺乏层次感

❌ 纯色背景 (white)
   - 缺乏现代感
   - 与项目风格不统一

❌ 简单阴影 (box-shadow)
   - 视觉效果平淡
   - 缺乏特色
```

### 优化后 ✅
```
✅ 绿色渐变 (青绿 → 翠绿 → 深绿)
   - 符合运动健康主题
   - 颜色柔和舒适
   - 层次分明

✅ 毛玻璃背景 (backdrop-filter)
   - 现代设计感
   - 与项目统一风格

✅ SVG 滤镜效果 (glow + shadow)
   - 视觉精致
   - 平均配速突出
   - 立体感强
```

---

## 颜色参考

### Tailwind CSS 对应
```css
翠绿-400: #6ee7b7  /* 高亮色 */
翠绿-500: #34d399  /* 主色调 */
翠绿-600: #10b981  /* 深色 */
翠绿-700: #059669  /* 最深色 */

灰蓝-400: #94a3b8  /* 标签 */
灰蓝-500: #64748b  /* 次要文字 */
灰蓝-200: #e2e8f0  /* 主要文字 */
```

### 设计工具色值
```
Figma / Sketch:
- Primary: #34D399
- Highlight: #6EE7B7
- Text: #E2E8F0
- Label: #94A3B8
```

---

## 总结

这套配色方案：
- 🎨 **视觉和谐**: 统一的绿色系，符合运动主题
- ✨ **现代精致**: 渐变、毛玻璃、发光效果
- 📊 **层次清晰**: 平均配速突出，数据对比明显
- 🔄 **交互流畅**: 平滑的过渡动画
- 📱 **响应友好**: 适配多种屏幕尺寸

完美融入 Visual Bio 的整体设计语言！
