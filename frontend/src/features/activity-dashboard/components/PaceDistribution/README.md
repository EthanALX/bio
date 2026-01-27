# PaceDistribution Component

## 概述

配速分布直方图组件，用于可视化用户的配速分布情况。当用户点击 "Avg Pace" 统计卡片时显示此视图。

## 功能特性

### 1. 配速分布直方图
- 将所有活动按配速区间分组
- 使用柱状图展示每个区间的活动数量
- 显示每个区间的百分比

### 2. 配速统计信息
- **最快配速**：所有活动中的最快配速
- **平均配速**：所有活动的平均配速（高亮显示）
- **最慢配速**：所有活动中的最慢配速
- **总活动数**：有效配速数据的活动总数

### 3. 可视化设计
- **颜色编码**：
  - 普通区间：蓝紫渐变
  - 平均配速所在区间：绿色渐变（高亮）
- **平均配速标记**：在包含平均配速的柱子上方显示 "AVG" 标记
- **数据标签**：每个柱子顶部显示活动数量和百分比

## 配速区间定义

```typescript
const paceRanges = [
  { label: '< 4\'00"',        minSeconds: 0,   maxSeconds: 240 },
  { label: '4\'00" - 4\'30"', minSeconds: 240, maxSeconds: 270 },
  { label: '4\'30" - 5\'00"', minSeconds: 270, maxSeconds: 300 },
  { label: '5\'00" - 5\'30"', minSeconds: 300, maxSeconds: 330 },
  { label: '5\'30" - 6\'00"', minSeconds: 330, maxSeconds: 360 },
  { label: '6\'00" - 6\'30"', minSeconds: 360, maxSeconds: 390 },
  { label: '6\'30" - 7\'00"', minSeconds: 390, maxSeconds: 420 },
  { label: '> 7\'00"',        minSeconds: 420, maxSeconds: Infinity },
];
```

## 使用方法

```tsx
import { PaceDistribution } from './components/PaceDistribution';

<PaceDistribution activities={activities} />
```

## Props

| 属性 | 类型 | 必需 | 说明 |
|------|------|------|------|
| activities | Activity[] | 是 | 活动数据数组 |

## 数据处理

### 1. 配速转换
- 输入格式：`"5'20"/km"` (字符串)
- 内部格式：`320` (秒/公里)
- 用于排序和区间划分

### 2. 数据过滤
- 自动过滤无配速数据的活动（如健身训练）
- 只统计有效的跑步/骑行活动

### 3. 统计计算
```typescript
// 活动数量
count = activities in range

// 百分比
percentage = (count / total) * 100

// 平均配速
avgPace = sum(all paces) / total activities
```

## 产品价值

### 用户洞察
1. **配速分布**：了解自己的配速主要集中在哪个区间
2. **性能基准**：识别最常见的配速水平
3. **改进空间**：发现可以提升的配速区间
4. **目标设定**：基于历史数据设定合理目标

### 使用场景
- **周期回顾**：查看一段时间内的配速分布变化
- **训练分析**：识别配速模式和训练效果
- **目标设定**：根据分布情况设定下一阶段目标
- **性能对比**：对比不同时期的配速分布

## 视觉设计

### 颜色方案
```css
/* 普通柱状图 */
gradient: #3b82f6 → #8b5cf6 (蓝紫渐变)

/* 平均配速区间 */
gradient: #22c55e → #10b981 (绿色渐变)

/* 文字颜色 */
labels: #6b7280 (灰色)
values: #1f2937 (深灰)
highlight: #22c55e (绿色)
```

### 布局尺寸
```typescript
chartWidth: 1000px
chartHeight: 500px
padding: { top: 40, right: 60, bottom: 100, left: 80 }
barWidth: 动态计算（根据区间数量）
barGap: 20px
```

## 交互特性

### 当前实现
- 鼠标悬停：柱状图透明度变化
- 点击统计卡片：切换到此视图

### 未来增强
- [ ] 点击柱状图显示该区间的所有活动
- [ ] 拖拽选择自定义配速区间
- [ ] 导出配速分布数据
- [ ] 与其他年份的配速分布对比

## 性能优化

1. **useMemo 缓存**：
   - 配速区间计算
   - 图表尺寸计算
   - 最大值计算

2. **数据预处理**：
   - 只在 activities 变化时重新计算
   - 避免不必要的渲染

## 测试

```bash
# 运行测试
pnpm test PaceDistribution

# 测试覆盖率
pnpm test:coverage PaceDistribution
```

## 示例效果

```
配速分布直方图
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

最快配速: 4'15"/km   平均配速: 5'15"/km ✓   最慢配速: 6'30"/km   总活动数: 45

活动数
  ↑
 12│                     AVG
 10│                      ●
  8│                     ███  15.6%
  6│           ███  13.3% ███
  4│     ███   ███       ███  ███
  2│ ███ ███   ███       ███  ███  ███
  0└─────────────────────────────────────→ 配速
    <4'  4'-  4'30 5'-  5'30 6'-  6'30 >7'
         4'30 -5'  5'30 -6'  6'30
```

## 相关文件

- `PaceDistribution.tsx` - 主组件
- `PaceDistribution.hook.ts` - 数据处理逻辑
- `PaceDistribution.module.css` - 样式
- `__tests__/PaceDistribution.test.tsx` - 单元测试

## 更新日志

### v1.0.0 (2026-01-27)
- ✨ 初始版本
- 🎨 配速分布直方图
- 📊 配速统计信息
- 🎯 平均配速高亮显示
