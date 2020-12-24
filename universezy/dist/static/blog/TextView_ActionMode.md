# TextView自定义长按菜单

## 一、 实现方式

安卓原生的长按菜单，支持自定义菜单内容及事件，只需要两步设置便可快速实现：
```kotlin
val tvDemo: TextView
// 设置为可选中的，其内部会让控件支持长按
tvDemo.setTextIsSelectable(true)
tvDemo.customSelectionActionModeCallback = object : ActionMode.Callback {
    override fun onCreateActionMode(mode: ActionMode?, menu: Menu?): Boolean {
        // 开始创建ActionMode时回调，返回值为true表示要创建，false表示不创建
        // 基本原理为：当前应用窗口根布局创建出Menu，然后Menu中创建ActionMode对应的按钮
    }

    override fun onPrepareActionMode(mode: ActionMode?, menu: Menu?): Boolean {
        // 在Menu创建ActionMode后的准备工作，此时需要往Menu中塞入所需的MenuItem，也可以自定义SubMenu
        // 返回值为true表示需要刷新按钮内容，为false的话，当关闭Menu后下次重新打开时会沿用之前的状态
    }

    override fun onActionItemClicked(mode: ActionMode?, item: MenuItem?): Boolean {
        // Item的点击事件回调，通常在这里根据item的id来处理对应的自定义事件
        // 如果自己消费了事件，应当返回true
    }

    override fun onDestroyActionMode(mode: ActionMode?) {
        // 销毁ActionMode时回调，触发方式为主动调用ActionMode#finish()
    }
}
```

---
## 二、 代码示例

为了提高代码的复用率，将其封装为一个基本控件，并提供默认的一些菜单功能：全选（仅对EditText生效）、复制、粘贴（仅对EditText生效）、@人名，以下是示例：
```kotlin
class CustomSelectionActionModeCallback(
    val context: Context,
    val view: TextView? = null
) : ActionMode.Callback {

    private val menuItems = ArrayList<CustomMenuItem>(0)

    override fun onCreateActionMode(mode: ActionMode?, menu: Menu?): Boolean {
        return true
    }

    override fun onPrepareActionMode(mode: ActionMode?, menu: Menu?): Boolean {
        menu?.let {
            it.clear()
            // 遍历自定义菜单项列表
            menuItems.forEachIndexed { index, item ->
                // 逐一塞入菜单中
                it.add(Menu.NONE, item.getId(), index, item.getTitle(context))
            }
        }
        return true
    }

    override fun onActionItemClicked(mode: ActionMode?, item: MenuItem?): Boolean {
        item?.itemId?.let {
            val result = menuItems.find { item ->
                item.getId() == it
            }?.getEvent()?.invoke() ?: false
            if (result) {
                mode?.finish()
            }
        }
        return true
    }

    override fun onDestroyActionMode(mode: ActionMode?) {
    }

    fun addMenu(menuItem: CustomMenuItem) {
        menuItems.add(menuItem)
    }

    fun removeMenu(item: CustomMenuItem) {
        menuItems.remove(item)
    }

    /**
     * 全选的item，直接返回文本
     */
    class SelectAllMenuItem(textView: TextView, callback: EventCallback?) : CustomMenuItem(
        "SELECT_ALL",
        "全选",
        {
            if (textView is EditText) {
                textView.selectAll()
                val content = textView.text
                val solved = callback?.beforeEvent(content) ?: content
                callback?.onEvent(solved) == true
            } else {
                false
            }
        }
    )

    /**
     * 复制的item，调用剪切板服务，将文本保存
     */
    class CopyMenuItem(textView: TextView, callback: EventCallback?) : CustomMenuItem(
        "COPY",
        "复制",
        {
            val cms =
                textView.context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
            val content = textView.text
            val solved = callback?.beforeEvent(content) ?: content
            cms.primaryClip = ClipData.newPlainText(null, solved)
            callback?.onEvent(solved) == true
        }
    )

    /**
     * 粘贴的item，调用剪切板服务，将栈顶的文本粘贴到EditText中
     */
    class PasteMenuItem(textView: TextView, callback: EventCallback?) : CustomMenuItem(
        "PASTE",
        "粘贴",
        {
            val cms =
                textView.context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
            if (cms.hasPrimaryClip()) {
                val content = cms.primaryClip?.getItemAt(0)?.text
                if (textView is EditText) {
                    val solved = callback?.beforeEvent(content) ?: content
                    textView.setText(solved)
                    callback?.onEvent(solved) == true
                } else {
                    false
                }
            } else {
                false
            }
        }
    )

    /**
     * @人名的item，通常由调用方实现业务，因此直接由回调接口返回
     */
    class AtMenuItem(textView: TextView, callback: EventCallback?) : CustomMenuItem(
        "AT",
        "@TA",
        {
            val content = textView.text
            val solved = callback?.beforeEvent(content) ?: content
            callback?.onEvent(solved) == true
        }
    )

    /**
     * 自定义菜单item，需要传入item的id、标题、事件
     */
    open class CustomMenuItem {
        private val id: String
        private var title: CharSequence? = null
        private var titleRes: Int? = null
        private val event: () -> Boolean

        constructor(id: String, title: CharSequence, event: () -> Boolean) {
            this.id = id
            this.title = title
            this.event = event
        }

        constructor(id: String, titleRes: Int, event: () -> Boolean) {
            this.id = id
            this.titleRes = titleRes
            this.event = event
        }

        fun getId() = id.hashCode()

        fun getTitle(context: Context): CharSequence? {
            return title ?: titleRes?.let { context.getString(it) }
        }

        fun getEvent() = event

        override fun equals(other: Any?): Boolean {
            return other is CustomMenuItem
                    && id == other.id
                    && title == other.title
                    && titleRes == other.titleRes
                    && event == other.event
        }
    }

    /**
     * 默认菜单功能的回调接口
     */
    interface EventCallback {
        /**
         * @param content 原文本
         * @return 处理后文本
         */
        fun beforeEvent(content: CharSequence?): CharSequence? {
            return content
        }

        /**
         * @return true表示关闭menu
         */
        fun onEvent(content: CharSequence?): Boolean
    }
}
```

---
## 三、 运行效果

![](static/blog/image/AM_TextView_1.png)

---
## 四、 参考文献

- [ActionMode.Callback在TextView中的使用总结](https://www.jianshu.com/p/ed57917ced88)