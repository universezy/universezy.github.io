const blogs = [
  {
    id: 'Openlayers3Cluster',
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
    id: 'Openlayers3LineString',
    category: 'Openlayers',
    title: 'Openlayer3学习心得之LineString',
    tags: [
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
    title: '大四秋招总结 ',
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
      {tag: '绘制流程'}
    ],
    abstract: '介绍Android View的绘制流程，引出后续的异步消息、事件分发。',
    timestamp: 1547191175140
  }
]

export default {
  blogs
}
