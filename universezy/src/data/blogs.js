const blogs = [
  {
    id: 'Openlayers3Cluster',
    category: 'JavaScript',
    title: 'Openlayer3学习心得之Cluster',
    tags: [
      {tag: 'Openlayers'},
      {tag: 'Cluster'},
      {tag: 'GIS'}
    ],
    abstract: '最近在学习开源地图引擎——Openlayers3，将自己的一些学习心得分享出来，第一次写文章，望支持。',
    timestamp: 1493198368000
  },
  {
    id: 'Openlayers3LineString',
    category: 'JavaScript',
    title: 'Openlayer3学习心得之LineString',
    tags: [
      {tag: 'Openlayers'},
      {tag: 'LineString'},
      {tag: 'GIS'}
    ],
    abstract: '分享我使用LineString的过程。',
    timestamp: 1493201697000
  },
  {
    id: 'SolutionOfPackingJar',
    category: 'Java',
    title: '关于jar打包时的几个问题的汇总',
    tags: [
      {tag: 'jar'},
      {tag: '打包'},
      {tag: 'solution'}
    ],
    abstract: 'jar打包时容易出现的一些问题和解决方案。',
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
    abstract: '谨以此文告诫刚满二十一岁的自己，同时勉励还在迷茫的朋友。',
    timestamp: 1499338541000
  },
  {
    id: 'ComparisonOf4MsgTypes',
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
      {tag: '学习笔记'}
    ],
    abstract: '本文记录一些学习Java过程中觉得重要的笔记，不定期更新扩充。如有错误，欢迎指正。',
    timestamp: 1503843953000
  },
  {
    id: 'SummaryOfCampusRecruit',
    category: 'Thinking',
    title: '大四秋招总结',
    tags: [
      {tag: '校招'},
      {tag: '总结'}
    ],
    abstract: '经历秋招，才知道找工作多么难，竞争多么激烈，现实多么残酷。当然，如果你足够优秀，这些问题都不存在的。尽管秋招已经快收尾了，但是对于明年春招和今后秋招的同学，也算是一个参考吧。',
    timestamp: 1507625130000
  },
  {
    id: 'SolutionOfUbuntu1',
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
    id: 'SolutionOfUbuntu2',
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
    id: 'NW_jsBuildWebApp',
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
    id: 'SolutionOfUbuntu3',
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
    abstract: '以java环境变量为例介绍Ubuntu下设置系统环境变量的方法。',
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
    abstract: '介绍Ubuntu下使用Thunderbird收发QQ邮箱的方法。',
    timestamp: 1517211787000
  },
  {
    id: 'SolutionOfHTML1',
    category: 'HTML',
    title: 'HTML的标签中嵌套HTML标签时被解析的解决方案',
    tags: [
      {tag: 'HTML标签'},
      {tag: '<pre>标签'},
      {tag: '转义'}
    ],
    abstract: 'HTML的标签中嵌套HTML标签时被解析',
    timestamp: 1517978827000
  },
  {
    id: 'SolutionOfHTML2',
    category: 'HTML',
    title: 'HTML中保留转义字符的方法',
    tags: [
      {tag: 'HTML标签'},
      {tag: '<pre>标签'},
      {tag: '转义'}
    ],
    abstract: '介绍HTML中保留转义字符的方法。',
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
    abstract: '整理的一些Android校招面试知识点。',
    timestamp: 1518017791000
  },
  {
    id: 'DomLoading',
    category: 'JavaScript',
    title: '使用DOM实现批量化布局装载的动态加载网页',
    tags: [
      {tag: 'DOM'}
    ],
    abstract: '介绍DOM动态加载网页。',
    timestamp: 1518172042000
  },
  {
    id: 'WebBanner',
    category: 'JavaScript',
    title: 'css+js实现banner图片轮播',
    tags: [
      {tag: 'banner'}
    ],
    abstract: '介绍css+js实现banner图片轮播。',
    timestamp: 1519356097000
  },
  {
    id: 'ComparisonOf3ColsLayout',
    category: 'CSS',
    title: '固比固三栏式布局对比',
    tags: [
      {tag: '三栏式布局'},
      {tag: '圣杯布局'},
      {tag: '双飞翼布局'}
    ],
    abstract: '介绍传统布局、圣杯布局、双飞翼布局的对比。',
    timestamp: 1519455952000
  },
  {
    id: 'SolutionOfNPM1',
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
    id: 'SolutionOfAndroid1',
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
    id: 'SolutionOfNPM2',
    category: 'NPM',
    title: 'Ubuntu下安装淘宝npm镜像后出现"未找到 \'cnpm\' 命令"问题的解决方案',
    tags: [
      {tag: 'Ubuntu'},
      {tag: '镜像'},
      {tag: 'solution'}
    ],
    abstract: '未找到 \'cnpm\' 命令',
    timestamp: 1519789151000
  },
  {
    id: 'SolutionOfVue_js1',
    category: 'Vue.js',
    title: 'v-for报"Elements in iteration expect to have \'v-bind:key\' directives"错误的解决方案',
    tags: [
      {tag: 'v-for'},
      {tag: 'solution'}
    ],
    abstract: 'Elements in iteration expect to have \'v-bind:key\' directives',
    timestamp: 1520234464000
  },
  {
    id: 'SolutionOfGit1',
    category: 'Git',
    title: 'git push时报"error: src refspec master does not match any."的解决方案',
    tags: [
      {tag: 'push'},
      {tag: 'solution'}
    ],
    abstract: 'error: src refspec master does not match any.',
    timestamp: 1520327694000
  },
  {
    id: 'GitAddOrigin',
    category: 'Git',
    title: 'git将本地仓库上传到远程仓库',
    tags: [
      {tag: '上传'},
      {tag: 'add origin'}
    ],
    abstract: '介绍git将本地仓库上传到远程仓库的方法。',
    timestamp: 1520328730000
  },
  {
    id: 'GitPushOrigin',
    category: 'Git',
    title: 'git将本地仓库同步到远程仓库',
    tags: [
      {tag: '同步'},
      {tag: 'push origin'}
    ],
    abstract: '介绍git将本地仓库同步到远程仓库的方法。',
    timestamp: 1520329252000
  },
  {
    id: 'ExperienceOfWriting',
    category: 'Thinking',
    title: '记录一些博客写作心得',
    tags: [
      {tag: '博客'},
      {tag: '心得'}
    ],
    abstract: '本文主要讲述一些平时写作过程中和查询资料时遇到的问题。',
    timestamp: 1520755185000
  },
  {
    id: 'SolutionOfVue_js2',
    category: 'Vue.js',
    title: '使用iView时报"Parsing error: x-invalid-end-tag"错误的解决方案',
    tags: [
      {tag: 'iView'},
      {tag: 'tag'},
      {tag: 'solution'}
    ],
    abstract: 'Parsing error: x-invalid-end-tag',
    timestamp: 1520942516000
  },
  {
    id: 'SolutionOfJavaScript1',
    category: 'JavaScript',
    title: '使用JSON序列化实现伪深克隆时Date对象时区问题的解决方案',
    tags: [
      {tag: 'json'},
      {tag: '序列化'},
      {tag: '克隆'},
      {tag: 'Date'},
      {tag: '时区'},
      {tag: 'solution'}
    ],
    abstract: '介绍深克隆Date对象时的问题。',
    timestamp: 1521528873000
  },
  {
    id: 'PdfTipsOnUbuntu',
    category: 'Ubuntu',
    title: 'Ubuntu下图片转pdf和pdf合并',
    tags: [
      {tag: 'pdf'},
      {tag: '图片转pdf'},
      {tag: 'pdf合并'}
    ],
    abstract: '介绍Ubuntu下图片转pdf和pdf合并的方法。',
    timestamp: 1522143961000
  },
  {
    id: 'ConfigMavenOnUbuntu',
    category: 'Ubuntu',
    title: 'Ubuntu下Maven的配置',
    tags: [
      {tag: 'Maven'}
    ],
    abstract: '本文以Ubuntu16.04LTS为例，介绍Maven的下载配置过程。',
    timestamp: 1522209073000
  },
  {
    id: 'ConfigTomcatOnUbuntu',
    category: 'Ubuntu',
    title: 'Ubuntu下搭建Tomcat服务器',
    tags: [
      {tag: 'Tomcat'}
    ],
    abstract: '本文以Ubuntu16.04LTS为例，介绍Tomcat的下载配置过程。',
    timestamp: 1522227981000
  },
  {
    id: 'ModifyCharsetOnMySQL',
    category: 'SQL',
    title: 'MySQL修改表中字段编码格式',
    tags: [
      {tag: 'MySQL'},
      {tag: '编码格式'}
    ],
    abstract: '介绍MySQL修改表中字段编码格式的方法',
    timestamp: 1522393455000
  },
  {
    id: 'ConfigLanguageOfGit',
    category: 'Git',
    title: 'Github设置仓库语言',
    tags: [
      {tag: 'Github'},
      {tag: '仓库语言'},
      {tag: 'gitattributes'}
    ],
    abstract: '介绍Github设置仓库语言的方法',
    timestamp: 1522395060000
  },
  {
    id: 'SetPermissionOnUbuntu',
    category: 'Ubuntu',
    title: 'Ubuntu修改目录下所有内容权限',
    tags: [
      {tag: '权限'},
      {tag: 'chmod'}
    ],
    abstract: '介绍Ubuntu修改目录下所有内容权限的方法',
    timestamp: 1522725897000
  },
  {
    id: 'MavenBuildJavaWeb',
    category: 'Maven',
    title: '使用Maven构建Java Web工程的教程',
    tags: [
      {tag: 'Java Web'}
    ],
    abstract: '本文使用Ubuntu16.04LTS操作系统+Eclipse集成开发环境+Tomcat服务器，通过Maven构建Java Web工程。',
    timestamp: 1522765545000
  },
  {
    id: 'SolutionOfJava1',
    category: 'Java',
    title: 'Java Web工程中index.jsp报"javax.servlet.http.HttpServlet"错误的解决方案',
    tags: [
      {tag: 'Java Web'},
      {tag: 'index.jsp'},
      {tag: 'servlet'},
      {tag: 'solution'}
    ],
    abstract: 'javax.servlet.http.HttpServlet',
    timestamp: 1522809980000
  },
  {
    id: 'SolutionOfSpring1',
    category: 'Spring',
    title: 'SpringMVC下后端返回前端出现中文乱码的解决方案',
    tags: [
      {tag: 'SpringMVC'},
      {tag: '中文乱码'},
      {tag: 'solution'}
    ],
    abstract: '后端返回前端出现中文乱码',
    timestamp: 1523187162000
  },
  {
    id: 'SolutionOfSpring2',
    category: 'Spring',
    title: 'Spring工程中JDBC抛出"EmptyResultDataAccessException"异常的解决方案',
    tags: [
      {tag: 'JDBC'},
      {tag: 'JdbcTemplate'},
      {tag: 'solution'}
    ],
    abstract: 'EmptyResultDataAccessException',
    timestamp: 1523411038000
  },
  {
    id: 'SolutionOfJava2',
    category: 'Java',
    title: 'Java Web工程报"Invalid character found in the request target"错误的解决方案',
    tags: [
      {tag: 'Java Web'},
      {tag: 'http'},
      {tag: 'urlencode'},
      {tag: 'solution'}
    ],
    abstract: 'Invalid character found in the request target',
    timestamp: 1523499087000
  },
  {
    id: 'SolutionOfSpring3',
    category: 'Spring',
    title: 'SpringMVC工程解决"CORS 头缺少 \'Access-Control-Allow-Origin\'"问题',
    tags: [
      {tag: 'SpringMVC'},
      {tag: 'Java Web'},
      {tag: 'CORS'},
      {tag: 'solution'}
    ],
    abstract: 'CORS 头缺少 \'Access-Control-Allow-Origin\'',
    timestamp: 1523608836000
  },
  {
    id: 'SolutionOfSpring4',
    category: 'Spring',
    title: 'SpringMVC解决无法接收PUT请求的问题',
    tags: [
      {tag: 'SpringMVC'},
      {tag: 'http'},
      {tag: 'PUT'},
      {tag: 'solution'}
    ],
    abstract: '无法接收PUT请求',
    timestamp: 1524126091000
  },
  {
    id: 'SpringTeaching1',
    category: 'Spring',
    title: 'Spring快速上手攻略之搭建后端web工程(一)',
    tags: [
      {tag: 'SpringMVC'},
      {tag: 'Java Web'}
    ],
    abstract: '本文讲述作者初学Spring时经历的痛苦和折磨，以及发誓要整理出本文来帮助初学Spring开发后端的朋友，同时分享一些心得体会。',
    timestamp: 1524186781000
  },
  {
    id: 'SpringTeaching2',
    category: 'Spring',
    title: 'Spring快速上手攻略之搭建后端web工程(二)',
    tags: [
      {tag: 'SpringMVC'},
      {tag: 'Java Web'}
    ],
    abstract: 'Chapter 1 —— 吐槽网上教程。',
    timestamp: 1524186781000
  },
  {
    id: 'SpringTeaching3',
    category: 'Spring',
    title: 'Spring快速上手攻略之搭建后端web工程(三)',
    tags: [
      {tag: 'SpringMVC'},
      {tag: 'Java Web'}
    ],
    abstract: 'Chapter 2 —— 准备工作。',
    timestamp: 1524186781000
  },
  {
    id: 'SpringTeaching4',
    category: 'Spring',
    title: 'Spring快速上手攻略之搭建后端web工程(四)',
    tags: [
      {tag: 'SpringMVC'},
      {tag: 'Java Web'}
    ],
    abstract: 'Chapter 3 —— 认识IoC',
    timestamp: 1524186781000
  },
  {
    id: 'SpringTeaching5',
    category: 'Spring',
    title: 'Spring快速上手攻略之搭建后端web工程(五)',
    tags: [
      {tag: 'SpringMVC'},
      {tag: 'Java Web'}
    ],
    abstract: 'Chapter 4 —— 剖析SpringMVC架构',
    timestamp: 1524186781000
  },
  {
    id: 'SpringTeaching6',
    category: 'Spring',
    title: 'Spring快速上手攻略之搭建后端web工程(六)',
    tags: [
      {tag: 'SpringMVC'},
      {tag: 'Java Web'}
    ],
    abstract: 'Chapter 5 —— 编写工程',
    timestamp: 1524186781000
  },
  {
    id: 'SpringTeaching7',
    category: 'Spring',
    title: 'Spring快速上手攻略之搭建后端web工程(七)',
    tags: [
      {tag: 'SpringMVC'},
      {tag: 'Java Web'}
    ],
    abstract: 'Chapter 6 —— 后记',
    timestamp: 1524186781000
  },
  {
    id: 'SolutionOfPackingVue_js',
    category: 'Vue.js',
    title: 'Vue.js打包静态网页出现空白或路径错误的问题解决方案',
    tags: [
      {tag: '打包'},
      {tag: '路径错误'},
      {tag: 'solution'}
    ],
    abstract: 'Vue.js打包静态网页出现空白或路径错误',
    timestamp: 1524464227000
  },
  {
    id: 'SummaryOfUniversity',
    category: 'Thinking',
    title: '回顾大学四年 ',
    tags: [
      {tag: '大学'},
      {tag: '总结'}
    ],
    abstract: '时光匆匆，短暂的四年大学生涯就这么结束了，花了一些时间整理一下。',
    timestamp: 1528733160000
  },
  {
    id: 'GetScreenSizeOnAndroid',
    category: 'Android',
    title: 'Android获取屏幕宽高',
    tags: [
      {tag: '屏幕'},
      {tag: '宽高'}
    ],
    abstract: '介绍Android获取屏幕宽高的方法。',
    timestamp: 1531214818000
  },
  {
    id: 'SolutionOfAndroid2',
    category: 'Android',
    title: 'Android使用MediaRecorder的stop方法报"stop failed"错误的解决方案',
    tags: [
      {tag: 'MediaRecorder'},
      {tag: 'stop'},
      {tag: 'solution'}
    ],
    abstract: 'stop failed',
    timestamp: 1532603685000
  },
  {
    id: 'SolutionOfAndroid3',
    category: 'Android',
    title: 'Android代码混淆时报错"transformClassesAndResourcesWithProguardForRelease"的解决方案',
    tags: [
      {tag: '混淆'},
      {tag: 'solution'}
    ],
    abstract: 'transformClassesAndResourcesWithProguardForRelease',
    timestamp: 1533609812000
  },
  {
    id: 'SolutionOfAndroid4',
    category: 'Android',
    title: 'Android Studio编译AIDL文件时报"finished with non-zero exit value 1"错误的解决方案',
    tags: [
      {tag: 'Android Studio'},
      {tag: 'AIDL'},
      {tag: 'solution'}
    ],
    abstract: 'finished with non-zero exit value 1',
    timestamp: 1534240924000
  },
  {
    id: 'GetCallingPkgOnAndroid',
    category: 'Android',
    title: 'Android获取接口调用者的包名',
    tags: [
      {tag: '调用者'},
      {tag: '包名'}
    ],
    abstract: '介绍Android获取接口调用者的包名的方法。',
    timestamp: 1536202874000
  },
  {
    id: 'RegisterAndroidDeviceOnUbuntu',
    category: 'Android',
    title: 'Ubuntu下注册Android设备',
    tags: [
      {tag: '注册usb'},
      {tag: 'adb'}
    ],
    abstract: '介绍Ubuntu下注册Android设备的方法。',
    timestamp: 1536655489000
  },
  {
    id: 'DeadCycleOnJava',
    category: 'Java',
    title: 'Java中的for(;;)和while(true)',
    tags: [
      {tag: 'for(;;)'},
      {tag: 'while(true)'}
    ],
    abstract: '介绍Java中的for(;;)和while(true)的区别。',
    timestamp: 1536723838000
  },
  {
    id: 'ThreadSafeInDCLOnJava',
    category: 'Java',
    title: 'Java单例模式中双检锁的线程安全问题',
    tags: [
      {tag: '单例模式'},
      {tag: '双检锁'},
      {tag: '线程安全'},
      {tag: '指令重排序'},
      {tag: '原子操作'},
      {tag: 'synchronized'},
      {tag: 'volatile'}
    ],
    abstract: '介绍Java单例模式中双检锁的线程安全问题。',
    timestamp: 1536908780000
  },
  {
    id: 'AdbModifyHosts',
    category: 'Android',
    title: '使用adb修改手机hosts文件',
    tags: [
      {tag: 'adb'},
      {tag: 'hosts'}
    ],
    abstract: '介绍使用adb修改手机hosts文件的方法。',
    timestamp: 1537944342000
  },
  {
    id: 'PriorityOfSingleInstanceAndTaskAffinity',
    category: 'Android',
    title: 'Android中singleInstance和taskAffinity的优先级',
    tags: [
      {tag: 'singleInstance'},
      {tag: 'taskAffinity'},
      {tag: '优先级'}
    ],
    abstract: '介绍Android中singleInstance和taskAffinity的优先级。',
    timestamp: 1539154585000
  },
  {
    id: '4ReferencesOnJava',
    category: 'Java',
    title: 'Java四种引用方式',
    tags: [
      {tag: '强引用'},
      {tag: '软引用'},
      {tag: '弱引用'},
      {tag: '虚引用'}
    ],
    abstract: '介绍Java的四种引用方式。',
    timestamp: 1540201166000
  },
  {
    id: 'ComparisonOfArrayListAndLinkedList',
    category: 'Java',
    title: 'ArrayList和LinkedList的效率对比',
    tags: [
      {tag: 'ArrayList'},
      {tag: 'LinkedList'}
    ],
    abstract: '介绍ArrayList和LinkedList的效率对比',
    timestamp: 1540350550000
  },
  {
    id: 'DangerOfArrays_asList',
    category: 'Java',
    title: '当心Arrays.asList()挖的巨坑',
    tags: [
      {tag: 'Arrays.asList'},
      {tag: 'ArrayList'}
    ],
    abstract: '介绍Arrays.asList()挖的巨坑。',
    timestamp: 1542266614000
  },
  {
    id: 'GitDeleteOrigin',
    category: 'Git',
    title: 'git删除远程仓库分支',
    tags: [
      {tag: 'delete origin'}
    ],
    abstract: '介绍git删除远程仓库分支的方法。',
    timestamp: 1542361122000
  },
  {
    id: 'ConfigMinifyOfGradle',
    category: 'Gradle',
    title: 'Gradle设置代码混淆',
    tags: [
      {tag: '混淆'}
    ],
    abstract: '介绍Gradle设置代码混淆的方法。',
    timestamp: 1542676528000
  },
  {
    id: 'SolutionOfGit2',
    category: 'Git',
    title: 'repo拉取仓库时报"Cannot get https://gerrit.googlesource.com/git-repo/clone.bundle"的解决方案',
    tags: [
      {tag: 'repo'},
      {tag: 'googlesource'},
      {tag: 'solution'}
    ],
    abstract: 'Cannot get https://gerrit.googlesource.com/git-repo/clone.bundle',
    timestamp: 1543822454000
  },
  {
    id: 'SolutionOfAndroid5',
    category: 'Android',
    title: 'adb调试时报"error:insufficient permissions for device"的解决方案',
    tags: [
      {tag: 'adb'},
      {tag: 'solution'}
    ],
    abstract: 'error:insufficient permissions for device',
    timestamp: 1544060959000
  },
  {
    id: 'SolutionOfVue_js3',
    category: 'Vue.js',
    title: 'Vue.js工程打包静态网页提示CORS问题的解决方案',
    tags: [
      {tag: '打包'},
      {tag: 'CORS'},
      {tag: 'solution'}
    ],
    abstract: '打包静态网页提示CORS',
    timestamp: 1545215279000
  },
  {
    id: 'CognitionOfIndustry',
    category: 'Thinking',
    title: '我能为IT行业做什么',
    tags: [
      {tag: '行业认知'},
      {tag: 'IT'},
      {tag: '开源'},
      {tag: '职场感悟'}
    ],
    abstract: '站在互联网之海前，应具备宽广的胸怀，放眼未来。',
    timestamp: 1545399340000
  },
  {
    id: 'Vue_jsUseQrcodejs',
    category: 'Vue.js',
    title: 'Vue.js工程中使用二维码js库qrcodejs',
    tags: [
      {tag: '二维码'},
      {tag: 'js'},
      {tag: 'qrcodejs'},
      {tag: 'QRCode.js'}
    ],
    abstract: '介绍在Vue.js工程中使用二维码js库QRCode.js的使用方法。',
    timestamp: 1546174891000
  },
  {
    id: 'SummaryOf2018',
    category: 'Thinking',
    title: '2018年终总结',
    tags: [
      {tag: '年终'},
      {tag: '总结'}
    ],
    abstract: '大学毕业，告别学生时代；正式工作，步入社会，感受生活的酸甜苦辣；旧病复发，开始影响我的工作；失去了一位最亲的人；面临失业潮之下的裁员风波。',
    timestamp: 1546277936141
  },
  {
    id: 'RouterModeAndShareOnVue_js',
    category: 'Vue.js',
    title: 'Vue.js中的路由模式和第三方分享问题',
    tags: [
      {tag: 'router'},
      {tag: 'mode'},
      {tag: 'hash'},
      {tag: 'history'},
      {tag: '分享'}
    ],
    abstract: '介绍Vue.js中的两种路由模式：hash和history，并提供第三方分享url问题的解决方案。',
    timestamp: 1546477801968
  },
  {
    id: 'CopyDirEfficiently',
    category: 'Java',
    title: 'Queue+FileChannel实现非递归高效率目录拷贝',
    tags: [
      {tag: 'Queue'},
      {tag: 'FileChannel'},
      {tag: '非递归'},
      {tag: '目录拷贝'}
    ],
    abstract: '本文介绍非递归目录遍历的实现、FileChannel的使用，从而实现非递归的、安全的目录拷贝。',
    timestamp: 1546844984362
  },
  {
    id: 'IPCOfMessenger',
    category: 'Android',
    title: 'Android进程间通信之Messenger',
    tags: [
      {tag: 'IPC'},
      {tag: '进程间通信'},
      {tag: 'Messenger'}
    ],
    abstract: '本文介绍Android中的IPC方式之一——Messenger。',
    timestamp: 1546909828953
  },
  {
    id: 'IPCOfAIDL',
    category: 'Android',
    title: 'Android进程间通信之AIDL',
    tags: [
      {tag: 'IPC'},
      {tag: '进程间通信'},
      {tag: 'AIDL'}
    ],
    abstract: '本文介绍Android中的IPC方式之一——AIDL。',
    timestamp: 1546931800951
  },
  {
    id: 'DynamicShortcut',
    category: 'Android',
    title: 'Android动态创建快捷方式',
    tags: [
      {tag: '快捷方式'},
      {tag: 'shortcut'},
      {tag: 'Android O'},
      {tag: 'ShortcutManager'}
    ],
    abstract: '以Android O为分界，介绍两种动态创建快捷方式的途径：广播和ShortcutManager。',
    timestamp: 1546933429448
  },
  {
    id: 'RenderProcessOnView',
    category: 'Android',
    title: 'Android中View的绘制流程',
    tags: [
      {tag: 'View'},
      {tag: '绘制流程'},
      {tag: 'invalidate'},
      {tag: 'requestLayout'}
    ],
    abstract: '介绍Android中View的绘制流程，以及更新视图的两种方法：invalidate和requestLayout。',
    timestamp: 1547191175140
  },
  {
    id: 'AsyncMessageOnView',
    category: 'Android',
    title: 'Android中View的异步消息',
    tags: [
      {tag: 'View'},
      {tag: '异步消息'},
      {tag: 'post'}
    ],
    abstract: '介绍Android中View的异步消息，以及消息传递流程。',
    timestamp: 1547436896000
  },
  {
    id: 'EventDispatchOnView',
    category: 'Android',
    title: 'Android中View的事件分发',
    tags: [
      {tag: 'View'},
      {tag: '事件分发'},
      {tag: '消费'},
      {tag: '拦截'}
    ],
    abstract: '介绍Android中View的事件分发流程，以及对事件的消费和拦截。',
    timestamp: 1547632071000
  },
  {
    id: 'GitTeachingBasedOnGerrit',
    category: 'Git',
    title: '基于Gerrit的Git常用命令',
    tags: [
      {tag: 'Gerrit'}
    ],
    abstract: '本文介绍日常开发中常用的git命令，从初阶到高阶都有，以及相关git、gerrit原理，以提升协同开发效率。',
    timestamp: 1563275310000
  },
  {
    id: 'RecyclerViewUseItemDecoration',
    category: 'Android',
    title: 'RecyclerView使用ItemDecoration绘制分割线',
    tags: [
      {tag: 'RecyclerView'},
      {tag: 'ItemDecoration'},
      {tag: '分割线'}
    ],
    abstract: '本文介绍使用RecyclerView的抽象内部类ItemDecoration实现ItemView分割线的绘制。',
    timestamp: 1564044595000
  },
  {
    id: 'RecyclerViewUseSpanSizeLookup',
    category: 'Android',
    title: 'RecyclerView使用SpanSizeLookup设置Item占位',
    tags: [
      {tag: 'RecyclerView'},
      {tag: 'SpanSizeLookup'}
    ],
    abstract: '本文介绍使用栅栏布局管理器的抽象内部类SpanSizeLookup实现Item占位多行或多列的方法。',
    timestamp: 1565754567157
  },
  {
    id: 'FunctionalProgramming',
    category: 'Java',
    title: 'Java函数式编程',
    tags: [
      {tag: '函数式编程'}
    ],
    abstract: '本文介绍Java 8新特性之一——函数式编程。',
    timestamp: 1570011688000
  },
  {
    id: 'WindowManagerHandleView',
    category: 'Android',
    title: 'WindowManager操作View源码分析',
    tags: [
      {tag: 'WindowManager'},
      {tag: 'View'}
    ],
    abstract: '本文通过源码分析WindowManager的几个重要的操作View的方法：addView，removeView，updateViewLayout等，以及它们隐含的一些风险项。',
    timestamp: 1570097049000
  },
  {
    id: 'SummaryOf2019',
    category: 'Thinking',
    title: '2019——充实的一年',
    tags: [
      {tag: '年终'},
      {tag: '总结'}
    ],
    abstract: '回想起一年前的此时，也是坐在电脑前，一边回顾总结，一边感叹时光。物是人非，心态早已是天壤之别。',
    timestamp: 1577726218786
  },
  {
    id: 'AndroidPerformanceOfMemory1',
    category: 'Android',
    title: 'Android性能优化之内存优化',
    tags: [
      {tag: '性能优化'},
      {tag: '内存优化'}
    ],
    abstract: '本章内容基于Android Q，介绍Android性能优化中的内存优化方面，通过排查、检测、规避和表现等四个方面的讲解，让更多的开发者有能力去改善或设计出更优质的程序。',
    timestamp: 1578310912658
  },
  {
    id: 'AndroidPerformanceOfMemory2',
    category: 'Android',
    title: 'Android性能优化之内存优化——内存泄漏篇',
    tags: [
      {tag: '性能优化'},
      {tag: '内存优化'},
      {tag: '内存泄漏'}
    ],
    abstract: '本文介绍Android开发中的常见内存泄漏场景和解决方案。',
    timestamp: 1578311006725
  },
  {
    id: 'AndroidMultiUser',
    category: 'Android',
    title: 'Android多用户适配',
    tags: [
      {tag: '多用户'}
    ],
    abstract: '本文基于Android Q，介绍安卓原生的多用户功能适配相关内容，供开发者学习参考。',
    timestamp: 1579014873222
  },
  {
    id: 'StartOfKotlin',
    category: 'Kotlin',
    title: '浅谈Kotlin入门',
    tags: [
      {tag: '入门'}
    ],
    abstract: '16年，Kotlin官方正式推出该语言第一版，17年，Google倡导开发者使用其作为Android开发的基本语言。',
    timestamp: 1582860315172
  },
  {
    id: 'PrincipleAndProcessOfMultiUser',
    category: 'Android',
    title: 'Android多用户原理及流程分析',
    tags: [
      {tag: '多用户'}
    ],
    abstract: '本文基于Android Q，介绍多用户基本原理和流程。',
    timestamp: 1584518034157
  },
  {
    id: 'CompatibilityOfDynamicShortcut',
    category: 'Android',
    title: 'Android动态快捷方式兼容性问题',
    tags: [
      {tag: '动态快捷方式'},
      {tag: 'ShortcutManager'},
      {tag: '兼容性'}
    ],
    abstract: '本文基于Android Q，通过介绍笔者工作中翻过的一次车，讲述Android中的动态快捷方式兼容性处理注意事项。',
    timestamp: 1585528505000
  },
  {
    id: 'AOSPDecoupleIndependentApp',
    category: 'Android',
    title: 'AOSP解耦独立应用总结',
    tags: [
      {tag: 'AOSP'},
      {tag: '解耦'},
      {tag: '编译'},
      {tag: 'Proto'}
    ],
    abstract: '本文基于Android Q，介绍将AOSP中的仓库解耦为独立应用时的一些疑难点。',
    timestamp: 1585529025000
  },
  {
    id: 'AOSPUpgradeCodebase',
    category: 'Android',
    title: 'AOSP升级codebase疑难总结',
    tags: [
      {tag: 'AOSP'},
      {tag: 'codebase'}
    ],
    abstract: '本文讲述笔者在升级codebase时遇到的一些疑难问题和解决思路。',
    timestamp: 1585999096534
  },
  {
    id: 'ComprehensionOfWork',
    category: 'Thinking',
    title: '漫谈对工作的看法',
    tags: [
      {tag: '社招'},
      {tag: '面试'},
      {tag: '总结'},
      {tag: '建议'}
    ],
    abstract: '天下没有不散的宴席，时隔一年，又要离开熟悉的团队熟悉的人，为自己的职业生涯奔波离去。',
    timestamp: 1590332734491
  },
  {
    id: 'OpenGL_OOM',
    category: 'Android',
    title: 'OpenGL OOM的解决方案',
    tags: [
      {tag: 'OpenGL'},
      {tag: 'OOM'},
      {tag: 'Solution'}
    ],
    abstract: '本文介绍使用OpenGL后引起OOM的一些解决方案。',
    timestamp: 1595599572311
  },
  {
    id: 'CommitTemplateByGitHook',
    category: 'Git',
    title: '使用Git Hook配置提交模板',
    tags: [
      {tag: 'Hook'},
      {tag: 'Commit'}
    ],
    abstract: '在开发中，为了规范化提交信息，以便追溯修改和理解修改内容，通常会采用统一的提交信息模板来约束开发人员。因此可以通过配置git，来提升便利性。',
    timestamp: 1597515957623
  },
  {
    id: 'HowToMakeGithubPages',
    category: 'Vue.js',
    title: 'Vue.js+Github打造个人网站GithubPages',
    tags: [
      {tag: 'Github'},
      {tag: 'GithubPages'},
      {tag: 'github.io'}
    ],
    abstract: '本文介绍如何使用Vue.js开发一个独一无二的GithubPages。',
    timestamp: 1598065740871
  },
  {
    id: 'ProgrammerFindsLove',
    category: 'Thinking',
    title: '程序猿是怎么找对象的',
    tags: [
      {tag: '抓包'},
      {tag: '网络代理'},
      {tag: 'Charles'},
      {tag: '计算机网络'}
    ],
    abstract: '本文讲述程序猿通过研究相亲平台学习计算机网络的故事。',
    timestamp: 1598712467798
  },
  {
    id: 'SummaryOfWorkStage1',
    category: 'Thinking',
    title: '回顾头三年职业生涯',
    tags: [
      {tag: '总结'},
      {tag: '职业生涯'},
      {tag: '感悟'},
      {tag: '心得'}
    ],
    abstract: '回顾一下职业生涯近三年，作为生涯第一阶段的总结，分享这段励志的经历，勉励更多迷茫的朋友。',
    timestamp: 1599928549049
  },
  {
    id: 'TextView_ActionMode',
    category: 'Android',
    title: 'TextView自定义长按菜单',
    tags: [
      {tag: 'TextView'},
      {tag: 'ActionMode'}
    ],
    abstract: '介绍TextView自定义长按菜单的实现方式。',
    timestamp: 1608781150239
  },
  {
    id: 'AndroidGesture',
    category: 'Android',
    title: 'Android手势拦补点',
    tags: [
      {tag: '手势'},
      {tag: '拦补点'}
    ],
    abstract: '介绍Android手势中的高阶操作，以解决手势冲突问题。',
    timestamp: 1611798620574
  },
  {
    id: 'ViewInitNPEBelowAndroidM',
    category: 'Android',
    title: 'Android M之前View实例化时报访问成员变量空指针的问题',
    tags: [
      {tag: 'View'},
      {tag: 'crash'},
      {tag: '类加载'},
      {tag: '字节码'},
      {tag: 'solution'}
    ],
    abstract: '写了四年安卓，我发现我根本不懂Java。',
    timestamp: 1618917956645
  },
  {
    id: 'AnimatorIsRunning_WrongState',
    category: 'Android',
    title: 'Android O之前Animator的isRunning判断错误的问题',
    tags: [
      {tag: 'Animator'},
      {tag: '动画'}
    ],
    abstract: '又是SDK的坑。',
    timestamp: 1618918185621
  },
  {
    id: 'GLSurfaceViewNoFrame',
    category: 'Android',
    title: '基于GLSurfaceView的视频播放器偶现无画面的问题分析',
    tags: [
      {tag: 'GLSurfaceView'},
      {tag: 'Renderer'},
      {tag: 'player'},
      {tag: '播放器'},
      {tag: 'ijkplayer'}
    ],
    abstract: '祖传bug终于搞定了！',
    timestamp: 1619616673259
  },
  {
    id: 'VapKeepLastFrame',
    category: 'Android',
    title: '企鹅电竞VAP动画组件停留最后一帧画面',
    tags: [
      {tag: 'VAP'},
      {tag: '动画'},
      {tag: 'TextureView'}
    ],
    abstract: '改造VAP动画组件实现停留最后一帧画面的效果',
    timestamp: 1621249354510
  },
  {
    id: 'CustomAndroidCapCmd',
    category: 'Android',
    title: '自定义Android截屏命令',
    tags: [
      {tag: 'shell'},
      {tag: 'adb'},
      {tag: '截屏'}
    ],
    abstract: '一个命令，完成截图、拷贝两件事。',
    timestamp: 1628153282000
  }
]

export default {
  blogs
}
