# Java函数式编程

## 一、 什么是函数式编程

### 1. 定义

> 函数式编程（Functional Programming）： 函数式编程是种编程范式，它将电脑运算视为函数的计算。函数编程语言最重要的基础是λ演算（lambda calculus），而且λ演算的函数可以接受函数当作输入（参数）和输出（返回值）。

简而言之，用数学函数的思想编写代码，一个函数即为一个映射关系，每一个输入值有确定的、唯一的输出值。

---
### 2. 特性

- **函数是一等公民**

函数与其他数据类型一样，可以用于赋值给其他变量，也可以作为参数传入一个函数中（相当于复合函数），还可以作为一个函数的返回值。

- **参数多态**

函数的参数既可以是数据类型，也可以是一个函数，对于 `y=f(x)` ，参数x既可以是一个值，也可以是另一个函数 `x=g(z)` 。

- **闭包**

函数内部引用的所有变量，其作用域局限于函数内部，闭包内部和外部没有任何关系影响。换句话说，函数内部描述的是怎么去做，整个过程处于一个黑盒中。

- **高阶函数**

对函数的嵌套使用，即复合函数，便是高阶函数，常用的一些对集合操作的已封装高阶函数例如：sort，map，reduce，filter等。

- **匿名函数**

匿名函数即lambda表达式，它是一种语法糖，对于FP，无需关心每一个函数叫什么名字，只需要知道它用于做什么，匿名便起到对代码结构的简化。

- **惰性计算**

函数的计算不是发生在定义时，而是发生在函数调用时，即发生在函数接收到实参之后。

- **递归**

通过形如链式调用的方式连续调用多个函数，每次调用的输出值作为下一个函数的输入值，相当于多层嵌套的复合函数。

- **柯里化**

把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数（相当于复合函数化简）。

- **无副作用**

函数内部与外界完全独立，所有功能只是返回一个值，而不影响外部变量的值。

- **引用透明**

函数输出值只取决于输入值，而不受外部任何变量影响。因此可以从函数内部实现推断函数行为。

---
### 3. 优势

- **代码简洁，开发快速**

通过函数复用，提升代码复用率。利用lambda语法糖，进一步简化代码结构。

- **易于理解**

模块化程度高，输出结果具有明确性，能根据输入值推断输出结果，便于验证函数正确性。

- **易于并发编程**

函数内部计算过程不影响外部变量，不存在线程问题，因此是并发安全的。

---
## 二、 Java函数式编程

### 1. Java 8新特性

Java 8是java版本迭代中非常重要的一个版本，新增了很多重要的功能和api，本文重点讲述以下几个内容：**函数式接口**、**Lambda语法糖**、**集合操作的Stream接口**、**对象操作的Optional类**。

---
### 2. 函数式接口

#### *(1) FunctionalInterface*
```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE})
public @interface FunctionalInterface {
}
```

实现一个函数式接口需要满足以下条件：
- 接口需要使用`FunctionalInterface`注解：使用该注解后，接口中如果声明超过一个的抽象方法时，会报错，实际开发中，往往会省略该注解
- 接口只包含一个抽象方法，可以包含多个default方法：这样便可以使用lambda语法简化代码结构

示例：
```java
@FunctionalInterface
public interface Callback {
    void onProcess(Object data);

    dufault void onBefore(Object data){
    }
    
    dufault void onAfter（Object data){
    }
}
```

---
#### *(2) Consumer*
```java
@FunctionalInterface
public interface Consumer <T> {
    void accept(T t);

    default Consumer<T> andThen(Consumer<? super T> after) {
        Objects.requireNonNull(after);
        return (T t) -> { accept(t); after.accept(t); };
    }
}
```

`Consumer`即消费者，是Java 8新增的函数式接口，它接收一个入参，执行操作，无返回值，示例：
```java
Consumer<String> test = str -> Log.d("Test", str);
```

`andThen`方法用于拼接`Consumer`执行，其内部默认实现本质上是构造了一个复合函数，内层为当前函数，外层为拼接的下一个函数，其运行时的效果等价为：先执行自身的`accept`，再执行拼接的`accept`，示例：
```java
public class Demo {
    private static final String TAG = "Demo";
    private Consumer<String> getUp = persoon -> Log.d(TAG, persoon + " get up");
    private Consumer<String> work = persoon -> Log.d(TAG, persoon + " work");
    private Consumer<String> eat = persoon -> Log.d(TAG, persoon + " eat");
    private Consumer<String> goHome = persoon -> Log.d(TAG, persoon + " go home");
    private Consumer<String> sleep = persoon -> Log.d(TAG, persoon + " sleep");

    private void test() {
        getUp.andThen(work).andThen(eat).andThen(goHome).andThen(sleep).accept("Programmer");
    }

    public static void main(String[] args) {
        new Demo().test();
    }
}
```

