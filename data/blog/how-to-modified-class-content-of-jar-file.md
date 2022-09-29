---
title: 如何在没有源代码的情况下修改jar包的内容并重新发布
date: 2022-02-16 23:41:38
tags: java
---

因为种种原因我们没有办法得到jar包的源代码，这个时候想要进行修改的话，稍微有点麻烦，我踩了一些坑，现在记下来。
一共有三个点：

1. 如何根据.jar文件得到源代码
2. 修改源代码后如何处理好依赖，编译出.class文件
3. 如何重新打包

## 根据jar包得到源代码

我们有两个方式得到源代码 ，一个是在Idea这个超强的IDE里点击jar包里的类，就可以直接反编译得到源代码；一个是使用jd这个工具。重点介绍一下后者。
我使用的是jd的一个命令行的封装，jd-cli.jar,可以这里下载[jd-cli.jar](https://static.yuanfeix.com/dist/jd-cli.jar) 
使用的时候，一条命令就能全部分编译：
```sh
java -jar ~/bin/jd-cli.jar ./some.jar
```
 
反编译之后即可以得到一个压缩包，如果原始的是some.jar,反编译会得到some.src.jar,里面包含有所有资源文件、源代码。
我们执行

```
jar -xf some.src.jar
```

即可以打开这个压缩包。

## 修改java,编译所需的.class

拿到源代码后，我们就需要修改源代码，生成新的.class文件。
打开Idea 建一个工程，新建这个类,将源代码拷贝进去，执行编译。
这个是我们会发现编译会失败，因为依赖的一些类会找不到。
这个时候不要着急，有一些知道是在哪个包里的，可以在pom.xml里的dependencies 里加上。
如果不知道，就把刚才的原始jar包解压缩，从文件里找，像刚才这个就依赖了fastjson,在解压之后的BOOT-INF/lib/下找到了一个some-common-1.0.SNAPSHOT.jar; 这个包我们没有源代码，从maven中央仓库也搜不到。于是我们添加本地依赖，将这个包拷贝进来放在lib目录里，在pom.xml里添加:
```xml
 <dependency>
            <groupId>com.some.parent</groupId>
            <artifactId>some-common</artifactId>
            <version>1.0-SNAPSHOT</version>
            <scope>system</scope>
            <systemPath>${project.basedir}/libs/some-common-1.0-SNAPSHOT.jar</systemPath>
 </dependency>
 ```
 
现在依赖解决了，在idea里执行编译可以在target目录下生成新的类。

## 重新打包

一开始我的方式是把原始的jar包解压缩,用我修改之后的class切换掉的对应的文件之后，再重新压缩。
计划的脚本如下:

```
mkdir tmp
cd tmp
cp ../some.jar ./
jar -xf ./some.jar
cp ../target/classes/com/some/SomeService.class ./BOOT-INF/classes/com/some/
rm ./some.jar
jar -cf ./some.jar .

```

没想到这样的有一个问题，这样打包之后用 <kbd>java -jar ./some.jar</kbd> 运行有报错：

    ./some.jar中没有主清单属性
    
我仔细对比发现，原始的jar包里/META-INF/MANIFEST.MF 文件有十多行，其中有一行Main-Class和一行Start-Class;而用<kbd>jar -cf some.jar ./</kbd>生成的jar包只有：
```
 Manifest-Version: 1.0
 Created-By: 11.0.6 (Oracle Corporation)
 ```
 
不一样的，查询了一下文档，发现需要用到jar命令的更新文件功能，实际使用是：

```
jar -uf ./some.jar ./BOOT-INF/classes/com/some/SomeService.class
```

这个才是就地更新jar包中的某一个文件，而不是重新打包一个。