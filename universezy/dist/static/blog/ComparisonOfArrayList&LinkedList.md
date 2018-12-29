## 一、 前言

首先我要批判一下很多关于这两个数据结构的对比测试文章，其作者在根本没搞清楚这俩内部实现原理和数据结构的情况下，用错误的方法测得结果，碰巧符合理论，因此认为符合，从而误导读者。之所以这么说，还请读者细读本文，之后便明白了。

## 二、 数据结构

### ArrayList
![](https://raw.githubusercontent.com/universezy/ListDemo/master/image/arraylist.png)

ArrayList在内存中是连续的、单向的、有序的。

ArrayList中维护了一个按照下标顺序的一维数组，数组中每个item指向对应的value。
```java
    private static final int DEFAULT_CAPACITY = 10;
    private static final Object[] EMPTY_ELEMENTDATA = {};
    private static final Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {};
    transient Object[] elementData;
    
    public ArrayList(int initialCapacity) {
        if (initialCapacity > 0) {
            this.elementData = new Object[initialCapacity];
        } else if (initialCapacity == 0) {
            this.elementData = EMPTY_ELEMENTDATA;
        } else {
            throw new IllegalArgumentException("Illegal Capacity: "+
                                               initialCapacity);
        }
    }
    
    public ArrayList() {
        this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;
    }
```

当我们通过下标进行指定位置增加或者删除操作时，先由下标index从item数组找到对应item，接着从这个下标开始向后，把剩下的item通过覆盖复制，向后或者向前移动一位，最后在index位置增加一个item或者置空末尾item。
```java
    // 增加
    public void add(int index, E element) {
        rangeCheckForAdd(index);

        ensureCapacityInternal(size + 1);  // Increments modCount!!
        System.arraycopy(elementData, index, elementData, index + 1,
                         size - index);
        elementData[index] = element;
        size++;
    }

    // 删除
    public E remove(int index) {
        rangeCheck(index);

        modCount++;
        E oldValue = elementData(index);

        int numMoved = size - index - 1;
        if (numMoved > 0)
            System.arraycopy(elementData, index+1, elementData, index,
                             numMoved);
        elementData[--size] = null; // clear to let GC do its work

        return oldValue;
    }
    
    E elementData(int index) {
        return (E) elementData[index];
    }
```

当我们通过下标进行指定位置查找或者修改操作时，先由下标index从item数组获取对应item，返回或者修改item指向的对象地址。
```java
    // 查找
    public E get(int index) {
        rangeCheck(index);

        return elementData(index);
    }
    
    // 修改
    public E set(int index, E element) {
        rangeCheck(index);

        E oldValue = elementData(index);
        elementData[index] = element;
        return oldValue;
    }
    
    E elementData(int index) {
        return (E) elementData[index];
    }
```

---
### LinkedList
![](https://raw.githubusercontent.com/universezy/ListDemo/master/image/linkedlist.png)

LinkedList在内存中是不连续的、双向的、有序的。

LinkedList中的每一个item，称为node，它包含三个部分：当前node的value，指向上一个node的指针prev、指向下一个node的指针next。由于LinkedList还保存了第一个node称为first和最后个node称为last，所以他还是双向的。
```java
    transient Node<E> first;
    transient Node<E> last;
    public LinkedList() {
    }
    
    private static class Node<E> {
        E item;
        Node<E> next;
        Node<E> prev;

        Node(Node<E> prev, E element, Node<E> next) {
            this.item = element;
            this.next = next;
            this.prev = prev;
        }
    }
```

当我们通过下标进行指定位置增加或者删除操作时，会从first node开始（如果下标指向末端，则直接到末端node），不断地由node的next找到下一个node，直到到达目标node，如果是增加操作，则创建一个node，将上一个node的next指向新node的prev，将下一个node的prev指向新node的next，这样就在list中间重新连接起来；如果是删除操作，则删除当前node，将上一个node的next指向下一个node的prev。
```java
    Node<E> node(int index) {
        // assert isElementIndex(index);

        if (index < (size >> 1)) {
            Node<E> x = first;
            for (int i = 0; i < index; i++)
                x = x.next;
            return x;
        } else {
            Node<E> x = last;
            for (int i = size - 1; i > index; i--)
                x = x.prev;
            return x;
        }
    }
    
    // 增加
    public void add(int index, E element) {
        checkPositionIndex(index);

        if (index == size)
            linkLast(element);
        else
            linkBefore(element, node(index));
    }
    
    void linkLast(E e) {
        final Node<E> l = last;
        final Node<E> newNode = new Node<>(l, e, null);
        last = newNode;
        if (l == null)
            first = newNode;
        else
            l.next = newNode;
        size++;
        modCount++;
    }

    void linkBefore(E e, Node<E> succ) {
        // assert succ != null;
        final Node<E> pred = succ.prev;
        final Node<E> newNode = new Node<>(pred, e, succ);
        succ.prev = newNode;
        if (pred == null)
            first = newNode;
        else
            pred.next = newNode;
        size++;
        modCount++;
    }
    
    // 删除
    public E remove(int index) {
        checkElementIndex(index);
        return unlink(node(index));
    }
    
    E unlink(Node<E> x) {
        // assert x != null;
        final E element = x.item;
        final Node<E> next = x.next;
        final Node<E> prev = x.prev;

        if (prev == null) {
            first = next;
        } else {
            prev.next = next;
            x.prev = null;
        }

        if (next == null) {
            last = prev;
        } else {
            next.prev = prev;
            x.next = null;
        }

        x.item = null;
        size--;
        modCount++;
        return element;
    }
```

当我们通过下标进行指定位置查找或者修改操作时，会从first node或者last node（LinkedList.get(int index)方法中，会对下标值进行判断，如果小于长度的一半，则从first开始，否则从last开始，这是对双向性的利用）开始，不断地由node的next去找下一个node的地址，直到到达目标node，返回value或者修改value指向的对象地址。
```java
    // 查找
    public E get(int index) {
        checkElementIndex(index);
        return node(index).item;
    }
    
    // 修改
    public E set(int index, E element) {
        checkElementIndex(index);
        Node<E> x = node(index);
        E oldVal = x.item;
        x.item = element;
        return oldVal;
    }
    
    Node<E> node(int index) {
        // assert isElementIndex(index);

        if (index < (size >> 1)) {
            Node<E> x = first;
            for (int i = 0; i < index; i++)
                x = x.next;
            return x;
        } else {
            Node<E> x = last;
            for (int i = size - 1; i > index; i--)
                x = x.prev;
            return x;
        }
    }
```

---
## 三、 效率对比

我们构造相同长度的ArrayList和LinkedList，由于增加操作会改变数组长度，导致时间增加，我们用一次增加一次删除交替进行，并分别统计二者时间。由于修改操作的实现过程基于查找操作，我们仅以查找为例。
```java
	private final static int MAX_SIZE = 1000;
	private final static int TEST_TIMES = 1000;
	private final static Integer DEFAULT_ITEM = 0;
	private List<Integer> arrayList;
	private List<Integer> linkedList;

	public void init() {
		arrayList = new ArrayList<>();
		linkedList = new LinkedList<>();
		for (int i = 0; i < MAX_SIZE; i++) {
			arrayList.add(i);
			linkedList.add(i);
		}
	}
```

对于增加/删除操作：
```java
	public void testAdd() {
		System.out.println("\ntest add:");
		long totalAddArrayList = 0;
		long totalRemoveArrayList = 0;
		long totalAddLinkedList = 0;
		long totalRemoveLinkedList = 0;
		long start, stop;

		for (int i = 0; i < TEST_TIMES; i++) {
			start = System.nanoTime();
			arrayList.add(i, DEFAULT_ITEM);
			stop = System.nanoTime();
			totalAddArrayList += (stop - start);

			start = System.nanoTime();
			arrayList.remove(i);
			stop = System.nanoTime();
			totalRemoveArrayList += (stop - start);
		}
		System.out.println("In arrayList, add cost time: " + totalAddArrayList + " ns, remove cost time: "
				+ totalRemoveArrayList + " ns");

		for (int i = 0; i < TEST_TIMES; i++) {
			start = System.nanoTime();
			linkedList.add(i, DEFAULT_ITEM);
			stop = System.nanoTime();
			totalAddLinkedList += (stop - start);

			start = System.nanoTime();
			linkedList.remove(i);
			stop = System.nanoTime();
			totalRemoveLinkedList += (stop - start);
		}
		System.out.println("In linkedList, add cost time: " + totalAddLinkedList + " ns, remove cost time: "
				+ totalRemoveLinkedList + " ns");
	}
```

对于查找操作：
```java
	public void testFind() {
		System.out.println("\ntest find:");
		long start1 = System.nanoTime();
		for (int i = 0; i < TEST_TIMES; i++) {
			arrayList.get(i);
		}
		long stop1 = System.nanoTime();
		System.out.println("In arrayList, cost time: " + (stop1 - start1) + " ns");

		long start2 = System.nanoTime();
		for (int i = 0; i < TEST_TIMES; i++) {
			linkedList.get(i);
		}
		long stop2 = System.nanoTime();
		System.out.println("In linkedList, cost time: " + (stop2 - start2) + " ns");
	}
```

运行结果：
```shell
test add:
In arrayList, add cost time: 590724 ns, remove cost time: 635214 ns
In linkedList, add cost time: 1612482 ns, remove cost time: 1538693 ns

test find:
In arrayList, cost time: 136996 ns
In linkedList, cost time: 944334 ns
```

---
## 四、 结论

LinkedList的耗时由寻址时间和连接节点时间组成，连接节点时间对于任何两个位置都几乎相同（两端稍微小一点），但寻址很耗时；ArrayList的耗时由一维数组访问时间和数组拷贝时间组成，访问时间几乎可以忽略，但拷贝很耗时。

理论上：

- 对于随机增删操作：LinkedList平均效率优于ArrayList，因为LinkedList中单次连接节点的时间小于ArrayList中数组拷贝的时间。由于LinkedList的双向性，两端耗时最小，中间耗时最大；ArrayList头端耗时最大，尾端耗时最小。

- 对于随机查改操作：ArrayList平均效率优于LinkedList，因为ArrayList中访问一维数组的时间小于LinkedList中寻址的时间。由于LinkedList的双向性，两端耗时最小，中间耗时最大；ArrayList耗时从头端向尾端依次增加。

实际结果：

- 对于随机增删操作：LinkedList耗时明显大于ArrayList，不符合预期，对于这个结果，我目前没想到方法去证明，网上有别人的证明过程，但是很多都是有问题的，每次增删操作后，ArrayList长度改变了，下一次拷贝数组的时间就有误差，而LinkedList不受影响，另一种就是往固定位置插入或删除item，这也是不对的。读者可自行尝试证明这个结论，但要注意一点，每次增删操作时数组长度相同，增删操作要么具有随机性，要么就从头到尾都增删一次来计算平均时间。

- 对于随机查改操作：ArrayList耗时明显小于LinkedList，符合预期。

---
## 五、源码

[ListDemo](https://github.com/universezy/ListDemo)