输出结果：
```
Demo, Programmer get up
Demo, Programmer work
Demo, Programmer eat
Demo, Programmer go home
Demo, Programmer sleep
```

---
#### *(3) Function*
```java
@FunctionalInterface
public interface Function<T, R> {
    R apply(T t);
    
    default <V> Function<V, R> compose(Function<? super V, ? extends T> before) {
        Objects.requireNonNull(before);
        return (V v) -> apply(before.apply(v));
    }
    
    default <V> Function<T, V> andThen(Function<? super R, ? extends V> after) {
        Objects.requireNonNull(after);
        return (T t) -> after.apply(apply(t));
    }
    
    static <T> Function<T, T> identity() {
        return t -> t;
    }
}
```

如果我们希望得到函数的结果，那么就可以使用函数`Function`这个接口，顾名思义，这个接口就是起到函数`y=f(x)`的效果。接口声明定义的泛型有两个，**T**是入参的**Type**，而**R**指的是返回值**Return**。

`apply`这个方法，接受一个入参，经过内部函数变换，返回一个结果。示例：
```java
Function<Integer, String> test = i -> {
    return String.valueOf(i);
};
```

或使用Lambda简化为：
```java
Function<Integer, String> test = i -> String.valueOf(i);
```

`andThen`和`Consumer`类似，构造了一个复合函数，先执行自身的`apply`，再执行拼接的`apply`，示例：
```java
public class Demo {
    private static final String TAG = "Demo";
    private Function<Integer, Integer> increase = i -> i + 1;
    private Function<Integer, Integer> square = i -> i * i;
    private Function<Integer, Integer> triple = i -> i * 3;

    private void test() {
        int result = increase.andThen(square).andThen(triple).apply(2);
        Log.d(TAG, "result = " + result);
    }

    public static void main(String[] args) {
        new Demo().test();
    }
}
```

输出结果：
```
Demo, result = 27
```

`compose`和`andThen`的执行顺序相反，先执行拼接的`apply`，再执行自身的`apply`，示例：
```java
public class Demo {
    private static final String TAG = "Demo";
    private Function<Integer, Integer> increase = i -> i + 1;
    private Function<Integer, Integer> square = i -> i * i;
    private Function<Integer, Integer> triple = i -> i * 3;

    private void test() {
        int result = increase.compose(square).compose(triple).apply(2);
        Log.d(TAG, "result = " + result);
    }

    public static void main(String[] args) {
        new Demo().test();
    }
}
```

输出结果：
```
Demo, result = 37
```

`identity`用于得到复合函数整体，即：返回y=f(g(h(x)))，示例：
```java
public class Demo {
    private static final String TAG = "Demo";
    private Function<Integer, Integer> increase = i -> i + 1;
    private Function<Integer, Integer> square = i -> i * i;
    private Function<Integer, Integer> triple = i -> i * 3;

    private void test() {
        Function<Integer, Object> compose = Function.identity().compose(increase).compose(square).compose(triple);
        Log.d(TAG, "result = " + compose.apply(5));
    }

    public static void main(String[] args) {
        new Demo().test();
    }
}
```

输出结果：
```
Demo, result = 226
```

---
#### *(4) Predicate*

```java
@FunctionalInterface
public interface Predicate<T> {
    boolean test(T t);

    default Predicate<T> and(Predicate<? super T> other) {
        Objects.requireNonNull(other);
        return (t) -> test(t) && other.test(t);
    }

    default Predicate<T> negate() {
        return (t) -> !test(t);
    }

    default Predicate<T> or(Predicate<? super T> other) {
        Objects.requireNonNull(other);
        return (t) -> test(t) || other.test(t);
    }

    static <T> Predicate<T> isEqual(Object targetRef) {
        return (null == targetRef)
                ? Objects::isNull
                : object -> targetRef.equals(object);
    }
}
```

