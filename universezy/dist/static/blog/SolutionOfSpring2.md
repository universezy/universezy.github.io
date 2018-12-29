## 一、 问题日志
```shell
严重: Servlet.service() for servlet [spring] in context with path [/XXXXX] threw exception [Request processing failed; nested exception is org.springframework.dao.EmptyResultDataAccessException: Incorrect result size: expected 1, actual 0] with root cause
org.springframework.dao.EmptyResultDataAccessException: Incorrect result size: expected 1, actual 0
	at org.springframework.dao.support.DataAccessUtils.nullableSingleResult(DataAccessUtils.java:97)
	at org.springframework.jdbc.core.JdbcTemplate.queryForObject(JdbcTemplate.java:779)
```

---
## 二、 问题原因

顺藤摸瓜，打开"DataAccessUtils"：
```java
/**
 * Return a single result object from the given Collection.
 * <p>Throws an exception if 0 or more than 1 element found.
 * @param results the result Collection (can be {@code null}
 * and is also expected to contain {@code null} elements)
 * @return the single result object
 * @throws IncorrectResultSizeDataAccessException if more than one
 * element has been found in the given Collection
 * @throws EmptyResultDataAccessException if no element at all
 * has been found in the given Collection
 * @since 5.0.2
 */
@Nullable
public static <T> T nullableSingleResult(@Nullable Collection<T> results) throws IncorrectResultSizeDataAccessException {
	// This is identical to the requiredSingleResult implementation but differs in the
	// semantics of the incoming Collection (which we currently can't formally express)
	if (CollectionUtils.isEmpty(results)) {
		throw new EmptyResultDataAccessException(1);
	}
	if (results.size() > 1) {
		throw new IncorrectResultSizeDataAccessException(1, results.size());
	}
	return results.iterator().next();
}
```

从注释或者源码可以看出，数据库执行结果为0时，抛出"EmptyResultDataAccessException"异常，大于1时，抛出"IncorrectResultSizeDataAccessException"异常，这样设计有个好处，就是更加详细地反馈了数据信息，便于开发者处理查询结果。

---
## 三、 解决方案

在调用"queryForObject"方法的位置捕捉以上两种异常，参考：
```java
public UserVO queryUserByEmail(String email) {
	String SQL = "select * from " + Const.User.TABLE_NAME + " where " + Const.User.COLUMN_EMAIL + " = ?";
	UserVO userVO = null;
	try {
		userVO = jdbcTemplate.queryForObject(SQL, new UserMapper(), email);
		if (userVO != null) {
			userVO.setPassword("");
		}
	} catch (EmptyResultDataAccessException e) {
		e.printStackTrace();
	} catch (IncorrectResultSizeDataAccessException e) {
		e.printStackTrace();
	}
	return userVO;
}
```

---
## 四、 参考文献

- [Spring中EmptyResultDataAccessException异常产生的原理及处理方法](https://blog.csdn.net/u011983531/article/details/48858261)

- [JdbcTemplate中queryForObject的EmptyResultDataAccessException问题](https://www.cnblogs.com/blog411032/p/6057899.html)