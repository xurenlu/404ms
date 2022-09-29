---
title: sonarqube简易上手指南
date: 2022-02-16 15:04:08
tags: sonarqube,technological,java,coding
---

### sonarqube 是什么

Sonarqube 是一个开源的代码质量管理系统,支持超过25种编程语言：Java、C/C++、C#、PHP、Flex、Groovy、JavaScript、Python、PL/SQL、COBOL、Golang、Javascript等，目前已经与诸多外部工具做了很好的集成,分析报告中可以对重复代码、编码标准、单元测试、代码覆盖率、代码复杂度、潜在Bug、注释问题等提出建议。
下面两张图是几个界面，大家感受一下。

![https://404.ms/file/xurenlu202202/19211300.7112.png](https://404.ms/file/xurenlu202202/19211300.7112.png)

![https://404.ms/file/xurenlu202202/69928200.5266.png](https://404.ms/file/xurenlu202202/69928200.5266.png)

### 安装
可以从 [https://www.sonarqube.org/](https://www.sonarqube.org/) 下载安装版，解压后，执行 bin/{your-platform}/sonar.sh 即可。比如我的是mac,就执行<kbd>bin/macosx-universal-64/sonar.sh</kbd>来启动。

    注意，现在sonarqube需要至少jdk11才能运行。
    
启动后，sonarqube会工作在9000端口，可以访问 http://127.0.0.1:9000 来访问。
访问时，默认的用户名、密码是admin/admin。
进入后，在右上解有一个MyAccount菜单，点进去：
![https://404.ms/file/xurenlu202202/52285700.7667.png](https://404.ms/file/xurenlu202202/52285700.7667.png)
点[Security] 进入到token 管理页:
![https://404.ms/file/xurenlu202202/74438500.9902.png](https://404.ms/file/xurenlu202202/74438500.9902.png)

生成一个新的token,记录它:![https://404.ms/file/xurenlu202202/70573300.8815.png](https://404.ms/file/xurenlu202202/70573300.8815.png)





## 与Maven 集成、分析java项目

1. 修改 ~/.m2/settings.xml 的内容 加上这段sonar相关的profile，并指定acitiveProfile是sonar
```xml

<profiles>
        <profile>
            <id>default</id>
            <activation>
                <activeByDefault>true</activeByDefault>
                <jdk>1.8</jdk>
            </activation>
        </profile>
 <profile>
    <id>sonar</id>
        <properties>
            <sonar.host.url>http://172.17.0.1:9000</sonar.host.url>
            <sonar.login>这里填上那个token</sonar.login>
        </properties>
    </profile>
    </profiles>
		<activeProfiles>
      <activeProfile>sonar</activeProfile>
</activeProfiles>

```

其实就加上了sonar.host.url这一个配置。
接下来在java项目的根目录下运行 <kbd>mvn sonar:sonar</kbd>即可。

稍等一会，就会给出报告地址。
![https://404.ms/file/xurenlu202202/44183200.9746.png](https://404.ms/file/xurenlu202202/44183200.9746.png)


## 安装sonar-scanner 
对php、python等项目扫描，需要先安装sonar-scanner,在Mac上是执行:
<kbd>brew install sonar-scanner</kbd>即可。
安装完以后，根据您sonar-scanner的安装路径，修改配置。在我的电脑上是这个文件是
<kbd>/usr/local/Cellar/sonar-scanner/4.0.0.1744/libexec/conf/sonar-scanner.properties</kbd>
内容如下:

```
sonar.host.url=http://172.17.0.1:9000
sonar.login=您刚才在sonarqube后台复制的token
```

接下来在要扫描的php/python/golang项目的根目录下创建<kbd>sonar-project.properties</kbd>文件 ，重点指定好源代码目录 ，内容参照这个

```
sonar.projectKey=ll-admin
sonar.projectName=ll-admin
sonar.projectVersion=1.0
sonar.exclusions=node_modules
sonar.sources=./src/
sonar.tests=./tests/
```

然后在代码根目录下运行 <kbd>sonar-scanner</kbd>就好啦。

## 最后也是最重要的

sonarqube内置了超多规则，在指出代码问题的同时，讲解了为什么不可以这么做。多看一看，非常有收获。