断言接口，用于条件处理，它的方法从命名上便能理解用途：`test`直接返回判断结果，`and`相当于条件与，`or`相当于条件或，`negate`是条件非，`isEqual`判等，示例：
```java
package demo;

import java.util.function.Predicate;

public class Demo {
    private static final String TAG = "Demo";
    private Predicate<Programmer> isOldProgrammer = programmer -> programmer.age >= 35;
    private Predicate<Programmer> isMaleProgrammer = programmer -> programmer.gender == Gender.MALE;
    private Predicate<Programmer> isSoftwareEngineer = programmer -> programmer.position.equals(Position.SOFTWARE_ENGINEER);

    private void test() {
        Programmer programmer = new Programmer(23, Gender.MALE, Position.SOFTWARE_ENGINEER);
        Log.d(TAG, "is NOT old programmer: " + isOldProgrammer.negate().test(programmer));
        Log.d(TAG, "is male software engineer: " + isMaleProgrammer.and(isSoftwareEngineer).test(programmer));
    }

    public static void main(String[] args) {
        new Demo().test();
    }

    public static class Programmer {
        public final int age;
        public final int gender;
        public final String position;

        public Programmer(int age, @Gender int gender, @Position String position) {
            this.age = age;
            this.gender = gender;
            this.position = position;
        }
    }

    public @interface Gender {
        int FEMALE = 0;
        int MALE = 1;
    }

    public @interface Position {
        String SOFTWARE_ENGINEER = "software_engineer";
        String HARDWARE_ENGINEER = "hardware_engineer";
    }
}
```

输出结果：
```
Demo, is NOT an old programmer: true
Demo, is a male software engineer: true
```

---
### 3. Lambda表达式

Lambda表达式是基于数学中的λ演算得来，本质上是一个匿名函数，只有符合函数式接口必要条件（只有一个抽象方法）的接口才能改写为Lambda表达式。

在格式上，它具有以下几个要求：

- 参数不声明类型
- 如果只有一个参数，可以省略小括号，否则需要用括号将参数括起来
- 如果函数主体只有一个语句，可以省略大括号，否则需要用括号将函数主体括起来
- 如果函数主体是一个有返回值的语句，则可以省略return，否则需要明确表示返回值

示例：
```java
public class Demo {
    private static final String TAG = "Demo";

    Consumer<String> origin1 = new Consumer<String>() {
        @Override
        public void accept(String str) {
            Log.d(TAG, str);
        };
    };
    Consumer<String> lambda1 = str -> Log.d(TAG, str);

    Runnable origin2 = new Runnable() {
        @Override
        public void run() {
            Log.d(TAG, "no param");
        }
    };
    Runnable lambda2 = () -> Log.d(TAG, "no param");

    Function<Integer, String> origin3 = new Function<Integer, String>() {
        @Override
        public String apply(Integer i) {
            return String.valueOf(i);
        };
    };
    Function<Integer, String> lambda3 = i -> String.valueOf(i);
}
```

---
### 4. Stream接口

`Stream`接口定义了一系列集合操作的高阶函数的抽象方法，`Collection`接口中的`stream`方法和`parallelStream`获取其实例，而集合类直接或间接地实现了`Collection`接口，从而支持这些高阶函数。

区别在于，`stream`返回的是一个普通流，`parallelStream`返回的是一个并行流，后者在一定程度上能在并行下提升性能，但如果使用场景不当，则会降低性能。

API介绍：

