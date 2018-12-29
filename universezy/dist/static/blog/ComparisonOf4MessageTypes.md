# Android四种常用的消息传递机制/模式的比较

## Abstract

四种分别是**callback interface**，**Handler-Message**，**Broadcast Receiver**和**Observer-Subject**。

---
## 1. callback interface

这种消息传递的方式，需要在**接收方**调用**发送方**的方法或者在创建实例时，将回调接口传入，并在**接收方**实现接口方法。举例：

定义一个回调接口：

```java
public interface ITest{
	void doWhat();
}
```

接收方：

```java
public class Receiver implements ITest{
	private Sender sender = null;
	
	public void createSender(){
		sender = new Sender(this);
	}
	
	@Override
	public void doWhat(){
		//TODO
	}
}
```

发送方：

```java
public class Sender{
	private ITest iTest = null;
	
	public Sender(ITest iTest){
		this.iTest = iTest;
	}
	
	public void doSth(){
		iTest.doWhat();
	}
}
```

优点：代码量小，很容易理解，处理效率高。

缺点：不利于修改和扩展，接口一变更，发送方和接收方都需要修改参数。并且必须提供一个获取接口的入口。

---
## 2. Handler-Message

这种方式和第一种在构造时有相同之处，就是同样需要从**接收方**传给**发送方**。举例：

接受方：

```java
public class Receiver implements ITest{
	private Handler handler = new Handler(new Handler.Callback(){
		@Override
		public boolean handlerMessage(Message msg){
			switch(msg.what){
				case 0:
					String message = (String)msg.obj;
					Log.e("Receiver", message)
					break;
				case 1:
					//TODO
					break;
				default:
					break;
			}
			return true;
		}
	});
	
	public void createSender(){
		sender = new Sender(handler);
	}
}
```

发送方：

```java
public class Sender{
	private Handler handler = null;
	
	public Sender(Handler handler){
		this.handler = handler;
	}
	
	public void doSth(){
		Message msg = new Message();
		msg.what = 0;
		msg.obj = "Hello world!";
		handler.sendMessage(msg);
	}
}
```

优点：无需去自定义接口，便于修改和扩展。

缺点：同样必须提供一个获取接口的入口。修改发送方数据后，在接收方存在数据类型转换异常的风险。

---
## 3. Broadcast Receiver

广播分动态注册和静态注册，这里讲动态注册。常用于两个业务层之间多个数据通信。广播的本质也是观察者模式。必须注意的是，为防止内存泄漏，需要及时注销接收器。举例：

接收方：

```java
public class ReceiverActivity extends AppCompatActivity{
	private TestReceiver receiver;

	@Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
		receiver = new TestReceiver();
		IntentFilter filter = new IntentFilter(/*这里填你自定义的这个广播过滤的名字NAME*/);
        registerReceiver(receiver, filter);
	}

	@Override
    protected void onDestroy() {
        super.onDestroy();
        //非常重要！！！！！！！！！！
        unregisterReceiver(receiver);
	}
	
	public class TestReceiver extends BroadcastReceiver {
		@Override
        public void onReceive(Context context, Intent intent) {
			String type = intent.getStringExtra(/*这里填你自定义的发送消息的类型TYPE*/);
			switch(type){
				case "TYPE1":
					int i = intent.getIntExtra("testInteger", 0);
					break;
				case "TYPE2":
					String s = intent.getStringExtra("testString");
					break;
				default:
					break;
			}
		}
	}
}
```

发送方：

```java
public class SendService extends Service{

	public void doSth1(){
		Intent intent = new Intent(/*这里填刚才你写的那个NAME*/);
		intent.putExtra(/*这里填刚才你写的那个消息类型TYPE*/,"TYPE1");
		intent.putExtra("testInteger", 1);
		sendBroadcast(intent);
	}

	public void doSth2(){
		Intent intent = new Intent(/*这里填刚才你写的那个NAME*/);
		intent.putExtra(/*这里填刚才你写的那个消息类型TYPE*/,"TYPE2");
		intent.putExtra("testString", "Hello world!");
		sendBroadcast(intent);
	}
}
```

优点：发送方和接收方实现了完全解耦，发送方将消息发送出去后，这条消息就与他无关了，收没收到也不管。

缺点：广播的接收和发送得依赖context的环境。每次调用都需要写繁琐的intent和putExtra。数据传递方式类比handler，在接收时存在类型转换异常的风险。

---
## 4. Observer-Subject

观察者模式常用于一对多的消息群发。观察者是接收方，主题是发送方。同样需要及时注销防止内存泄漏。举例：

定义一个观察者接口：

```java
public interface Observer{
	void newMsg(String msg);
}
```

定义一个主题接口：

```java
public interface Subject{
	void addObserver(Observer observer);

	void removeObserver(Observer observer);

	void notify(String msg);
}
```

定义一个观察者管理类实现主题接口：

```java
public class ObserverManager implements Subject{
	private static ObserverManager instance = null;
	private List<Observer> Observers = new ArrayList<>();
	
	private ObserverManager(){
	}

	public static ObserverManager getInstance() {
        if (null == instance) {
            synchronized (ObserverManager.class) {
                if (null == instance) {
                    instance = new ObserverManager();
                }
            }
        }
        return instance;
    }

	@Override
	public void addObserver(Observer observer){
		Observers.add(observer);
	}

	@Override
	public void removeObserver(Observer observer){
		Observers.remove(observer);
	}

	@Override
	public void notify(String msg){
		for(Observer observer: Observers){
			observer.newMsg(msg);
		}
	}
}
```

观察者即接收方：

```java
public class ObserverActivity extends AppCompatActivity implements Observer{
	private ObserverManager manager = ObserverManager.getInstance();

	@Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
		manager.addObserver(this);
	}

	@Override
    protected void onDestroy() {
        super.onDestroy();
        //非常重要！！！！！！！！！！
        manager.removeObserver(this);
	}

	@Override
	public void newMsg(String msg){
		Log.e("Get a new msg", msg);
	}
}
```

主题即发送方：

```java
public class Sender{
	private ObserverManager manager = ObserverManager.getInstance();
	
	public void sendNewMsg(){
		manager.notify("This is a new msg from sender.");
	}
}
```

优点：同广播，高度解耦。接口自定义，扩展性强。
缺点：一对一时或者接收方数量少时，“杀鸡焉用牛刀”。接口修改时需要到处改动，同callback。
