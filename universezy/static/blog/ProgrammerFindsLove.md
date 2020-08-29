# 程序猿是怎么找对象的

## 一、 背景

小Y是一名程序猿，年龄还算比较年轻，但看见组里同事都有伴，心里难免有点慌。某天一同事推荐一相亲平台小程序并自称已经找到合适的对象，于是小Y抱着试一试的心态，注册认证。这个平台可以随机推送一些人选的信息，但是茫茫人海中要想找到一个合适的人，谈何容易，一个月过去了似乎没有什么收获。

---
## 二、 灵感

小Y近期在调试时，常常需要设置代理，代理是一种修改网络请求过程的手段，正常的请求过程是：`Client -> Server`，代理后的请求过程是：`Client -> Proxy -> Server`，中间一层代理层至关重要，我们可以在请求前查看请求的内容和参数，甚至做修改、拦截、重定向等，也可以在接收响应时查看请求结果。

小Y很好奇，想看看同事在平台上对外展示的择偶信息是什么样的，但是平台推送犹如大海捞针，能刷到的几率堪比中彩票，如果能根据关键词或者id搜索到同事该多好。因此，小Y心想，如果抓取到查看用户信息的请求，再通过好友列表找到id，不就可以定向查找到好友的信息了吗？于是，说做就做。

---
## 三、 实战

明确大致方向后，需要先思考以下几个问题：
- 请求如果是http，数据是否会被加密？
- 请求如果是https，又怎么破解加密？
- 如果使用token，自己怎么构造请求？

接下来便是具体行动。

---
### 1. 配置代理环境

小Y首先在PC上配置代理环境，MacOS上使用的是抓包软件**Charles**，安装好之后：
> Help -> SSL Proxying -> Install Charles Root Certificate on a Mobile Device or Remote Browser

打开提示配置代理和安装证书：

![](static/blog/image/PFL_CA.png)

然后小Y借来一台iPhone，连接wifi，使其和PC处于同一个网段下，按照图示ip、port配置代理。

在这之前，小Y尝试过使用Android，最终因没能抓取到所需请求宣告失败，幸运的是iOS上能顺利抓取到。

配置好网络代理后，浏览器打开图示的`chls.pro/ssl`下载证书到本地，并安装证书，安装好之后：
> 设置 -> 通用 -> 关于本机 -> 证书信任设置

启用刚才安装的证书。证书的作用是让手机信任代理层。

期间，Charles会弹框提示是否添加新设备，点击允许即可。

至此，小Y手里的iPhone的网络请求便可以被PC端查看请求和响应。

---
### 2. 抓包请求方式

准备就绪后，进入小程序，点击任意推送的item：

![](static/blog/image/PFL_ClickUserInfo.jpeg)

查看此时的网络请求：

![](static/blog/image/PFL_GetUserInfo.png)

很惊喜，http，明文无加密，json格式，从返回的结果上看，有展示的基本信息，用户id等。

（Tips：小Y获取的都是展示在小程序页面上的信息，不是非法获取的用户隐私，且不用于个人和商业等其他活动，因此既不违法也不违背道德）

查看获取用户信息的请求头：

![](static/blog/image/PFL_UserInfoRequest.png)

需要使用个人账号登录后的token。

在该请求上右键复制cURL：

![](static/blog/image/PFL_RequestUrl.png)

得到该请求的shell命令：
```shell
curl -H 'Host: a.b.c' -H 'platform: weapp' -H 'content-type: application/json' -H 'token: a b.c.d' -H 'version: 3.7.10' -H 'User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 13_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.15(0x17000f29) NetType/WIFI Language/zh_CN' -H 'Referer: xxx.html' --compressed 'https://abc/d/info?uid=1234567'
```

这是最关键的两步中的第一步，抓取到请求方式。第二步则是找到用户id，这两步都搞定的话，就可以自由地请求了。

---
### 3. 获取好友id

小Y来到好友列表：

![](static/blog/image/PFL_FriendList.jpeg)

查看此时的网络请求：

![](static/blog/image/PFL_FriendInfo.png)

很遗憾，只有默认昵称才显示用户id，部分好友修改昵称后，便无法知晓id，不知道id，就没法获取好友的主页信息。

小Y不甘心，难道没有别的办法了吗？天无绝人之路，小Y观察这里的`loverUserId`，这在前面展示主页信息的请求结果里有出现，也就是说，知道了uid，就可以获取`loverUserId`，而知道`loverUserId`，想获取uid，只有一个办法——穷举法：把所有的uid请求一遍，匹配包含目标loverUserId的信息，换句话说，写一个网络请求脚本进行批量处理，直到找到目标信息。

---
### 4. 批量请求

小Y找来了老李，说明了意图，老李一听，甚是支持，在老李的指导下，小Y完成了一个脚本：
```shell
START=1234567
TARGET="keyword"

findUser() {
    START=$((++START))
    echo "${START}"
    curl -H 'Host: a.b.c' -H 'platform: weapp' -H 'content-type: application/json' -H 'token: a b.c.d' -H 'version: 3.7.10' -H 'User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 13_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.15(0x17000f29) NetType/WIFI Language/zh_CN' -H 'Referer: xxx.html' --compressed "https://abc/d/info?uid=${START}" | grep ${TARGET}
    if [[ $? != 0 ]]; then
        return 1
    else 
        echo "Successful! ${START}"
        return 0
    fi
}

while true
do
    if findUser; then
        exit 0
    fi
    sleep 0.5
done
```

`START`为小Y个人id，`TARGET`为好友昵称关键字，请求并过滤返回的结果，如果包含关键字，则中止程序并提示。为了防止高频请求导致服务器检测到异常，设置了0.5秒的延迟。

然后运行该脚本：

![](static/blog/image/PFL_RunScript.png)

为了更高效率，小Y开启了10个终端窗口，对起始id分组设值，这样一来，1秒钟可以请求20次数据。

---
## 四、 感悟

最后小Y是否找到好友的信息并不重要，重要的是小Y未来的故事还很长很长。

通过这一次实践，小Y又学到了一些知识技能，相信小Y将来不再需要这样一个平台，也能找到合适的TARGET。