```java
public interface Stream<T> extends BaseStream<T, Stream<T>> {

    /**
     * 按条件进行过滤，返回过滤后的流。
     */
    Stream<T> filter(Predicate<? super T> predicate);

    /**
     * 传入一个映射函数，将旧的流中的每一个元素转换为新的元素，返回新的流。
     */
    <R> Stream<R> map(Function<? super T, ? extends R> mapper);

    /**
     * 传入一个映射函数，将旧的流中的每一个元素转换为整型，返回整型流。
     */
    IntStream mapToInt(ToIntFunction<? super T> mapper);

    /**
     * 传入一个映射函数，将旧的流中的每一个元素转换为长整型，返回长整型流。
     */
    LongStream mapToLong(ToLongFunction<? super T> mapper);

    /**
     * 传入一个映射函数，将旧的流中的每一个元素转换为双精度浮点型，返回双精度浮点型流。
     */
    DoubleStream mapToDouble(ToDoubleFunction<? super T> mapper);

    /**
     * 如果旧的流中的元素本身也是集合，相当于原始数据是二维集合，该方法把旧的流中的每一个元素集合中的子元素，
     * 转换为新的元素，最后全部汇总为一个新的流，即：将二维集合映射为一维集合。
     */
    <R> Stream<R> flatMap(Function<? super T, ? extends Stream<? extends R>> mapper);

    /**
     * 去除重复元素，内部实现是通过元素的equals方法，返回新的流。
     */
    Stream<T> distinct();

    /**
     * 对元素进行排序，返回新的流。
     * 只有元素本身实现了Comparable接口，才能调用该方法，否则会抛出异常。
     */
    Stream<T> sorted();

    /**
     * 传入一个比较器，对元素进行排序，返回新的流。
     */
    Stream<T> sorted(Comparator<? super T> comparator);

    /**
     * 遍历每一个元素，进行操作，并返回流。
     * 和forEach的区别在于，forEach是一个终端方法，无返回值，所以不能接着调用其他方法。
     */
    Stream<T> peek(Consumer<? super T> action);

    /**
     * 返回前maxSize个元素组成的新的流
     */
    Stream<T> limit(long maxSize);

    /**
     * 忽略前n个元素，返回剩下元素组成的新的流
     */
    Stream<T> skip(long n);

    /**
     * 遍历每一个元素，进行操作，无返回值，属于终端方法，如需后续调用，应该使用peek
     */
    void forEach(Consumer<? super T> action);

    /**
     * 按顺序地遍地每一个元素并进行操作，和forEach的区别在于，如果流是并行流，那么forEach无法保证顺序，
     * 而forEachOrdered要求顺序，就不应该在并行流时使用，否则会有严重性能问题
     */
    void forEachOrdered(Consumer<? super T> action);

    /**
     * 返回流中的元素组成的数组
     */
    Object[] toArray();

    /**
     * 传入一个初始值和二元操作函数，用于计算流中的元素得到一个最终结果。
     */
    T reduce(T identity, BinaryOperator<T> accumulator);

    /**
     * 只传入二元操作函数，因此可能无法执行得到结果，所以返回的是Optional对象。
     */
    Optional<T> reduce(BinaryOperator<T> accumulator);

    /**
     * 将流中的元素按传入的收集器的规则进行收集。
     */
    <R, A> R collect(Collector<? super T, A, R> collector);

    /**
     * 按照比较器的规则，返回流中元素最小值，可能没有最小值，因此返回Optional对象。
     */
    Optional<T> min(Comparator<? super T> comparator);

    /**
     * 按照比较器的规则，返回流中元素最大值，可能没有最大值，因此返回Optional对象。
     */
    Optional<T> max(Comparator<? super T> comparator);

    /**
     * 返回流中元素个数。
     */
    long count();

    /**
     * 判断流中是否有任何元素满足条件。
     */
    boolean anyMatch(Predicate<? super T> predicate);

    /**
     * 判断流中是否所有元素都满足条件。
     */
    boolean allMatch(Predicate<? super T> predicate);

    /**
     * 判断流中是否没有元素满足条件。
     */
    boolean noneMatch(Predicate<? super T> predicate);

    /**
     * 返回流中第一个元素的Optional对象。
     */
    Optional<T> findFirst();

    /**
     * 返回流中任何一个元素的Optional对象，普通流返回的是第一个，相当于findFirst，
     * 而并行流返回的可能是任何一个。
     */
    Optional<T> findAny();

    /**
     * 创建一个没有元素的空的流。
     */
    public static<T> Stream<T> empty() {
        // TODO
    }

    /**
     * 创建只有一个元素的流。
     */
    public static<T> Stream<T> of(T t) {
        // TODO
    }

    /**
     * 将同一类的多个对象创建为流。
     */
    public static<T> Stream<T> of(T... values) {
        return Arrays.stream(values);
    }

    /**
     * 传入一个初始值和一元操作函数，将计算结果再次调用函数得到新的计算结果，不断迭代，返回所有的计算结果组成的流。
     */
    public static<T> Stream<T> iterate(final T seed, final UnaryOperator<T> f) {
        // TODO
    }

    /**
     * 传入一个无参函数，返回函数生成的值组成的流。
     */
    public static<T> Stream<T> generate(Supplier<T> s) {
        // TODO
    }

    /**
     * 将两个同泛型的流拼接成一个流。
     */
    public static <T> Stream<T> concat(Stream<? extends T> a, Stream<? extends T> b) {
        // TODO
    }
}
```

由于方法太多，且方法名能直观反映其含义，所以不再一一举例说明。下面简单提一下并行流的注意事项：

- 在方法实现涉及顺序时，应该避免使用并行流，例如`reduce`,`limit`,`skip`,`findFirst`等
- 非顺序存储数据结构的集合，应该避免使用并行流，例如`LinkedList`,`LinkedHashMap`,`LinkedHashSet`等

---
### 5. Optional类

`Optional`是一个包装类（类似基本类型包装类、引用类型包装类），旨在减少代码中出现空指针异常，适当地使用该类，可以避免泛滥的判空代码，提升整体可读性和美观性。

源码分析：

