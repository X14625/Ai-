import { useEffect, useState } from 'react';
import ThreeViewport from './ThreeViewport';

type Snapshot = { id: string; createdAt: string; code: string };
const initialCode = `import * as THREE from 'three';\n\nconst scene = new THREE.Scene();\nscene.background = new THREE.Color('#11141d');\n\nconst geometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 16);\nconst material = new THREE.MeshStandardMaterial({\n  color: '#8b7cff',\n  metalness: 0.45,\n  roughness: 0.24,\n});\n\nconst object = new THREE.Mesh(geometry, material);\nscene.add(object);\n`;

function readSnapshots(): Snapshot[] {
  try {
    return JSON.parse(localStorage.getItem('ai-studio-snapshots') ?? '[]') as Snapshot[];
  } catch {
    return [];
  }
}

export default function App() {
  const [code, setCode] = useState(initialCode);
  const [snapshots, setSnapshots] = useState<Snapshot[]>(readSnapshots);
  const [activeTab, setActiveTab] = useState<'scene' | 'browser'>('scene');
  const [notice, setNotice] = useState('本地原型 · 尚未连接云端 Agent');

  useEffect(() => {
    localStorage.setItem('ai-studio-snapshots', JSON.stringify(snapshots));
  }, [snapshots]);

  const saveVersion = () => {
    const item = { id: crypto.randomUUID(), createdAt: new Date().toLocaleString(), code };
    setSnapshots((previous) => [item, ...previous]);
    setNotice('已保存本机快照；正式版本历史请使用 Git 提交和标签。');
  };

  const restoreVersion = (snapshot: Snapshot) => {
    setCode(snapshot.code);
    setNotice(`已恢复本机快照：${snapshot.createdAt}`);
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand"><div className="brand-mark">AI</div><div><strong>AI Studio</strong><small>编程工作台</small></div></div>
        <div className="breadcrumbs"><span>工作区</span><b>/</b><strong>three-scene-starter</strong><span className="branch">⌘ main</span></div>
        <div className="top-actions"><span className="sync-state"><i /> 单机模式</span><button className="button subtle" onClick={saveVersion}>＋ 保存版本</button><button className="button primary" onClick={() => setNotice('预览已刷新')}>▶ 运行预览</button><div className="avatar">X</div></div>
      </header>

      <div className="workspace">
        <aside className="icon-rail" aria-label="主导航"><button className="rail-button selected" title="项目">▤</button><button className="rail-button" title="搜索">⌕</button><button className="rail-button" title="Agent">✳</button><button className="rail-button" title="插件">▦</button><div className="rail-spacer"/><button className="rail-button" title="设置">⚙</button></aside>

        <aside className="project-sidebar">
          <div className="section-heading">项目资源 <button title="添加文件">＋</button></div>
          <div className="project-label">⌄　THREE-SCENE-STARTER</div>
          <div className="tree-row active">▾　📁 src</div>
          <div className="tree-row indent selected-file">◈　App.tsx</div>
          <div className="tree-row indent">◈　scene.ts</div>
          <div className="tree-row">▸　📁 plugins</div>
          <div className="tree-row">▸　📁 public</div>
          <div className="tree-row">◇　package.json</div>
          <div className="tree-row">▤　README.md</div>
          <div className="sidebar-divider" />
          <div className="section-heading">版本历史 <span className="count">{snapshots.length}</span></div>
          {snapshots.length === 0 ? <p className="empty-hint">保存快照后会显示在这里</p> : snapshots.slice(0, 5).map((snapshot) => <button className="snapshot-row" key={snapshot.id} onClick={() => restoreVersion(snapshot)}><span>◷ 本地快照</span><small>{snapshot.createdAt}</small></button>)}
          <div className="sidebar-bottom"><span className="online-dot"/> 本地工作区 <small>未连接同步</small></div>
        </aside>

        <section className="main-area">
          <div className="editor-toolbar"><div className="file-tab">◈　App.tsx <span>×</span></div><div className="toolbar-right"><span className="saved-label">● 已保存</span><button className="icon-button" title="更多">···</button></div></div>
          <div className="editor-and-preview">
            <section className="editor-pane" aria-label="代码编辑器"><div className="editor-meta"><span>src / App.tsx</span><span>TypeScript JSX</span></div><div className="code-editor"><div className="line-numbers">{code.split('\n').map((_, index) => <span key={index}>{index + 1}</span>)}</div><textarea aria-label="编辑器代码" spellCheck={false} value={code} onChange={(event) => setCode(event.target.value)} /></div><div className="terminal"><div className="terminal-heading"><span>终端</span><span>问题　0</span><button>⌄</button></div><div className="terminal-content"><span className="prompt">➜</span> <b>就绪</b> <span className="muted">{notice}</span></div></div></section>
            <section className="preview-pane"><div className="preview-tabs"><button className={activeTab === 'scene' ? 'tab active' : 'tab'} onClick={() => setActiveTab('scene')}>◉ 3D 场景</button><button className={activeTab === 'browser' ? 'tab active' : 'tab'} onClick={() => setActiveTab('browser')}>◎ 浏览器预览</button><span className="preview-spacer"/><button className="icon-button" title="全屏">⛶</button></div>{activeTab === 'scene' ? <ThreeViewport /> : <div className="browser-placeholder"><div className="browser-address">🔒　localhost:3000 <span>↻</span></div><div className="browser-empty"><div className="browser-icon">◎</div><strong>应用预览区域</strong><p>启动项目开发服务器后，网页预览将在这里显示。</p><code>浏览器沙箱尚未连接</code></div></div>}<div className="preview-footer"><span><i/> 实时预览</span><span>Three.js · WebGL</span><span>100%</span></div></section>
          </div>
          <div className="statusbar"><span>◉ TypeScript</span><span>{code.split('\n').length} 行</span><span>UTF-8</span><span>LF</span><span className="status-spacer"/><span>{notice}</span></div>
        </section>

        <aside className="agent-sidebar"><div className="agent-header"><div><strong>AI Agent</strong><small>开发助手</small></div><button className="icon-button" title="新建对话">＋</button></div><div className="agent-status"><span className="status-orb">✳</span><strong>准备就绪</strong><p>描述你想实现的功能，Agent 将协助规划和编写代码。</p><span className="local-badge">原型模式 · 未连接模型</span></div><div className="agent-prompt"><label htmlFor="agent-input">任务指令</label><textarea id="agent-input" placeholder="例如：为场景添加可调节的灯光控件…"/><button className="button primary send-button" onClick={() => setNotice('Agent 服务尚未配置；此版本不会发送外部请求。')}>发送任务　↗</button></div><div className="skills-section"><div className="section-heading">可用 Skills <button>管理</button></div><div className="skill-card"><span className="skill-icon purple">◈</span><div><strong>Three.js 场景</strong><small>3D · 场景创建</small></div><span className="skill-check">✓</span></div><div className="skill-card"><span className="skill-icon blue">⌘</span><div><strong>代码审查</strong><small>质量 · 安全</small></div><span className="skill-check">✓</span></div><div className="skill-card"><span className="skill-icon amber">▦</span><div><strong>插件脚手架</strong><small>扩展 · 插件</small></div><span className="skill-check">✓</span></div></div><div className="cluster-card"><div><span className="cluster-dot"/> Agent 执行集群</div><small>未连接 · 本地单机模式</small></div></aside>
      </div>
    </main>
  );
}
