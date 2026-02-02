"use client";

import React from "react";
import { useComponentShowcase } from "./ComponentShowcase.hook";
import styles from "./ComponentShowcase.module.css";

export function ComponentShowcase() {
  const { state, actions } = useComponentShowcase();
  const { selectedComponent, components } = state;
  const { handleComponentSelect } = actions;

  const selectedComponentData = components.find(
    (c) => c.id === selectedComponent,
  );

  return (
    <div className={styles.showcaseContainer}>
      <header className={styles.showcaseHeader}>
        <h1 className={styles.showcaseTitle}>组件展示</h1>
        <p className={styles.showcaseDescription}>
          这里展示了我创建的一些原子组件，每个组件都经过精心设计和测试。
        </p>
      </header>

      <div className={styles.showcaseContent}>
        <aside className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>组件列表</h2>
          <nav className={styles.componentNav}>
            {components.map((component) => (
              <button
                key={component.id}
                className={`${styles.navItem} ${
                  selectedComponent === component.id
                    ? styles.navItemActive
                    : ''
                }`}
                onClick={() => handleComponentSelect(component.id)}
              >
                {component.name}
              </button>
            ))}
          </nav>
        </aside>

        <main className={styles.mainContent}>
          {selectedComponentData ? (
            <div className={styles.componentDetail}>
              <section className={styles.componentPreview}>
                <h2>{selectedComponentData.name}</h2>
                <p className={styles.componentDescription}>
                  {selectedComponentData.description}
                </p>
                <div className={styles.previewArea}>
                  {selectedComponentData.component}
                </div>
              </section>

              <section className={styles.codeSection}>
                <h3>代码示例</h3>
                <pre className={styles.codeBlock}>
                  <code>{selectedComponentData.code}</code>
                </pre>
              </section>
            </div>
          ) : (
            <div className={styles.welcomeMessage}>
              <h2>欢迎使用组件展示页面</h2>
              <p>请从左侧选择一个组件来查看详细信息和代码示例。</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
