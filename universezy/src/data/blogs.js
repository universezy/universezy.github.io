const blogs = [
  {
    id: 0,
    category: 'Java',
    title: '这是一个测试标题',
    tags: [
      {tag: '设计原则'},
      {tag: '里氏替换原则'}
    ],
    abstract: '这是一段测试摘要内容：里氏代换原则，只有当衍生类可以替换掉基类，软件单位的功能不受到影响时，基类才能真正被复用，而衍生类也能够在基类的基础上增加新的行为。',
    timestamp: 1545613813626
  },
  {
    id: 1,
    category: 'Android',
    title: '这是一个测试标题',
    tags: [
      {tag: 'PackageManager'}
    ],
    abstract: '这是一段测试摘要内容：PackageManager获取的信息即来自AndroidManifest.XML。',
    timestamp: 1545619294133
  },
  {
    id: 2,
    category: 'Git',
    title: '这是一个测试标题',
    tags: [
      {tag: 'rebase'}
    ],
    abstract: 'rebase可以对某一段线性提交历史进行编辑、删除、复制、粘贴；因此，合理使用rebase命令可以使我们的提交历史干净、简洁！',
    timestamp: 1545624734835
  },
  {
    id: 3,
    category: 'Vue.js',
    title: '这是一个测试标题',
    tags: [
      {tag: 'slot'}
    ],
    abstract: 'Vue 实现了一套内容分发的 API，这套 API 基于当前的 Web Components 规范草案，将 <slot> 元素作为承载分发内容的出口。',
    timestamp: 1545629734835
  },
  {
    id: 'test',
    category: 'JavaScript',
    title: '这是一个测试标题',
    tags: [
      {tag: '测试'}
    ],
    abstract: '测试Markdown文件',
    timestamp: 1546013457032
  }
]

export default {
  blogs
}