```java
public final class Optional<T> {
    /**
     * 默认的空值的Optional对象，其value为null。
     */
    private static final Optional<?> EMPTY = new Optional<>();

    private final T value;

    /**
     * 私有无参构造方法，创建一个空值的Optional对象。
     */
    private Optional() {
        this.value = null;
    }

    /**
     * 返回一个空值的Optional对象。
     */
    public static<T> Optional<T> empty() {
        @SuppressWarnings("unchecked")
        Optional<T> t = (Optional<T>) EMPTY;
        return t;
    }

    /**
     * 私有构造方法，如果值为空，会抛出NPE。
     */
    private Optional(T value) {
        this.value = Objects.requireNonNull(value);
    }

    /**
     * 由一个给定值创建Optional对象。
     */
    public static <T> Optional<T> of(T value) {
        return new Optional<>(value);
    }

    /**
     * 由一个可能为空的给定值创建Optional对象，如果值为空，则返回空值的Optional对象。
     */
    public static <T> Optional<T> ofNullable(T value) {
        return value == null ? empty() : of(value);
    }

    /**
     * 获取Optional对象的值，应该在确保值不为空的情况下调用该方法。
     */
    public T get() {
        if (value == null) {
            throw new NoSuchElementException("No value present");
        }
        return value;
    }

    /**
     * 判断值是否为空。
     */
    public boolean isPresent() {
        return value != null;
    }

    /**
     * 传入一个Consumer，仅在值不为空的情况下执行。
     */
    public void ifPresent(Consumer<? super T> consumer) {
        if (value != null)
            consumer.accept(value);
    }

    /**
     * 传入一个Predicate，如果值为空，则直接返回自身，
     * 否则返回条件过滤后的Optional对象（不符合条件时返回的是值为空的Optional对象）。
     */
    public Optional<T> filter(Predicate<? super T> predicate) {
        Objects.requireNonNull(predicate);
        if (!isPresent())
            return this;
        else
            return predicate.test(value) ? this : empty();
    }

    /**
     * 传入一个映射函数，如果值为空，则值为空的Optional对象，
     * 否则返回映射后的值构造的Optional对象。
     */
    public<U> Optional<U> map(Function<? super T, ? extends U> mapper) {
        Objects.requireNonNull(mapper);
        if (!isPresent())
            return empty();
        else {
            return Optional.ofNullable(mapper.apply(value));
        }
    }

    /**
     * 和map不同之处在于，映射函数限定了映射后也是一个Optional对象。
     */
    public<U> Optional<U> flatMap(Function<? super T, Optional<U>> mapper) {
        Objects.requireNonNull(mapper);
        if (!isPresent())
            return empty();
        else {
            return Objects.requireNonNull(mapper.apply(value));
        }
    }

    /**
     * 传入一个备用值，如果当前值为空，则返回备用值。
     */
    public T orElse(T other) {
        return value != null ? value : other;
    }

    /**
     * 和orElse作用完全一样，区别在于，如果入参是一个方法，那么orElse一定会执行，
     * 而orElseGet根据惰性计算这个特性，仅在发生时才执行，即仅在当前值为空时才执行入参的方法。
     */
    public T orElseGet(Supplier<? extends T> other) {
        return value != null ? value : other.get();
    }

    /**
     * 当前值为空时会抛出异常。
     */
    public <X extends Throwable> T orElseThrow(Supplier<? extends X> exceptionSupplier) throws X {
        if (value != null) {
            return value;
        } else {
            throw exceptionSupplier.get();
        }
    }
}
```

`Optional`类将判空相关代码封装在内部，调用者只需关注非空情况下的业务代码，甚至结合链式调用，优化代码结构。

---
## 三、 总结

**函数式编程**作为热门的、主流的编程范式之一，在很久以前便已经出现在其他编程语言中，java较晚地支持这一能力，但是其带来的好处是非常明显且巨大的。对于java语言使用者，应当掌握这一新特性，并加以利用，以达到提升代码质量的目的。

---
## 四、 参考文献

- [你真的理解函数式编程吗？](https://blog.csdn.net/valada/article/details/79909782)
- [函数式编程](https://baike.baidu.com/item/%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BC%96%E7%A8%8B/4035031?fr=aladdin)
- [什么是函数式编程](https://www.jianshu.com/p/d59fa2ef0d78)
- [Java8新特性学习-函数式编程](https://blog.csdn.net/icarusliu/article/details/79495534)
- [2019-02-03——Java8 Lambda](https://www.jianshu.com/p/fd8c2ce34bd2)
- [简洁又快速地处理集合——Java8 Stream（下）](https://cloud.tencent.com/developer/article/1187833)
- [Java Optional使用的最佳实践](https://www.jdon.com/52008)
- [理解、学习与使用 Java 中的 Optional](https://www.cnblogs.com/zhangboyu/p/7580262.html)