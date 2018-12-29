以Android工程为例，在module的build.gradle文件中配置如下：
```gradle
android {
    buildTypes {
        debug {
            // 一般情况下debug版本不启用混淆，便于调试
            minifyEnabled false
        }
        release {
            // release版本启用混淆
            minifyEnabled true
            // 设置混淆文件的路径，一般使用默认值，前者是系统默认混淆文件，后者是module默认混淆文件
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```