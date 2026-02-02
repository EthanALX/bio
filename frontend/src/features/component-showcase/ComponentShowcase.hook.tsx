import React, { useState } from 'react';
import type {
  ComponentExample,
  ComponentShowcaseState,
  ComponentShowcaseActions,
  UseComponentShowcaseResult,
} from './ComponentShowcase.type';

const components: ComponentExample[] = [
  {
    id: 'card',
    name: '卡片组件',
    description: '用于展示内容的卡片容器',
    component: (
      <div className="card">
        <h3 className="cardTitle">卡片标题</h3>
        <p className="cardContent">这是卡片的内容区域，可以放置任何内容。</p>
      </div>
    ),
    code: `// 卡片组件示例
<div className={styles.card}>
  <h3 className={styles.cardTitle}>卡片标题</h3>
  <p className={styles.cardContent}>卡片内容</p>
</div>`,
  },
  {
    id: 'input',
    name: '输入框组件',
    description: '各种类型的输入框组件',
    component: (
      <div className="exampleContainer">
        <input type="text" className="input" placeholder="文本输入框" />
        <input type="email" className="input" placeholder="邮箱输入框" />
        <textarea
          className="textarea"
          placeholder="多行文本输入框"
          rows={3}
        />
      </div>
    ),
    code: `// 输入框组件示例
<input type="text" className={styles.input} placeholder="文本输入框" />
<input type="email" className={styles.input} placeholder="邮箱输入框" />
<textarea className={styles.textarea} placeholder="多行文本" rows={3} />`,
  },
];

export const useComponentShowcase = (): UseComponentShowcaseResult => {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null,
  );

  const handleComponentSelect = (id: string) => {
    setSelectedComponent(id);
  };

  const state: ComponentShowcaseState = {
    selectedComponent,
    components,
  };

  const actions: ComponentShowcaseActions = {
    handleComponentSelect,
  };

  return {
    state,
    actions,
  };
};
