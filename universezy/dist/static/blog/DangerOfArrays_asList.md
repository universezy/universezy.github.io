## 一、 前言

先交代该问题出现的背景，博主最近在业务中，需要把List以逗号为分隔符，转为字符串存到本地文件中，同样也需要读取这个字符串转回List，于是自然而然想到的是：
```java
String pkgsString = "aaa,bbb,ccc,ddd,eee";
String[] pkgs = pkgsString.split(",");
List<String> pkgList = Arrays.asList(pkgs);
```

这么看来，没毛病，然后我要对List进行增删操作，为了避免出现并发修改异常(ConcurrentModificationException)，此处使用迭代器：
```java
Iterator<String> it = pkgList.iterator();
while (it.hasNext()) {
    String pkg = it.next();
    if ("aaa".equals(pkg)) {
        it.remove();
    }
}
```

再一看，也没毛病，然后一运行，报错，抛出UnsupportedOperationException异常，不支持的操作？Arrays.asList()返回的不是一个ArrayList吗，ArrayList中获取的迭代器怎么会不支持remove操作？于是开始检查源码，发现了这个大坑。

---
## 二、 Arrays.asList()为什么坑

jdk中的源码是：(注释全部贴上来了，因为很关键)
```java
/**
 * Returns a fixed-size list backed by the specified array.  (Changes to
 * the returned list "write through" to the array.)  This method acts
 * as bridge between array-based and collection-based APIs, in
 * combination with {@link Collection#toArray}.  The returned list is
 * serializable and implements {@link RandomAccess}.
 *
 * <p>This method also provides a convenient way to create a fixed-size
 * list initialized to contain several elements:
 * <pre>
 *     List&lt;String&gt; stooges = Arrays.asList("Larry", "Moe", "Curly");
 * </pre>
 *
 * @param <T> the class of the objects in the array
 * @param a the array by which the list will be backed
 * @return a list view of the specified array
 */
public static <T> List<T> asList(T... a) {
    return new ArrayList<>(a);
}
```
表面上看，这不就是我们熟悉的ArrayList吗？怎么会出问题，点进去看：
```java
/**
 * @serial include
 */
private static class ArrayList<E> extends AbstractList<E>
    implements RandomAccess, java.io.Serializable
{
    private static final long serialVersionUID = -2764017481108945198L;
    private final E[] a;

    ArrayList(E[] array) {
        a = Objects.requireNonNull(array);
    }

    @Override
    public int size() {
        return a.length;
    }

    @Override
    public Object[] toArray() {
        return a.clone();
    }

    @Override
    @SuppressWarnings("unchecked")
    public <T> T[] toArray(T[] a) {
        int size = size();
        if (a.length < size)
            return Arrays.copyOf(this.a, size,
                                    (Class<? extends T[]>) a.getClass());
        System.arraycopy(this.a, 0, a, 0, size);
        if (a.length > size)
            a[size] = null;
        return a;
    }

    @Override
    public E get(int index) {
        return a[index];
    }

    @Override
    public E set(int index, E element) {
        E oldValue = a[index];
        a[index] = element;
        return oldValue;
    }

    @Override
    public int indexOf(Object o) {
        E[] a = this.a;
        if (o == null) {
            for (int i = 0; i < a.length; i++)
                if (a[i] == null)
                    return i;
        } else {
            for (int i = 0; i < a.length; i++)
                if (o.equals(a[i]))
                    return i;
        }
        return -1;
    }

    @Override
    public boolean contains(Object o) {
        return indexOf(o) != -1;
    }

    @Override
    public Spliterator<E> spliterator() {
        return Spliterators.spliterator(a, Spliterator.ORDERED);
    }

    @Override
    public void forEach(Consumer<? super E> action) {
        Objects.requireNonNull(action);
        for (E e : a) {
            action.accept(e);
        }
    }

    @Override
    public void replaceAll(UnaryOperator<E> operator) {
        Objects.requireNonNull(operator);
        E[] a = this.a;
        for (int i = 0; i < a.length; i++) {
            a[i] = operator.apply(a[i]);
        }
    }

    @Override
    public void sort(Comparator<? super E> c) {
        Arrays.sort(a, c);
    }
}
```

这是一个位于Arrays类中的自定义的静态内部类，同样继承与AbstractList，仔细看源码会发现，没有
重写add和remove方法，那么当迭代器调用add和remove时，便调用的AbstractList的方法，再来到AbstractList中查看：
```java
public void add(int index, E element) {
    throw new UnsupportedOperationException();
}

public E remove(int index) {
    throw new UnsupportedOperationException();
}
```

巨坑，果然是巨坑！

---
## 三、 解决方案

再看刚才Arrays.asList()的注释，说得很清楚了，“This method acts as bridge between array-based and collection-based APIs”，这是个两种不同数据结构之间的桥梁，既然是桥梁，包含了桥梁必要的功能就行了，所以缺少了一些别的方法，我们不应该把这个伪ArrayList当做真ArrayList来使用，通过真ArrayList的构造方法，构造一个真ArrayList，便能解决该问题：
```java
List<String> pkgList = new ArrayList<>(Arrays.asList(pkgs));
```

---
## 四、 心得体会

- 作为一名coder，请保持好奇心，对不确定的东西，多去深入探究，挖掘知识，查漏补缺。

- 对于jdk源码，还是要多花点心思去学习，这里的学问太深了。

- 不能想当然地带着侥幸心理来开发，不报错不抛异常，并不代表代码就没问题，只是一些隐患还未暴露出来，若不及时纠正，将来可能在项目中酿成灾难。



