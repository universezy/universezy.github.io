const blogs = [
  {
    id: 'Openlayers3-Cluster',
    category: 'Openlayers',
    title: 'Openlayer3学习心得之Cluster',
    tags: [
      {tag: 'Cluster'},
      {tag: 'GIS'}
    ],
    abstract: '最近在学习开源地图引擎——Openlayers3，将自己的一些学习心得分享出来，第一次写文章，望支持。',
    timestamp: 1493198368000
  },
  {
    id: 'Openlayers3-LineString',
    category: 'Openlayers',
    title: 'Openlayer3学习心得之LineString',
    tags: [
      {tag: 'LineString'},
      {tag: 'GIS'}
    ],
    abstract: '关于LineString，官方的示例给的是鼠标画点，自动连线，并添加箭头，而在我们实际应用中，往往需要手动录入标记点，然后进行连线并添加箭头，下面就分享我使用LineString的过程。',
    timestamp: 1493201697000
  },
  {
    id: 'SolutionOfPackingJar',
    category: 'Java',
    title: '关于jar打包时的几个问题的汇总',
    tags: [
      {tag: 'jar'},
      {tag: 'solution'}
    ],
    abstract: 'jar打包时容易出现的一些问题和解决方案',
    timestamp: 1495587995000
  },
  {
    id: 'ThinkingOfInternship',
    category: 'Thinking',
    title: '浅谈这半年的实习感想',
    tags: [
      {tag: '实习'},
      {tag: '感想'}
    ],
    abstract: '谨以此文告诫刚满二十一岁的自己。同时勉励还在迷茫的朋友。',
    timestamp: 1499338541000
  },
  {
    id: 'ComparisonOf4MessageTypes',
    category: 'Android',
    title: 'Android四种常用的消息传递机制/模式的比较',
    tags: [
      {tag: 'callback'},
      {tag: 'Handler-Message'},
      {tag: 'Broadcast Receiver'},
      {tag: 'Observer-Subject'}
    ],
    abstract: '四种分别是callback interface，handler-message，broadcast receiver和observer-subject。',
    timestamp: 1499424712000
  },
  {
    id: 'NotesOfJava',
    category: 'Java',
    title: 'Java学习笔记',
    tags: [
      {tag: '学习笔记'},
      {tag: '迭代'},
      {tag: '线程安全'},
      {tag: 'Bitmap'},
      {tag: '内存抖动'},
      {tag: 'List'},
      {tag: 'String'},
      {tag: '多继承'}
    ],
    abstract: '本文记录一些学习Java过程中觉得重要的笔记，不定期更新扩充。如有错误，欢迎指正。',
    timestamp: 1503843953000
  },
  {
    id: 'SummaryOfCampusRecruit',
    category: 'Thinking',
    title: '大四秋招总结 ',
    tags: [
      {tag: '校招'},
      {tag: '总结'}
    ],
    abstract: '经历秋招，才知道找工作多么难，竞争多么激烈，现实多么残酷。当然，如果你足够优秀，这些问题都不存在的。尽管秋招已经快收尾了，但是对于明年春招和今后秋招的同学，也算是一个参考吧。',
    timestamp: 1507625130000
  },
  {
    id: 'Solution1OfUbuntu',
    category: 'Ubuntu',
    title: 'Ubuntu"无法连接到 Upstart: Failed to connect to socket /com/ubuntu/upstart: 拒绝连接"的解决方案',
    tags: [
      {tag: '16.04 LTS'},
      {tag: '系统升级'},
      {tag: 'solution'}
    ],
    abstract: '无法连接到 Upstart: Failed to connect to socket /com/ubuntu/upstart: 拒绝连接',
    timestamp: 1516071553000
  },
  {
    id: 'Solution2OfUbuntu',
    category: 'Ubuntu',
    title: 'Ubuntu升级到16.04后出现"Failed to start Load Kernel Modules"问题的解决方案',
    tags: [
      {tag: '16.04 LTS'},
      {tag: '系统升级'},
      {tag: 'solution'}
    ],
    abstract: 'Failed to start Load Kernel Modules',
    timestamp: 1516072363000
  },
  {
    id: 'NW.jsBuildWebApp',
    category: 'NW.js',
    title: 'Ubuntu环境下使用NW.js对web应用封装',
    tags: [
      {tag: 'Ubuntu'},
      {tag: 'Hybrid App'}
    ],
    abstract: '通过两个Demo来引出后面的教程——使用NW.js来封装你想要的Web应用。',
    timestamp: 1516152179000
  },
  {
    id: 'Solution3OfUbuntu',
    category: 'Ubuntu',
    title: 'Ubuntu更新软件时报"http://cn.archive.ubuntu.com/ubuntu"相关错误的解决方案',
    tags: [
      {tag: '更新软件'},
      {tag: 'solution'}
    ],
    abstract: '无法下载 http://cn.archive.ubuntu.com/ubuntu/dists/xxx  连接失败 [IP: *****]]',
    timestamp: 1516266498000
  },
  {
    id: 'ConfigEnvVarOnUbuntu',
    category: 'Ubuntu',
    title: 'Ubuntu设置系统环境变量',
    tags: [
      {tag: '环境变量'}
    ],
    abstract: '以java环境变量为例介绍Ubuntu下设置系统环境变量的方法',
    timestamp: 1516269846000
  },
  {
    id: 'ThunderbirdOnUbuntu',
    category: 'Ubuntu',
    title: 'Ubuntu下使用Thunderbird收发QQ邮箱',
    tags: [
      {tag: 'Thunderbird'},
      {tag: 'email'}
    ],
    abstract: '介绍Ubuntu下使用Thunderbird收发QQ邮箱的方法',
    timestamp: 1517211787000
  },
  {
    id: 'Solution1OfHTML',
    category: 'HTML',
    title: 'HTML的标签中嵌套HTML标签时被解析的解决方案',
    tags: [
      {tag: 'HTML标签'},
      {tag: '<pre>标签'},
      {tag: '转义'}
    ],
    abstract: '<pre>标签中保留空格和换行，常用来展示代码片段，但如果直接嵌套HTML标签，会被浏览器解析，所以需要使用转义字符将代码片段转换为不被解析的文本。',
    timestamp: 1517978827000
  },
  {
    id: 'Solution2OfHTML',
    category: 'HTML',
    title: 'HTML中保留转义字符的方法',
    tags: [
      {tag: 'HTML标签'},
      {tag: '<pre>标签'},
      {tag: '转义'}
    ],
    abstract: 'HTML中形如 &nbps;(空格) 、 &lt;(<符号) 、 &gt;(>符号) 等都会被转义成对应的值，那么要想保留转义字符本身，比如在贴代码或者教学中，只有破坏转义字符本身的结构，即：将 & 符号再次转义。',
    timestamp: 1517987174000
  },
  {
    id: 'CampusRecruitNotesOfAndroid',
    category: 'Android',
    title: 'Android校招面试知识点整理',
    tags: [
      {tag: '校招'},
      {tag: '面试整理'}
    ],
    abstract: '整理的一些Android校招面试知识点',
    timestamp: 1518017791000
  },
  {
    id: 'DomLoading',
    category: 'JavaScript',
    title: '使用DOM实现批量化布局装载的动态加载网页',
    tags: [
      {tag: 'DOM'}
    ],
    abstract: '以博客栏为例，使用DOM实现批量化布局装载的动态加载网页，另附可收缩侧栏效果。',
    timestamp: 1518172042000
  },
  {
    id: 'WebBanner',
    category: 'JavaScript',
    title: 'css+js实现banner图片轮播',
    tags: [
      {tag: 'banner'}
    ],
    abstract: 'css实现banner布局，js实现图片轮播，附带按钮二级效果、banner响应式缩放。',
    timestamp: 1519356097000
  },
  {
    id: 'ComparisonOf3ColumnLayout',
    category: 'CSS',
    title: '固比固三栏式布局对比',
    tags: [
      {tag: '三栏式布局'},
      {tag: '圣杯布局'},
      {tag: '双飞翼布局'}
    ],
    abstract: '固比固三栏式布局对比：传统布局、圣杯布局、双飞翼布局。',
    timestamp: 1519455952000
  },
  {
    id: 'Solution1OfNPM',
    category: 'NPM',
    title: '使用npm安装vue时报"no such file or directory, open \'xxx\\package.json\'"的解决方案',
    tags: [
      {tag: 'vue'},
      {tag: 'solution'}
    ],
    abstract: 'no such file or directory, open \'xxx\\package.json\'',
    timestamp: 1519628387000
  },
  {
    id: 'Solution1OfAndroid',
    category: 'Android',
    title: 'AS启动时报"Please check your firewall settings and restart Android Studio"的解决方案',
    tags: [
      {tag: 'Android Studio'},
      {tag: 'solution'}
    ],
    abstract: 'Please check your firewall settings and restart Android Studio',
    timestamp: 1519652663000
  },
  {
    id: 'Solution4OfUbuntu',
    category: 'Ubuntu',
    title: 'Ubuntu下安装淘宝npm镜像后出现"未找到 \'cnpm\' 命令"问题的解决方案',
    tags: [
      {tag: 'npm'},
      {tag: '镜像'},
      {tag: 'solution'}
    ],
    abstract: '未找到 \'cnpm\' 命令',
    timestamp: 1519789151000
  }
]

export default {
  blogs
}
